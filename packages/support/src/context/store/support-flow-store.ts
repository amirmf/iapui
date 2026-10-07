import {
  type SupportFlowRequest,
  type SupportFlowResponse,
} from '@iap/api-types'
import { produce } from 'immer'
import { create } from 'zustand'

import {
  type SelectedSupportQuestion,
  type SupportFlowAnswers,
  type SupportFlowOption,
  type SupportFlowStepRecord,
  mapSupportAnswerToOptions,
} from '../../components/support-flow-types'
import type { SupportFlowContext } from '../../model/support-flow-context'
import { supportService } from '../../services/support-service'

type LoadInitialOptions = {
  errorMessage: string
  force?: boolean
}

type ResetFlowOptions = LoadInitialOptions & {
  context?: SupportFlowContext
}

type SelectOptionOptions = {
  option: SupportFlowOption
  errorMessage: string
}

type SubmitTextOptions = {
  value: string
  errorMessage: string
}

type OpenFeatureSupportOptions = {
  featureKey: string
  errorMessage: string
}

type SupportFlowStore = {
  isOpen: boolean
  answers: SupportFlowAnswers
  isLoading: boolean
  isLoadingMoreOptions: boolean
  error: string | null
  steps: SupportFlowStepRecord[]
  hasLoadedInitialResponse: boolean
  hasInitialQuestions: boolean
  context: SupportFlowContext
  flowVersion: number
  openSupport: (context?: SupportFlowContext) => void
  openFeatureSupport: (options: OpenFeatureSupportOptions) => Promise<void>
  closeSupport: () => void
  loadInitialFlow: (options: LoadInitialOptions) => Promise<void>
  resetFlow: (options: ResetFlowOptions) => Promise<void>
  goBack: () => void
  selectOption: (options: SelectOptionOptions) => Promise<void>
  submitText: (options: SubmitTextOptions) => Promise<void>
  loadMoreOptions: (options: LoadInitialOptions) => Promise<void>
}

const SUPPORT_OPTIONS_PAGE_SIZE = 10

const createStep = (
  response: SupportFlowResponse,
  selected?: SelectedSupportQuestion
): SupportFlowStepRecord => ({
  id: crypto.randomUUID(),
  response,
  selected,
})

const answerSupportFlow = (
  payload: SupportFlowRequest,
  context: SupportFlowContext
): Promise<SupportFlowResponse> => {
  return context.isPublic
    ? supportService.publicAnswer(payload)
    : supportService.myAnswer(payload)
}

