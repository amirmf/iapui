import type { PaginationState, SortingState } from '@tanstack/react-table'

const RESERVED_SEARCH_KEYS = new Set([
  'page',
  'pageSize',
  'sort',
  'sortDirection',
])

export type ServerTableSearch = Record<string, string | undefined>

export type ParsedServerTableSearch = {
  filters: ServerTableSearch
  pagination: PaginationState
  sorting: SortingState
}

function parsePositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

/** Call at a typed route boundary after validating the route search object. */
export function parseServerTableSearch(
  search: ServerTableSearch,
  defaultPageSize = 20
): ParsedServerTableSearch {
  const filters: ServerTableSearch = {}

  for (const [key, value] of Object.entries(search)) {
    if (!RESERVED_SEARCH_KEYS.has(key)) filters[key] = value
  }

  const sortDirection = search.sortDirection

  return {
    filters,
    pagination: {
      pageIndex: parsePositiveInteger(search.page, 1) - 1,
      pageSize: parsePositiveInteger(search.pageSize, defaultPageSize),
    },
    sorting:
      search.sort && (sortDirection === 'asc' || sortDirection === 'desc')
        ? [{ desc: sortDirection === 'desc', id: search.sort }]
        : [],
  }
}

export function toServerTableSearch(
  state: ParsedServerTableSearch
): ServerTableSearch {
  const { filters, pagination, sorting } = state
  const [sort] = sorting

  return {
    ...filters,
    page: String(pagination.pageIndex + 1),
    pageSize: String(pagination.pageSize),
    sort: sort?.id,
    sortDirection: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
  }
}
