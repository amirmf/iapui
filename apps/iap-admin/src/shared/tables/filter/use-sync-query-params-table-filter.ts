import type { PaginationState, SortingState } from '@tanstack/react-table'

export const pageNumberQueryParamKey = 'page'
export const pageSizeQueryParamKey = 'pageSize'
export const sortQueryParamKey = 'sort'
export const directionQueryParamKey = 'sortDirection'

const RESERVED_SEARCH_KEYS = new Set([
  pageNumberQueryParamKey,
  pageSizeQueryParamKey,
  sortQueryParamKey,
  directionQueryParamKey,
])

export type TableFilterSearch = Record<string, string | undefined>

export type ParsedTableFilterSearch = {
  filters: TableFilterSearch
  pagination: PaginationState
  sorting: SortingState
}

export type TableFilterSearchState = {
  pagination: PaginationState
  sorting: SortingState
}

function parsePositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

/** Call at a typed route boundary after validating the route search object. */
export function parseTableFilterSearch(
  search: TableFilterSearch,
  defaultPageSize = 20
): ParsedTableFilterSearch {
  const filters: TableFilterSearch = {}

  for (const [key, value] of Object.entries(search)) {
    if (!RESERVED_SEARCH_KEYS.has(key)) filters[key] = value
  }

  const sortDirection = search[directionQueryParamKey]

  return {
    filters,
    pagination: {
      pageIndex: parsePositiveInteger(search[pageNumberQueryParamKey], 1) - 1,
      pageSize: parsePositiveInteger(
        search[pageSizeQueryParamKey],
        defaultPageSize
      ),
    },
    sorting:
      search[sortQueryParamKey] &&
      (sortDirection === 'asc' || sortDirection === 'desc')
        ? [{ desc: sortDirection === 'desc', id: search[sortQueryParamKey] }]
        : [],
  }
}

export function toTableFilterSearch(
  state: ParsedTableFilterSearch
): TableFilterSearch {
  const { filters, pagination, sorting } = state
  const [sort] = sorting

  return {
    ...filters,
    [pageNumberQueryParamKey]: String(pagination.pageIndex + 1),
    [pageSizeQueryParamKey]: String(pagination.pageSize),
    [sortQueryParamKey]: sort?.id,
    [directionQueryParamKey]: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
  }
}
