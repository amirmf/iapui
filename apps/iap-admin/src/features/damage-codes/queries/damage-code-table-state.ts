import type { ApiFilterParams } from '@iap/shared-lib'
import { type TableFilterSearch, toApiFilterValues } from '@shared/tables'
import type { PaginationState, SortingState } from '@tanstack/react-table'

const reservedKeys = new Set(['direction', 'page', 'size', 'sort'])

export type DamageCodeTableSearchState = {
  filters: TableFilterSearch
  pagination: PaginationState
  sorting: SortingState
}

function parsePositiveInteger(value: unknown, fallback: number) {
  if (typeof value !== 'string') return fallback
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export function parseDamageCodeTableSearch(
  search: TableFilterSearch
): DamageCodeTableSearchState {
  const filters = Object.fromEntries(
    Object.entries(search).filter(([key]) => !reservedKeys.has(key))
  ) as TableFilterSearch
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

export function toDamageCodeTableSearch(state: DamageCodeTableSearchState) {
  const [sort] = state.sorting
  return {
    ...state.filters,
    direction: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
    page: String(state.pagination.pageIndex + 1),
    size: String(state.pagination.pageSize),
    sort: sort?.id,
  }
}

export function toDamageCodeApiFilters(
  filters: TableFilterSearch,
  sorting: SortingState
): ApiFilterParams {
  const [sort] = sorting
  return {
    ...toApiFilterValues(filters, { dateRangeFilterIds: ['thruDate'] }),
    ...(sort ? { direction: sort.desc ? 'desc' : 'asc', sort: sort.id } : {}),
  }
}
