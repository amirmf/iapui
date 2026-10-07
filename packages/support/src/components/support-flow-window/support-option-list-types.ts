import {
  type SupportFlowListItem,
  type SupportFlowOption,
} from '../support-flow-types'

export const OPTION_ROW_HEIGHT = 64
export const DETAILED_OPTION_ROW_HEIGHT = 126
export const OPTION_ROW_GAP = 0
export const LIST_VERTICAL_PADDING = 16

export type SupportOptionDetail = {
  field: SupportOptionField
  title: string
  value: string
}

export type SupportOptionField =
  'amount' | 'submitDate' | 'status' | 'businessKey'

export const SUPPORT_OPTION_FIELDS: SupportOptionField[] = [
  'businessKey',
  'amount',
  'submitDate',
  'status',
]

export type SupportOptionListRow = {
  details: SupportOptionDetail[]
  option: SupportFlowListItem
}

export type SupportOptionRowProps = {
  disabled?: boolean
  onSelect: (option: SupportFlowOption) => void
  rows: SupportOptionListRow[]
  loadingRowIndex: number | null
}
