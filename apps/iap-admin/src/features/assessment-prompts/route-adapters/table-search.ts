import {
  type PageAssessmentPromptsRequest,
  pageAssessmentPromptsRequestSchema,
} from '@iap/api-types'
import { type TableFilterSearch, toApiFilterValues } from '@shared/tables'
import type { PaginationState, SortingState } from '@tanstack/react-table'

const RESERVED_SEARCH_KEYS = new Set(['direction', 'page', 'size', 'sort'])

export type AssessmentPromptTableSearchState = {
  filters: TableFilterSearch
  pagination: PaginationState
  sorting: SortingState
}

function parsePositiveInteger(value: unknown, fallback: number) {
  if (typeof value !== 'string') return fallback

  const parsed = Number(value)
  return !Number.isNaN(parsed) ? parsed : fallback
}

export function parseAssessmentPromptTableSearch(
  search: TableFilterSearch
): AssessmentPromptTableSearchState {
  const filters = Object.fromEntries(
    Object.entries(search).filter(([key]) => !RESERVED_SEARCH_KEYS.has(key))
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

export function toAssessmentPromptApiFilters(
  filters: TableFilterSearch,
  sorting: SortingState
): PageAssessmentPromptsRequest['filters'] {
  const [sort] = sorting

  return pageAssessmentPromptsRequestSchema.shape.filters.parse({
    ...toApiFilterValues(filters, {}),
    ...(sort ? { direction: sort.desc ? 'desc' : 'asc', sort: sort.id } : {}),
  })
}

export function toAssessmentPromptTableSearch(
  state: AssessmentPromptTableSearchState
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
