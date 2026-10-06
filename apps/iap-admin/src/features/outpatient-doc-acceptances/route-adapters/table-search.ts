import type { PaginationState, SortingState } from '@tanstack/react-table'

export const outpatientDocAcceptancePageQueryParamKey = 'page'
export const outpatientDocAcceptancePageSizeQueryParamKey = 'size'
export const outpatientDocAcceptanceSortQueryParamKey = 'sort'
export const outpatientDocAcceptanceDirectionQueryParamKey = 'direction'

const reservedSearchKeys = new Set([
  outpatientDocAcceptancePageQueryParamKey,
  outpatientDocAcceptancePageSizeQueryParamKey,
])

export type OutpatientDocAcceptanceTableSearch = Record<
  string,
  string | string[] | undefined
>

export type ParsedOutpatientDocAcceptanceTableSearch = {
  filters: OutpatientDocAcceptanceTableSearch
  pagination: PaginationState
  sorting: SortingState
}

function parsePositiveInteger(value: unknown, fallback: number) {
  if (typeof value !== 'string') return fallback
  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export function parseOutpatientDocAcceptanceTableSearch(
  search: OutpatientDocAcceptanceTableSearch,
  defaultPageSize = 40
): ParsedOutpatientDocAcceptanceTableSearch {
  const filters: OutpatientDocAcceptanceTableSearch = {}

  for (const [key, value] of Object.entries(search)) {
    if (!reservedSearchKeys.has(key)) filters[key] = value
  }

  const direction = search[outpatientDocAcceptanceDirectionQueryParamKey]
  const sort = search[outpatientDocAcceptanceSortQueryParamKey]

  return {
    filters,
    pagination: {
      pageIndex:
        parsePositiveInteger(
          search[outpatientDocAcceptancePageQueryParamKey],
          1
        ) - 1,
      pageSize: parsePositiveInteger(
        search[outpatientDocAcceptancePageSizeQueryParamKey],
        defaultPageSize
      ),
    },
    sorting:
      typeof sort === 'string' && (direction === 'asc' || direction === 'desc')
        ? [{ desc: direction === 'desc', id: sort }]
        : [],
  }
}

export function toOutpatientDocAcceptanceTableSearch(
  state: ParsedOutpatientDocAcceptanceTableSearch
): OutpatientDocAcceptanceTableSearch {
  const [sort] = state.sorting

  return {
    ...state.filters,
    [outpatientDocAcceptancePageQueryParamKey]: String(
      state.pagination.pageIndex + 1
    ),
    [outpatientDocAcceptancePageSizeQueryParamKey]: String(
      state.pagination.pageSize
    ),
    [outpatientDocAcceptanceSortQueryParamKey]: sort?.id,
    [outpatientDocAcceptanceDirectionQueryParamKey]: sort
      ? sort.desc
        ? 'desc'
        : 'asc'
      : undefined,
  }
}
