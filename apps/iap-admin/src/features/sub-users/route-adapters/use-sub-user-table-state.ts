import { useCallback, useMemo } from 'react'

import type { TableFilterSearch } from '@shared/tables'
import { useRouter, useRouterState } from '@tanstack/react-router'
import type { PaginationState, Updater } from '@tanstack/react-table'

const paginationKeys = new Set(['direction', 'page', 'size', 'sort'])

function numberValue(value: unknown, fallback: number) {
  const number = typeof value === 'string' ? Number(value) : Number.NaN
  return Number.isInteger(number) && number > 0 ? number : fallback
}

function resolve<T>(updater: Updater<T>, previous: T) {
  return typeof updater === 'function'
    ? (updater as (value: T) => T)(previous)
    : updater
}

export function useSubUserTableState() {
  const router = useRouter()
  const search = useRouterState({
    select: (state) => state.location.search as TableFilterSearch,
  })

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: numberValue(search.page, 1) - 1,
      pageSize: numberValue(search.size, 10),
    }),
    [search.page, search.size]
  )

  const filters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(search).filter(([key]) => !paginationKeys.has(key))
      ),
    [search]
  )

  const setPagination = useCallback(
    (updater: Updater<PaginationState>) => {
      const nextPagination = resolve(updater, pagination)
      void router.navigate({
        replace: true,
        search: {
          ...search,
          page: String(nextPagination.pageIndex + 1),
          size: String(nextPagination.pageSize),
        } as never,
        to: './',
      })
    },
    [pagination, router, search]
  )

  return { filters, pagination, setPagination }
}
