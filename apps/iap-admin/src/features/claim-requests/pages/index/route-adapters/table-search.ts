import { CLAIM_REQUEST_FEATURE_QUERY_KEY } from '@features/claim-requests/pages/index/route-adapters/claim-request-feature'
import type { TableFilterSearch } from '@shared/tables'
import type { PaginationState, SortingState } from '@tanstack/react-table'

export const claimRequestPageNumberSearchKey = 'page'
export const claimRequestPageSizeSearchKey = 'size'
export const claimRequestSortSearchKey = 'sort'
export const claimRequestSortDirectionSearchKey = 'direction'

const claimRequestReservedSearchKeys = new Set([
  claimRequestPageNumberSearchKey,
  claimRequestPageSizeSearchKey,
  claimRequestSortSearchKey,
  claimRequestSortDirectionSearchKey,
  CLAIM_REQUEST_FEATURE_QUERY_KEY,
])

export type ClaimRequestTableSearchState = {
  filters: TableFilterSearch
  pagination: PaginationState
  sorting: SortingState
}

function parsePositiveInteger(value: unknown, fallback: number) {
  if (typeof value !== 'string') return fallback

  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

/**
 * Mirrors the reference Claim Requests URL contract. This is feature-specific
 * because the shared table contract deliberately uses different key names.
 */
export function parseClaimRequestTableSearch(
  search: TableFilterSearch
): ClaimRequestTableSearchState {
  const filters: TableFilterSearch = {}

  for (const [key, value] of Object.entries(search)) {
    if (!claimRequestReservedSearchKeys.has(key)) filters[key] = value
  }

  const sort = search[claimRequestSortSearchKey]
  const direction = search[claimRequestSortDirectionSearchKey]

  return {
    filters,
    pagination: {
      pageIndex:
        parsePositiveInteger(search[claimRequestPageNumberSearchKey], 1) - 1,
      pageSize: parsePositiveInteger(search[claimRequestPageSizeSearchKey], 40),
    },
    sorting:
      typeof sort === 'string' && (direction === 'asc' || direction === 'desc')
        ? [{ desc: direction === 'desc', id: sort }]
        : [],
  }
}

export function toClaimRequestTableSearch(
  state: ClaimRequestTableSearchState
): TableFilterSearch {
  const [sort] = state.sorting

  return {
    ...state.filters,
    [claimRequestPageNumberSearchKey]: String(state.pagination.pageIndex + 1),
    [claimRequestPageSizeSearchKey]: String(state.pagination.pageSize),
    [claimRequestSortSearchKey]: sort?.id,
    [claimRequestSortDirectionSearchKey]: sort
      ? sort.desc
        ? 'desc'
        : 'asc'
      : undefined,
  }
}

export function hasClaimRequestPageChanged(
  previous: PaginationState,
  next: PaginationState
) {
  return (
    previous.pageIndex !== next.pageIndex || previous.pageSize !== next.pageSize
  )
}
