import { useCallback, useMemo } from 'react'

import type { ApiFilterParams } from '@iap/shared-lib'
import { useLocation, useRouter } from '@tanstack/react-router'
import type {
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table'
import { produce } from 'immer'

function normalizeNumber(value: unknown, defaultValue: number): number {
  if (typeof value === 'string' && !isNaN(+value)) {
    return +value
  }
  return defaultValue
}

export const pageNumberQueryParamKey = 'page'
export const pageSizeQueryParamKey = 'size'
export const sortQueryParamKey = 'sort'
export const directionQueryParamKey = 'direction'

export function applyAgentClaimRequestQuickStatusFilter(
  filters: ApiFilterParams,
  quickStatus: string
) {
  delete filters.quickStatus
  delete filters.extPaymentDate
  delete filters.extPaymentDate__neq

  if (quickStatus === 'SENT_TO_BANK') {
    filters.status = 'PAID'
    filters.extPaymentDate = 'null'
  } else if (quickStatus === 'PAID') {
    filters.status = 'PAID'
    filters.extPaymentDate__neq = 'null'
  } else if (quickStatus !== 'ALL') {
    filters.status = quickStatus
  }
}

export function useAgentClaimRequestTableSearch() {
  const location = useLocation()
  const router = useRouter()
  const searchParams = useMemo(
    () => (location.search ?? {}) as Record<string, unknown>,
    [location.search]
  )

  const pageParam = searchParams[pageNumberQueryParamKey]
  const sizeParam = searchParams[pageSizeQueryParamKey]
  const sortParam = searchParams[sortQueryParamKey]
  const directionParam = searchParams[directionQueryParamKey]

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: normalizeNumber(pageParam, 1) - 1,
      pageSize: normalizeNumber(sizeParam, 40),
    }),
    [pageParam, sizeParam]
  )

  const sorting = useMemo<SortingState>(() => {
    if (
      typeof sortParam === 'string' &&
      (directionParam === 'asc' || directionParam === 'desc')
    ) {
      return [{ id: sortParam, desc: directionParam === 'desc' }]
    }
    return []
  }, [sortParam, directionParam])

  const onPaginationChange = useCallback(
    (updater: PaginationState | Updater<PaginationState>) => {
      const value =
        typeof updater === 'function' ? updater(pagination) : updater
      void router.navigate({
        to: './',
        replace: true,
        search: (query) => {
          const searchQuery = { ...(query as Record<string, unknown>) }
          searchQuery[pageNumberQueryParamKey] = (
            value.pageIndex + 1
          ).toString()
          searchQuery[pageSizeQueryParamKey] = value.pageSize.toString()
          return searchQuery as never
        },
      })
    },
    [pagination, router]
  )

  const onSortingChange = useCallback(
    (updater: SortingState | Updater<SortingState>) => {
      const value = typeof updater === 'function' ? updater(sorting) : updater
      void router.navigate({
        to: './',
        replace: true,
        search: (query) => {
          const searchQuery = { ...(query as Record<string, unknown>) }
          if (value.length > 0 && value[0]) {
            searchQuery[sortQueryParamKey] = value[0].id.toString()
            searchQuery[directionQueryParamKey] = value[0].desc ? 'desc' : 'asc'
          } else {
            delete searchQuery[sortQueryParamKey]
            delete searchQuery[directionQueryParamKey]
          }
          return searchQuery as never
        },
      })
    },
    [router, sorting]
  )

  const rawFilters = useMemo<ApiFilterParams>(() => {
    const currentSearch = { ...searchParams }
    delete currentSearch.page
    delete currentSearch.size
    return currentSearch as ApiFilterParams
  }, [searchParams])

  const effectiveFilters = useMemo<ApiFilterParams>(() => {
    return produce(rawFilters, (draft) => {
      if (!draft.sort) {
        draft.sort = 'createdAt'
        draft.direction = 'asc'
      }
      const quickStatusFromFilters = draft.quickStatus as string | undefined
      const quickStatus = quickStatusFromFilters ?? 'IN_ASSESSMENT'
      if (quickStatus) {
        applyAgentClaimRequestQuickStatusFilter(draft, quickStatus)
      }
    })
  }, [rawFilters])

  return {
    pagination,
    setPagination: onPaginationChange,
    sorting,
    onSortingChange,
    rawFilters,
    effectiveFilters,
  }
}

export default useAgentClaimRequestTableSearch
