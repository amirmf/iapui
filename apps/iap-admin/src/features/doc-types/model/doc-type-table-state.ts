import type { ApiFilterParams } from '@iap/shared-lib'
import type { TableFilterSearch } from '@shared/tables'
import type { PaginationState, SortingState } from '@tanstack/react-table'

export const docTypePageNumberSearchKey = 'page'
export const docTypePageSizeSearchKey = 'size'
export const docTypeSortSearchKey = 'sort'
export const docTypeSortDirectionSearchKey = 'direction'

const reservedDocTypeSearchKeys = new Set([
  docTypePageNumberSearchKey,
  docTypePageSizeSearchKey,
  docTypeSortSearchKey,
  docTypeSortDirectionSearchKey,
])

export type DocTypeTableSearchState = {
  filters: TableFilterSearch
  pagination: PaginationState
  sorting: SortingState
}

function parsePositiveInteger(value: unknown, fallback: number) {
  if (typeof value !== 'string') return fallback

  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export function parseDocTypeTableSearch(
  search: TableFilterSearch
): DocTypeTableSearchState {
  const filters: TableFilterSearch = {}

  for (const [key, value] of Object.entries(search)) {
    if (!reservedDocTypeSearchKeys.has(key)) filters[key] = value
  }

  const sort = search[docTypeSortSearchKey]
  const direction = search[docTypeSortDirectionSearchKey]

  return {
    filters,
    pagination: {
      pageIndex:
        parsePositiveInteger(search[docTypePageNumberSearchKey], 1) - 1,
      pageSize: parsePositiveInteger(search[docTypePageSizeSearchKey], 40),
    },
    sorting:
      typeof sort === 'string' && (direction === 'asc' || direction === 'desc')
        ? [{ desc: direction === 'desc', id: sort }]
        : [],
  }
}

export function toDocTypeTableSearch(
  state: DocTypeTableSearchState
): TableFilterSearch {
  const [sort] = state.sorting

  return {
    ...state.filters,
    [docTypePageNumberSearchKey]: String(state.pagination.pageIndex + 1),
    [docTypePageSizeSearchKey]: String(state.pagination.pageSize),
    [docTypeSortSearchKey]: sort?.id,
    [docTypeSortDirectionSearchKey]: sort
      ? sort.desc
        ? 'desc'
        : 'asc'
      : undefined,
  }
}

export function toDocTypeApiFilters(
  filters: TableFilterSearch,
  sorting: SortingState
): ApiFilterParams {
  const [sort] = sorting

  return {
    ...filters,
    ...(sort ? { direction: sort.desc ? 'desc' : 'asc', sort: sort.id } : {}),
  }
}
