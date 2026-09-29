import type { ApiFilterParams } from '@iap/shared-lib'
import type { TableFilterSearch } from '@shared/tables'
import type { SortingState } from '@tanstack/react-table'

export function toTicketApiFilters(
  filters: TableFilterSearch,
  sorting: SortingState
): ApiFilterParams {
  const ticketFilters: ApiFilterParams = { ...filters }
  delete ticketFilters.features
  delete ticketFilters.quickStatus
  if (ticketFilters.status === 'ALL') {
    delete ticketFilters.status
  } else if (!ticketFilters.status) {
    ticketFilters.status = 'ASSIGNED'
  }
  const [sort] = sorting

  return {
    ...ticketFilters,
    direction: sort?.desc ? 'desc' : 'asc',
    sort: sort?.id ?? 'updatedAt',
  }
}
