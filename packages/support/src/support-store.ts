import type { SupportFlowRequest, SupportFlowResponse } from '@iap/api-types'
import { create } from 'zustand'

import type { SupportFlowContext } from './support-context'
import { supportService } from './support-service'

export type SupportFlowOption = {
  id: string
  label: string
  requiredParam?: string
  source: 'question' | 'response'
}

type SupportFlowState = {
  context: SupportFlowContext
  error: boolean
  hasInitialQuestions: boolean
  isLoading: boolean
  isLoadingMore: boolean
  isOpen: boolean
  response: SupportFlowResponse | null
  selected: string[]
  close: () => void
  goBack: () => void
  loadMore: () => Promise<void>
  open: () => void
  reset: (context: SupportFlowContext) => Promise<void>
  select: (option: SupportFlowOption) => Promise<void>
  submitText: (value: string) => Promise<void>
}

const pageSize = 10
const initialContext: SupportFlowContext = { isMyIap: false, pageKey: '' }

function request(context: SupportFlowContext, payload: SupportFlowRequest) {
  return context.isPublic
    ? supportService.publicAnswer({ ...payload, pageKey: context.pageKey })
    : supportService.myAnswer({ ...payload, pageKey: context.pageKey })
}

function optionsFromResponse(response: SupportFlowResponse | null) {
  const questions = (response?.nextSelectableQuestionKeys ?? [])
    .filter((item) => item.key)
    .map((item) => ({
      id: item.key as string,
      label: item.title ?? item.key ?? '',
      requiredParam: item.requiredParam ?? undefined,
      source: 'question' as const,
    }))
  const options = (response?.response?.options?.content ?? []).flatMap(
    (item): SupportFlowOption[] => {
      const id = item.id ?? item.businessKey?.toString() ?? item.title
      if (!id) return []

      return [
        {
          id,
          label: item.title ?? item.displayName ?? id,
          source: 'response' as const,
        },
      ]
    }
  )

  return [...questions, ...options]
}

export const useSupportFlowStore = create<SupportFlowState>((set, get) => ({
  context: initialContext,
  error: false,
  hasInitialQuestions: false,
  isLoading: false,
  isLoadingMore: false,
  isOpen: false,
  response: null,
  selected: [],
  close: () => set({ isOpen: false }),
  goBack: () => set({ selected: get().selected.slice(0, -1) }),
  loadMore: async () => {
    const current = get().response
    const options = current?.response?.options
    if (!current || !options || options.last || get().isLoadingMore) return
    set({ isLoadingMore: true })
    try {
      const response = await request(get().context, {
        optionsPage: (options.number ?? 0) + 1,
        optionsSize: options.size ?? pageSize,
        parametersContext: current.parametersContext,
        questionStack: current.questionStack,
        selectedQuestionKey: current.questionStack?.at(-1),
      })
      const merged = {
        ...response,
        response: {
          ...response.response,
          options: {
            ...response.response?.options,
            content: [
              ...(current.response?.options?.content ?? []),
              ...(response.response?.options?.content ?? []),
            ],
          },
        },
      }
      set({ response: merged })
    } catch {
      set({ error: true })
    } finally {
      set({ isLoadingMore: false })
    }
  },
  open: () => set({ isOpen: true }),
  reset: async (context) => {
    set({
      context,
      error: false,
      hasInitialQuestions: false,
      isLoading: true,
      isOpen: false,
      response: null,
      selected: [],
    })
    try {
      const response = await request(context, {})
      set({
        hasInitialQuestions: Boolean(
          response.nextSelectableQuestionKeys?.length
        ),
        response,
      })
    } catch {
      set({ error: true })
    } finally {
      set({ isLoading: false })
    }
  },
  select: async (option) => {
    const current = get().response
    if (!current) return
    set({
      error: false,
      isLoading: true,
      selected: [...get().selected, option.label],
    })
    try {
      const parametersContext = { ...(current.parametersContext ?? {}) }
      const requiredParam =
        option.source === 'response'
          ? current.response?.requiredParam
          : undefined
      if (requiredParam) parametersContext[requiredParam] = option.id
      const response = await request(get().context, {
        optionsPage: 0,
        optionsSize: pageSize,
        parametersContext,
        questionStack: current.questionStack,
        selectedQuestionKey:
          option.source === 'response'
            ? current.questionStack?.at(-1)
            : option.id,
      })
      set({ response })
    } catch {
      set({ error: true, selected: get().selected.slice(0, -1) })
    } finally {
      set({ isLoading: false })
    }
  },
  submitText: async (value) => {
    const current = get().response
    const requiredParam = current?.response?.requiredParam
    if (!current || !requiredParam) return
    set({ error: false, isLoading: true, selected: [...get().selected, value] })
    try {
      const response = await request(get().context, {
        parametersContext: {
          ...(current.parametersContext ?? {}),
          [requiredParam]: value.trim(),
        },
        questionStack: current.questionStack,
        selectedQuestionKey: current.questionStack?.at(-1),
      })
      set({ response })
    } catch {
      set({ error: true, selected: get().selected.slice(0, -1) })
    } finally {
      set({ isLoading: false })
    }
  },
}))

export { optionsFromResponse }
