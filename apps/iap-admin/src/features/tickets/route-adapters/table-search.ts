import type { TableFilterSearch } from '@shared/tables'
import type { PaginationState, SortingState } from '@tanstack/react-table'

/**
 * The ticket screen keeps the reference application's URL contract. It cannot
 * reuse the shared table parser because that parser intentionally owns a
 * different public contract (`pageSize`/`sortDirection`).
 */
export const ticketPageNumberSearchKey = 'page'
export const ticketPageSizeSearchKey = 'size'
export const ticketSortSearchKey = 'sort'
export const ticketSortDirectionSearchKey = 'direction'

const reservedTicketSearchKeys = new Set([
  ticketPageNumberSearchKey,
  ticketPageSizeSearchKey,
  ticketSortSearchKey,
  ticketSortDirectionSearchKey,
])

export type TicketTableSearchState = {
  filters: TableFilterSearch
  pagination: PaginationState
  sorting: SortingState
}

function normalizeNumber(value: unknown, fallback: number) {
  return typeof value === 'string' && !Number.isNaN(+value) ? +value : fallback
}

export function parseTicketTableSearch(
  search: TableFilterSearch
): TicketTableSearchState {
  const filters: TableFilterSearch = {}

  for (const [key, value] of Object.entries(search)) {
    if (!reservedTicketSearchKeys.has(key)) filters[key] = value
  }

  const sort = search[ticketSortSearchKey]
  const direction = search[ticketSortDirectionSearchKey]

  return {
    filters,
    pagination: {
      pageIndex: normalizeNumber(search[ticketPageNumberSearchKey], 1) - 1,
      pageSize: normalizeNumber(search[ticketPageSizeSearchKey], 40),
    },
    sorting:
      typeof sort === 'string' && (direction === 'asc' || direction === 'desc')
        ? [{ desc: direction === 'desc', id: sort }]
        : [],
  }
}

export function toTicketTableSearch(
  state: TicketTableSearchState
): TableFilterSearch {
  const [sort] = state.sorting

  return {
    ...state.filters,
    [ticketPageNumberSearchKey]: String(state.pagination.pageIndex + 1),
    [ticketPageSizeSearchKey]: String(state.pagination.pageSize),
    [ticketSortSearchKey]: sort?.id,
    [ticketSortDirectionSearchKey]: sort
      ? sort.desc
        ? 'desc'
        : 'asc'
      : undefined,
  }
}
