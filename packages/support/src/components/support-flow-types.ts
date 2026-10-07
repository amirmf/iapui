import type {
  SupportFlowResponse,
  SupportOption,
  SupportSelectableQuestion,
} from '@iap/api-types'

import type {
  SupportFlowOption,
  SupportFlowQuestionItem,
  SupportFlowResponseOptionItem,
} from '../model/support-flow-types'

export type {
  SupportFlowStepType,
  SupportFlowColorContext,
  SupportFlowOptionAction,
  SupportFlowOptionSource,
  SupportFlowQuestionItem,
  SupportFlowResponseOptionItem,
  SupportFlowOption,
  SupportFlowActionOption,
  SupportFlowListItem,
  SupportFlowStep,
  SelectedSupportQuestion,
  SupportFlowStepRecord,
  SupportFlowAnswers,
} from '../model/support-flow-types'

const getSelectableQuestionLabel = (question: SupportSelectableQuestion) =>
  question.title ?? question.key ?? ''

const getResponseOptionKey = (option: SupportOption) =>
  option.id ?? option.businessKey ?? option.title ?? ''

const getResponseOptionLabel = (option: SupportOption) =>
  option.title ??
  option.businessKey?.toString() ??
  option.id ??
  option.status ??
  ''

export function getSupportResponseMessage(
  response?: SupportFlowResponse | null
) {
  return response?.response?.message ?? ''
}

export function mapSupportAnswerToOptions(
  response?: SupportFlowResponse | null
): SupportFlowOption[] {
  return [
    ...mapSupportResponseToQuestionItems(response),
    ...mapSupportResponseToOptionItems(response),
  ]
}

export function mapSupportResponseToQuestionItems(
  response?: SupportFlowResponse | null
): SupportFlowQuestionItem[] {
  if (response?.response?.requiredParamInputDisplay === 'TEXT') return []

  return (response?.nextSelectableQuestionKeys ?? [])
    .filter((question) => Boolean(question.key))
    .map((question) => ({
      id: question.key as string,
      key: question.key as string,
      label: getSelectableQuestionLabel(question),
      requiredParam: question.requiredParam ?? undefined,
      source: 'selectable-question',
      selectableQuestion: question,
    }))
}

export function mapSupportResponseToOptionItems(
  response?: SupportFlowResponse | null
): SupportFlowResponseOptionItem[] {
  if (response?.response?.requiredParamInputDisplay !== 'LIST') return []

  return (response?.response?.options?.content ?? []).reduce<
    SupportFlowResponseOptionItem[]
  >((options, item) => {
    const key = getResponseOptionKey(item)

    if (key) {
      options.push({
        ...item,
        id: key,
        key,
        label: getResponseOptionLabel(item),
        source: 'response-option',
        responseOption: item,
      })
    }

    return options
  }, [])
}

export function supportResponseRequiresTextInput(
  response?: SupportFlowResponse | null
) {
  const inputDisplay = response?.response?.requiredParamInputDisplay

  if (inputDisplay) return inputDisplay === 'TEXT'

  return (
    Boolean(response?.response?.requiredParam) &&
    mapSupportAnswerToOptions(response).length === 0
  )
}