export const useSupportFlowStore = create<SupportFlowStore>((set, get) => ({
  isOpen: false,
  answers: {},
  isLoading: false,
  isLoadingMoreOptions: false,
  error: null,
  steps: [],
  hasLoadedInitialResponse: false,
  hasInitialQuestions: false,
  context: { isMyIap: false, pageKey: '' },
  flowVersion: 0,
  openSupport: (context) =>
    set({
      isOpen: true,
      ...(context ? { context } : {}),
    }),
  openFeatureSupport: async ({ featureKey, errorMessage }) => {
    const flowVersion = get().flowVersion + 1
    const pageKey = get().context.pageKey
    const initialStep = get().steps[0]

    set({
      isOpen: true,
      error: null,
      isLoading: true,
      isLoadingMoreOptions: false,
      flowVersion,
    })

    try {
      const [featureResponse, initialResponse] = await Promise.all([
        answerSupportFlow(
          { pageKey, featureKeys: [featureKey] },
          get().context
        ),
        initialStep
          ? Promise.resolve(initialStep.response)
          : answerSupportFlow({ pageKey }, get().context),
      ])

      if (get().flowVersion !== flowVersion) return

      set({
        steps: [createStep(initialResponse), createStep(featureResponse)],
        answers: {},
        hasLoadedInitialResponse: true,
        hasInitialQuestions: Boolean(
          initialResponse.nextSelectableQuestionKeys?.length
        ),
      })
    } catch {
      if (get().flowVersion === flowVersion) {
        set({ error: errorMessage })
      }
    } finally {
      if (get().flowVersion === flowVersion) {
        set({ isLoading: false })
      }
    }
  },
  closeSupport: () => set({ isOpen: false }),
  loadInitialFlow: async ({ errorMessage, force = false }) => {
    if (!force && (get().hasLoadedInitialResponse || get().isLoading)) return

    const flowVersion = get().flowVersion
    set({ isLoading: true, error: null })

    try {
      const response = await answerSupportFlow(
        {
          pageKey: get().context.pageKey,
        },
        get().context
      )

      if (get().flowVersion !== flowVersion) return

      set({
        steps: [createStep(response)],
        answers: {},
        hasLoadedInitialResponse: true,
        hasInitialQuestions: Boolean(
          response.nextSelectableQuestionKeys?.length
        ),
      })
    } catch {
      if (get().flowVersion === flowVersion) {
        set({ error: errorMessage })
      }
    } finally {
      if (get().flowVersion === flowVersion) {
        set({ isLoading: false })
      }
    }
  },
  resetFlow: async ({ errorMessage, context }) => {
    const currentContext = get().context
    const isSameContext =
      context?.isMyIap === currentContext.isMyIap &&
      context?.pageKey === currentContext.pageKey &&
      context?.isPublic === currentContext.isPublic

    if (isSameContext && get().isLoading && !get().hasLoadedInitialResponse) {
      return
    }

    set({
      steps: [],
      answers: {},
      error: null,
      hasLoadedInitialResponse: false,
      hasInitialQuestions: context ? false : get().hasInitialQuestions,
      ...(context ? { context } : {}),
      ...(context ? { isOpen: false } : {}),
      flowVersion: get().flowVersion + 1,
    })

    await get().loadInitialFlow({ errorMessage, force: true })
  },
  goBack: () =>
    set((state) => {
      if (state.steps.length <= 1) return state

      return {
        steps: state.steps.slice(0, -1),
        error: null,
      }
    }),
  selectOption: async ({ option, errorMessage }) => {
    if (option.action === 'close') {
      get().closeSupport()
      return
    }

    if (option.action === 'restart') {
      await get().resetFlow({ errorMessage })
      return
    }

    if (option.action === 'back') {
      get().goBack()
      return
    }

    if (option.action === 'open-url' && option.href) {
      window.open(option.href, '_blank', 'noopener,noreferrer')
      return
    }

    const currentStep = get().steps[get().steps.length - 1]
    const currentResponse = currentStep?.response ?? null
    const flowVersion = get().flowVersion

    set((state) => ({
      steps: currentResponse
        ? [
            ...state.steps.slice(0, -1),
            {
              ...state.steps[state.steps.length - 1]!,
              selected: {
                key: option.key.toString(),
                label: option.label,
                display:
                  option.source === 'response-option' ? 'OPTION' : 'QUESTION',
              },
            },
          ]
        : state.steps,
      error: null,
      isLoading: true,
    }))

    try {
      let payload: SupportFlowRequest = {
        questionStack: currentResponse?.questionStack,
        parametersContext: currentResponse?.parametersContext ?? {},
        optionsPage: 0,
        optionsSize: SUPPORT_OPTIONS_PAGE_SIZE,
        selectedQuestionKey: option.key.toString(),
      }
      payload = produce(payload, (draft) => {
        const requiredParam =
          option.source === 'response-option'
            ? currentResponse?.response?.requiredParam
            : null
        if (!draft.parametersContext) {
          draft.parametersContext = {}
        }
        if (requiredParam) {
          draft.parametersContext[requiredParam] = option.id.toString()
          draft.selectedQuestionKey =
            currentResponse?.questionStack?.[
              currentResponse?.questionStack?.length - 1
            ] ?? undefined
        }
      })
      const response = await answerSupportFlow(
        {
          ...payload,
          pageKey: get().context.pageKey,
        },
        get().context
      )

      if (get().flowVersion !== flowVersion) return

      set((state) => ({
        steps: [...state.steps, createStep(response)],
      }))
    } catch {
      if (get().flowVersion === flowVersion) {
        set((state) => ({
          error: errorMessage,
          steps:
            currentResponse && state.steps.length
              ? [
                  ...state.steps.slice(0, -1),
                  {
                    ...state.steps[state.steps.length - 1]!,
                    selected: undefined,
                  },
                ]
              : state.steps,
        }))
      }
    } finally {
      if (get().flowVersion === flowVersion) {
        set({ isLoading: false })
      }
    }
  },

  loadMoreOptions: async ({ errorMessage }) => {
    const currentStep = get().steps[get().steps.length - 1]
    const currentResponse = currentStep?.response ?? null
    const optionsPage = currentResponse?.response?.options

    if (
      get().isLoading ||
      get().isLoadingMoreOptions ||
      !currentResponse ||
      !optionsPage ||
      optionsPage.last
    ) {
      return
    }

    const nextPage = (optionsPage.number ?? 0) + 1
    const flowVersion = get().flowVersion

    set({ isLoadingMoreOptions: true, error: null })

    const payload: SupportFlowRequest = {
      questionStack: currentResponse?.questionStack,
      parametersContext: currentResponse.parametersContext ?? {},
      optionsPage: nextPage,
      optionsSize: optionsPage.size ?? SUPPORT_OPTIONS_PAGE_SIZE,
      selectedQuestionKey:
        currentResponse?.questionStack?.[
          currentResponse?.questionStack?.length - 1
        ] ?? undefined,
    }
    try {
      const response = await answerSupportFlow(
        {
          ...payload,
          pageKey: get().context.pageKey,
        },
        get().context
      )

      if (get().flowVersion !== flowVersion) return

      set((state) => {
        const activeStep = state.steps[state.steps.length - 1]
        const existingOptions =
          activeStep?.response.response?.options?.content ?? []
        const newOptions = response.response?.options?.content ?? []
        const mergedResponse = produce(response, (draft) => {
          if (!draft.response) draft.response = {}
          if (draft.response.options) {
            draft.response.options.content = [...existingOptions, ...newOptions]
          }
        })

        return {
          steps: activeStep
            ? [
                ...state.steps.slice(0, -1),
                {
                  ...activeStep,
                  response: mergedResponse,
                },
              ]
            : state.steps,
        }
      })
    } catch {
      if (get().flowVersion === flowVersion) {
        set({ error: errorMessage })
      }
    } finally {
      if (get().flowVersion === flowVersion) {
        set({ isLoadingMoreOptions: false })
      }
    }
  },
  submitText: async ({ value, errorMessage }) => {
    const currentStep = get().steps[get().steps.length - 1]
    const currentResponse = currentStep?.response ?? null
    const requiredParam = currentResponse?.response?.requiredParam
    const previousAnswers = get().answers
    const flowVersion = get().flowVersion

    set((state) => ({
      steps: currentResponse
        ? [
            ...state.steps.slice(0, -1),
            {
              ...state.steps[state.steps.length - 1]!,
              selected: {
                key: requiredParam ?? 'text',
                label: value,
                display: 'TEXT',
              },
            },
          ]
        : state.steps,
      answers: requiredParam
        ? { ...state.answers, [requiredParam]: value }
        : state.answers,
      error: null,
      isLoading: true,
    }))

    let payload: SupportFlowRequest = {
      questionStack: currentResponse?.questionStack,
      parametersContext: currentResponse?.parametersContext ?? {},
      selectedQuestionKey:
        currentResponse?.questionStack?.[
          currentResponse?.questionStack?.length - 1
        ] ?? undefined,
    }
    payload = produce(payload, (draft) => {
      if (!draft.parametersContext) {
        draft.parametersContext = {}
      }
      if (requiredParam) {
        draft.parametersContext[requiredParam] = value.trim()
      }
    })
    try {
      const response = await answerSupportFlow(
        {
          ...payload,
          pageKey: get().context.pageKey,
        },
        get().context
      )

      if (get().flowVersion !== flowVersion) return

      set((state) => ({
        steps: [...state.steps, createStep(response)],
      }))
    } catch {
      if (get().flowVersion === flowVersion) {
        set((state) => ({
          error: errorMessage,
          answers: previousAnswers,
          steps:
            currentResponse && state.steps.length
              ? [
                  ...state.steps.slice(0, -1),
                  {
                    ...state.steps[state.steps.length - 1]!,
                    selected: undefined,
                  },
                ]
              : state.steps,
        }))
      }
    } finally {
      if (get().flowVersion === flowVersion) {
        set({ isLoading: false })
      }
    }
  },
}))

export { mapSupportAnswerToOptions }
