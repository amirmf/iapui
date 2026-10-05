import type { PaginationState, SortingState } from '@tanstack/react-table'

export const claimReportPageQueryParamKey = 'page'
export const claimReportPageSizeQueryParamKey = 'size'
export const claimReportSortQueryParamKey = 'sort'
export const claimReportDirectionQueryParamKey = 'direction'

const reservedSearchKeys = new Set([
  claimReportPageQueryParamKey,
  claimReportPageSizeQueryParamKey,
])

export type ClaimReportTableSearch = Record<
  string,
  string | string[] | undefined
>

export type ParsedClaimReportTableSearch = {
  filters: ClaimReportTableSearch
  pagination: PaginationState
  sorting: SortingState
}

function parsePositiveInteger(value: unknown, fallback: number) {
  if (typeof value !== 'string') return fallback
  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export function parseClaimReportTableSearch(
  search: ClaimReportTableSearch,
  defaultPageSize = 40
): ParsedClaimReportTableSearch {
  const filters: ClaimReportTableSearch = {}

  for (const [key, value] of Object.entries(search)) {
    if (!reservedSearchKeys.has(key)) filters[key] = value
  }

  const direction = search[claimReportDirectionQueryParamKey]
  const sort = search[claimReportSortQueryParamKey]

  return {
    filters,
    pagination: {
      pageIndex:
        parsePositiveInteger(search[claimReportPageQueryParamKey], 1) - 1,
      pageSize: parsePositiveInteger(
        search[claimReportPageSizeQueryParamKey],
        defaultPageSize
      ),
    },
    sorting:
      typeof sort === 'string' && (direction === 'asc' || direction === 'desc')
        ? [{ desc: direction === 'desc', id: sort }]
        : [],
  }
}

export function toClaimReportTableSearch(
  state: ParsedClaimReportTableSearch
): ClaimReportTableSearch {
  const [sort] = state.sorting

  return {
    ...state.filters,
    [claimReportPageQueryParamKey]: String(state.pagination.pageIndex + 1),
    [claimReportPageSizeQueryParamKey]: String(state.pagination.pageSize),
    [claimReportSortQueryParamKey]: sort?.id,
    [claimReportDirectionQueryParamKey]: sort
      ? sort.desc
        ? 'desc'
        : 'asc'
      : undefined,
  }
}
