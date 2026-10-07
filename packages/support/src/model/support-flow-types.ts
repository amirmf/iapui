import {
  type SupportFlowResponse,
  type SupportOption,
  type SupportRequiredParamInputDisplay,
  type SupportSelectableQuestion,
} from '@iap/api-types'

export type SupportFlowStepType = 'options' | 'text-input' | 'info'

export type SupportFlowColorContext = 'default' | 'auth'

export type SupportFlowOptionAction = 'close' | 'restart' | 'open-url' | 'back'

export type SupportFlowOptionSource = 'selectable-question' | 'response-option'

export type SupportFlowQuestionItem = {
  id: string | number
  key: string | number
  label: string
  requiredParam?: string
  source: 'selectable-question'
  selectableQuestion?: SupportSelectableQuestion
  action?: SupportFlowOptionAction
  href?: string
}

export type SupportFlowResponseOptionItem = Omit<
  SupportOption,
  'id' | 'title'
> & {
  id: string | number
  key: string | number
  label: string
  source: 'response-option'
  responseOption?: SupportOption
  action?: SupportFlowOptionAction
  href?: string
}

export type SupportFlowOption =
  SupportFlowQuestionItem | SupportFlowResponseOptionItem

export type SupportFlowActionOption = {
  id: string | number
  key: string | number
  label: string
  source?: SupportFlowOptionSource
  action?: SupportFlowOptionAction
  href?: string
}

export type SupportFlowListItem =
  SupportFlowQuestionItem | SupportFlowResponseOptionItem

export type SupportFlowStep = {
  id: string
  type: SupportFlowStepType
  title: string
  message?: string
  placeholderKey?: string
  fieldName?: string
  nextStepId?: string
  options?: SupportFlowOption[]
  apiAction?: 'supportAnswer'
}

export type SelectedSupportQuestion = {
  key: string
  label: string
  display: SupportRequiredParamInputDisplay | 'QUESTION' | 'OPTION' | 'TEXT'
}

export type SupportFlowStepRecord = {
  id: string
  response: SupportFlowResponse
  selected?: SelectedSupportQuestion
}

export type SupportFlowAnswers = Record<string, string>
