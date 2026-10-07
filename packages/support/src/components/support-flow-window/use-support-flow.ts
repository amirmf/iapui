import { useCallback, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import { useSupportFlowStore } from '../../context/store/support-flow-store'
import type { SupportFlowContext } from '../../model/support-flow-context'
import {
  type SupportFlowOption,
  type SupportFlowStep,
  getSupportResponseMessage,
  mapSupportResponseToOptionItems,
  mapSupportResponseToQuestionItems,
  supportResponseRequiresTextInput,
} from '../support-flow-types'

export function useSupportFlow() {
  const { t } = useTranslation()
  const isOpen = useSupportFlowStore((state) => state.isOpen)
  const answers = useSupportFlowStore((state) => state.answers)
  const isLoading = useSupportFlowStore((state) => state.isLoading)
  const isLoadingMoreOptions = useSupportFlowStore(
    (state) => state.isLoadingMoreOptions
  )
  const isMyIap = useSupportFlowStore((state) => state.context.isMyIap)
  const hasInitialQuestions = useSupportFlowStore(
    (state) => state.hasInitialQuestions
  )
  const error = useSupportFlowStore((state) => state.error)
  const steps = useSupportFlowStore((state) => state.steps)
  const activeStep = steps[steps.length - 1] ?? null
  const currentResponse = activeStep?.response ?? null
  const selectedHistory = steps
    .map((step) => step.selected)
    .filter((selected) => Boolean(selected))
  const canGoBack = steps.length > 1
  const openSupport = useSupportFlowStore((state) => state.openSupport)
  const openFeatureSupport = useSupportFlowStore(
    (state) => state.openFeatureSupport
  )
  const closeSupport = useSupportFlowStore((state) => state.closeSupport)
  const loadInitialFlow = useSupportFlowStore((state) => state.loadInitialFlow)
  const resetStoreFlow = useSupportFlowStore((state) => state.resetFlow)
  const goBack = useSupportFlowStore((state) => state.goBack)
  const selectStoreOption = useSupportFlowStore((state) => state.selectOption)
  const submitStoreText = useSupportFlowStore((state) => state.submitText)
  const loadStoreMoreOptions = useSupportFlowStore(
    (state) => state.loadMoreOptions
  )

  useEffect(() => {
    if (!isOpen) return

    void loadInitialFlow({ errorMessage: t('supportFlow.errors.generic') })
  }, [isOpen, loadInitialFlow, t])

  const questions = mapSupportResponseToQuestionItems(currentResponse)
  const options = mapSupportResponseToOptionItems(currentResponse)
  const display = currentResponse?.response?.requiredParamInputDisplay ?? null
  const listItems = [...questions, ...options]
  const isTextInput = supportResponseRequiresTextInput(currentResponse)

  const currentStep: SupportFlowStep = {
    id: activeStep?.id ?? 'support-api-root',
    type: supportResponseRequiresTextInput(currentResponse)
      ? 'text-input'
      : listItems.length > 0
        ? 'options'
        : 'info',
    title:
      getSupportResponseMessage(currentResponse) ||
      t('supportFlow.steps.start.title'),
    message: getSupportResponseMessage(currentResponse),
    placeholderKey: currentResponse?.response?.requiredParam
      ? 'supportFlow.input.placeholder'
      : undefined,
    fieldName: currentResponse?.response?.requiredParam ?? undefined,
    options: listItems,
    apiAction: 'supportAnswer',
  }

  const resetFlow = useCallback(
    (context?: SupportFlowContext) => {
      void resetStoreFlow({
        errorMessage: t('supportFlow.errors.generic'),
        context,
      })
    },
    [resetStoreFlow, t]
  )

  const selectOption = useCallback(
    (option: SupportFlowOption) => {
      void selectStoreOption({
        option,
        errorMessage: t('supportFlow.errors.generic'),
      })
    },
    [selectStoreOption, t]
  )

  const loadMoreOptions = useCallback(
    () =>
      void loadStoreMoreOptions({
        errorMessage: t('supportFlow.errors.generic'),
      }),
    [loadStoreMoreOptions, t]
  )

  const submitText = useCallback(
    (value: string) =>
      void submitStoreText({
        value,
        errorMessage: t('supportFlow.errors.generic'),
      }),
    [submitStoreText, t]
  )

  const openSupportForFeature = useCallback(
    (featureKey: string) =>
      void openFeatureSupport({
        featureKey,
        errorMessage: t('supportFlow.errors.generic'),
      }),
    [openFeatureSupport, t]
  )

  return {
    isOpen,
    activeStep,
    currentStep,
    answers,
    isLoading,
    isLoadingMoreOptions,
    isMyIap,
    hasInitialQuestions,
    error,
    currentResponse,
    display,
    isTextInput,
    listItems,
    options,
    questions,
    selectedHistory,
    canGoBack,
    openSupport,
    openSupportForFeature,
    closeSupport,
    resetFlow,
    goBack,
    selectOption,
    submitText,
    loadMoreOptions,
  }
}
