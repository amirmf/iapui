import type { ApiFilterParams } from '@iap/shared-lib'
import type { TableFilterSearch } from '@shared/tables'
import type { PaginationState, SortingState } from '@tanstack/react-table'

export const bankAccountPageNumberSearchKey = 'page'
export const bankAccountPageSizeSearchKey = 'size'
export const bankAccountSortSearchKey = 'sort'
export const bankAccountSortDirectionSearchKey = 'direction'

const reservedSearchKeys = new Set([
  bankAccountPageNumberSearchKey,
  bankAccountPageSizeSearchKey,
  bankAccountSortSearchKey,
  bankAccountSortDirectionSearchKey,
])

export type BankAccountTableSearchState = {
  filters: TableFilterSearch
  pagination: PaginationState
  sorting: SortingState
}

function parsePositiveInteger(value: unknown, fallback: number) {
  if (typeof value !== 'string') return fallback
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export function parseBankAccountTableSearch(
  search: TableFilterSearch
): BankAccountTableSearchState {
  const filters: TableFilterSearch = {}
  for (const [key, value] of Object.entries(search)) {
    if (!reservedSearchKeys.has(key)) filters[key] = value
  }
  const sort = search[bankAccountSortSearchKey]
  const direction = search[bankAccountSortDirectionSearchKey]

  return {
    filters,
    pagination: {
      pageIndex:
        parsePositiveInteger(search[bankAccountPageNumberSearchKey], 1) - 1,
      pageSize: parsePositiveInteger(search[bankAccountPageSizeSearchKey], 40),
    },
    sorting:
      typeof sort === 'string' && (direction === 'asc' || direction === 'desc')
        ? [{ desc: direction === 'desc', id: sort }]
        : [],
  }
}

export function toBankAccountTableSearch(
  state: BankAccountTableSearchState
): TableFilterSearch {
  const [sort] = state.sorting
  return {
    ...state.filters,
    [bankAccountPageNumberSearchKey]: String(state.pagination.pageIndex + 1),
    [bankAccountPageSizeSearchKey]: String(state.pagination.pageSize),
    [bankAccountSortSearchKey]: sort?.id,
    [bankAccountSortDirectionSearchKey]: sort
      ? sort.desc
        ? 'desc'
        : 'asc'
      : undefined,
  }
}

export function toBankAccountApiFilters(
  filters: TableFilterSearch,
  sorting: SortingState
): ApiFilterParams {
  const [sort] = sorting
  return {
    ...filters,
    direction: sort ? (sort.desc ? 'desc' : 'asc') : 'desc',
    sort: sort?.id ?? 'createdAt',
  }
}
