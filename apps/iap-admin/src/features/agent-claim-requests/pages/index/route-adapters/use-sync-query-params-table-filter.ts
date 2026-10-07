import { useCallback, useEffect, useMemo, useState } from 'react'

import type { ApiFilterParams } from '@iap/shared-lib'
import { useLocation, useRouter } from '@tanstack/react-router'
import type {
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table'

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

export function useSyncQueryParamsTableFilter(
  ignoreQueryParams: string[] = []
) {
  const location = useLocation()
  const router = useRouter()
  const searchParams = useMemo(
    () => (location.search ?? {}) as Record<string, unknown>,
    [location.search]
  )

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: normalizeNumber(searchParams[pageNumberQueryParamKey], 1) - 1,
    pageSize: normalizeNumber(searchParams[pageSizeQueryParamKey], 40),
  })
  const [sorting, setSorting] = useState<SortingState>([])

  const pageParam = searchParams[pageNumberQueryParamKey]
  const sizeParam = searchParams[pageSizeQueryParamKey]
  const sortParam = searchParams[sortQueryParamKey]
  const directionParam = searchParams[directionQueryParamKey]

  useEffect(() => {
    const nextPageIndex = normalizeNumber(pageParam, 1) - 1
    const nextPageSize = normalizeNumber(sizeParam, 40)
    setPagination((prev) => {
      if (prev.pageIndex === nextPageIndex && prev.pageSize === nextPageSize) {
        return prev
      }
      return { pageIndex: nextPageIndex, pageSize: nextPageSize }
    })
  }, [pageParam, sizeParam])

  useEffect(() => {
    if (
      typeof sortParam === 'string' &&
      (directionParam === 'asc' || directionParam === 'desc')
    ) {
      const isDesc = directionParam === 'desc'
      setSorting((prev) => {
        if (prev[0]?.id === sortParam && prev[0]?.desc === isDesc) {
          return prev
        }
        return [{ id: sortParam, desc: isDesc }]
      })
    } else {
      setSorting((prev) => (prev.length === 0 ? prev : []))
    }
  }, [sortParam, directionParam])

  const onPaginationChange = useCallback(
    (updater: PaginationState | Updater<PaginationState>) => {
      const value =
        typeof updater === 'function' ? updater(pagination) : updater
      setPagination(value)
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
      setSorting(value)
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

  const filters = useMemo<ApiFilterParams>(() => {
    const params = { ...searchParams }
    delete params[pageNumberQueryParamKey]
    delete params[pageSizeQueryParamKey]
    ignoreQueryParams.forEach((param) => {
      delete params[param]
    })
    return params as ApiFilterParams
  }, [searchParams, ignoreQueryParams])

  return {
    pagination,
    setPagination: onPaginationChange,
    filters,
    sorting,
    onSortingChange,
  }
}

export default useSyncQueryParamsTableFilter
