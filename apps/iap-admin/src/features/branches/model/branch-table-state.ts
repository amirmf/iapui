import type { ApiFilterParams } from '@iap/shared-lib'
import type { TableFilterSearch } from '@shared/tables'
import type { PaginationState, SortingState } from '@tanstack/react-table'

export const branchPageNumberSearchKey = 'page'
export const branchPageSizeSearchKey = 'size'
export const branchSortSearchKey = 'sort'
export const branchSortDirectionSearchKey = 'direction'

const reservedBranchSearchKeys = new Set([
  branchPageNumberSearchKey,
  branchPageSizeSearchKey,
  branchSortSearchKey,
  branchSortDirectionSearchKey,
])

export type BranchTableSearchState = {
  filters: TableFilterSearch
  pagination: PaginationState
  sorting: SortingState
}

function parsePositiveInteger(value: unknown, fallback: number) {
  if (typeof value !== 'string') return fallback

  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export function parseBranchTableSearch(
  search: TableFilterSearch
): BranchTableSearchState {
  const filters: TableFilterSearch = {}

  for (const [key, value] of Object.entries(search)) {
    if (!reservedBranchSearchKeys.has(key)) filters[key] = value
  }

  const sort = search[branchSortSearchKey]
  const direction = search[branchSortDirectionSearchKey]

  return {
    filters,
    pagination: {
      pageIndex: parsePositiveInteger(search[branchPageNumberSearchKey], 1) - 1,
      pageSize: parsePositiveInteger(search[branchPageSizeSearchKey], 40),
    },
    sorting:
      typeof sort === 'string' && (direction === 'asc' || direction === 'desc')
        ? [{ desc: direction === 'desc', id: sort }]
        : [],
  }
}

export function toBranchTableSearch(
  state: BranchTableSearchState
): TableFilterSearch {
  const [sort] = state.sorting

  return {
    ...state.filters,
    [branchPageNumberSearchKey]: String(state.pagination.pageIndex + 1),
    [branchPageSizeSearchKey]: String(state.pagination.pageSize),
    [branchSortSearchKey]: sort?.id,
    [branchSortDirectionSearchKey]: sort
      ? sort.desc
        ? 'desc'
        : 'asc'
      : undefined,
  }
}

export function toBranchApiFilters(
  filters: TableFilterSearch,
  sorting: SortingState
): ApiFilterParams {
  const [sort] = sorting

  return {
    ...filters,
    ...(sort ? { direction: sort.desc ? 'desc' : 'asc', sort: sort.id } : {}),
  }
}
