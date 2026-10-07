import type { TicketStatus as SupportTicketStatus } from '@iap/api-types'
import type { TableFilterSearch } from '@shared/tables'

export type TicketStatus =
  'ALL' | Exclude<SupportTicketStatus, 'OPEN' | 'WAITING_FOR_USER'>

export function toTicketStatusSearch(
  search: TableFilterSearch,
  status: TicketStatus
) {
  return { ...search, page: undefined, status }
}
