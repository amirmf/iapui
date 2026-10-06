import type { ListAiAssessmentRulesRequest } from '@iap/api-types'
import { type TableFilterSearch, toApiFilterValues } from '@shared/tables'
import type { PaginationState, SortingState } from '@tanstack/react-table'

const RESERVED_SEARCH_KEYS = new Set(['direction', 'page', 'size', 'sort'])

export type AiAssessmentRuleTableSearchState = {
  filters: TableFilterSearch
  pagination: PaginationState
  sorting: SortingState
}

function parsePositiveInteger(value: unknown, fallback: number) {
  if (typeof value !== 'string') return fallback

  const parsed = Number(value)
  return !Number.isNaN(parsed) && parsed > 0 ? parsed : fallback
}

export function parseAiAssessmentRuleTableSearch(
  search: TableFilterSearch
): AiAssessmentRuleTableSearchState {
  const filters = Object.fromEntries(
    Object.entries(search).filter(([key]) => !RESERVED_SEARCH_KEYS.has(key))
  ) as TableFilterSearch
  const rawSort = Array.isArray(search.sort) ? search.sort[0] : search.sort
  const sort = typeof rawSort === 'string' ? rawSort : undefined
  const rawDirection = Array.isArray(search.direction)
    ? search.direction[0]
    : search.direction
  const direction =
    typeof rawDirection === 'string' ? rawDirection.toLowerCase() : undefined

  return {
    filters,
    pagination: {
      pageIndex: parsePositiveInteger(search.page, 1) - 1,
      pageSize: parsePositiveInteger(search.size, 30),
    },
    sorting:
      typeof sort === 'string' && (direction === 'asc' || direction === 'desc')
        ? [{ desc: direction === 'desc', id: sort }]
        : [],
  }
}

export function toAiAssessmentRuleApiFilters(
  filters: TableFilterSearch
): ListAiAssessmentRulesRequest['filters'] {
  return toApiFilterValues(filters, {})
}

export function toAiAssessmentRuleTableSearch(
  state: AiAssessmentRuleTableSearchState
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
