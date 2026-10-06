import type { TableFilterSearch } from '@shared/tables'
import type { PaginationState } from '@tanstack/react-table'

const reservedSearchKeys = new Set(['page', 'size'])

export type AssignementRuleTableSearchState = {
  filters: TableFilterSearch
  pagination: PaginationState
}

function parsePositiveInteger(value: unknown, fallback: number): number {
  if (typeof value !== 'string') return fallback
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export function parseAssignementRuleTableSearch(
  search: TableFilterSearch
): AssignementRuleTableSearchState {
  const filters: TableFilterSearch = {}

  for (const [key, value] of Object.entries(search)) {
    if (!reservedSearchKeys.has(key)) filters[key] = value
  }

  return {
    filters,
    pagination: {
      pageIndex: parsePositiveInteger(search.page, 1) - 1,
      pageSize: parsePositiveInteger(search.size, 30),
    },
  }
}

export function toAssignementRuleTableSearch(
  state: AssignementRuleTableSearchState
): TableFilterSearch {
  return {
    ...state.filters,
    page: String(state.pagination.pageIndex + 1),
    size: String(state.pagination.pageSize),
  }
}
