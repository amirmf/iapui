import type { ApiFilterParams } from '@iap/shared-lib'
import type { TableFilterSearch } from '@shared/tables'
import type { PaginationState, SortingState } from '@tanstack/react-table'

const reservedSearchKeys = new Set(['page', 'size', 'sort', 'direction'])

export type CoverageTableSearchState = {
  filters: TableFilterSearch
  pagination: PaginationState
  sorting: SortingState
}

function parsePositiveInteger(value: unknown, fallback: number) {
  if (typeof value !== 'string') return fallback
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export function parseCoverageTableSearch(
  search: TableFilterSearch
): CoverageTableSearchState {
  const filters = Object.fromEntries(
    Object.entries(search).filter(([key]) => !reservedSearchKeys.has(key))
  )
  const sort = search.sort
  const direction = search.direction
  return {
    filters,
    pagination: {
      pageIndex: parsePositiveInteger(search.page, 1) - 1,
      pageSize: parsePositiveInteger(search.size, 40),
    },
    sorting:
      typeof sort === 'string' && (direction === 'asc' || direction === 'desc')
        ? [{ desc: direction === 'desc', id: sort }]
        : [],
  }
}

export function toCoverageTableSearch(
  state: CoverageTableSearchState
): TableFilterSearch {
  const [sort] = state.sorting
  return {
    ...state.filters,
    direction: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
    page: String(state.pagination.pageIndex + 1),
    size: String(state.pagination.pageSize),
    sort: sort?.id,
  }
}

export function toCoverageApiFilters(
  filters: TableFilterSearch
): ApiFilterParams {
  // `getPageFull` in the reference receives only table filters. Sorting is
  // still retained in URL/table state for the shared table primitive, but it
  // must not be silently added to this endpoint's filter contract.
  return {
    ...filters,
  }
}
