import { useCallback, useMemo } from 'react'

import type { TableFilterSearch } from '@shared/tables'
import { useRouter, useRouterState } from '@tanstack/react-router'
import type {
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table'

const paginationKeys = new Set(['page', 'size'])

function numberValue(value: unknown, fallback: number) {
  const number = typeof value === 'string' ? Number(value) : Number.NaN
  return Number.isInteger(number) && number > 0 ? number : fallback
}

function resolve<T>(updater: Updater<T>, previous: T) {
  return typeof updater === 'function'
    ? (updater as (value: T) => T)(previous)
    : updater
}

export function useAgreementTableState() {
  const router = useRouter()
  const search = useRouterState({
    select: (state) => state.location.search as TableFilterSearch,
  })
  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: numberValue(search.page, 1) - 1,
      pageSize: numberValue(search.size, 40),
    }),
    [search.page, search.size]
  )
  const sorting = useMemo<SortingState>(
    () =>
      typeof search.sort === 'string' &&
      (search.direction === 'asc' || search.direction === 'desc')
        ? [{ desc: search.direction === 'desc', id: search.sort }]
        : [],
    [search.direction, search.sort]
  )
  const filters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(search).filter(([key]) => !paginationKeys.has(key))
      ),
    [search]
  )
  const navigate = useCallback(
    (nextPagination: PaginationState, nextSorting: SortingState) => {
      const [sort] = nextSorting
      void router.navigate({
        replace: true,
        search: {
          ...search,
          direction: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
          page: String(nextPagination.pageIndex + 1),
          size: String(nextPagination.pageSize),
          sort: sort?.id,
        },
        to: './',
      } as never)
    },
    [router, search]
  )
  const onPaginationChange = useCallback(
    (updater: Updater<PaginationState>) =>
      navigate(resolve(updater, pagination), sorting),
    [navigate, pagination, sorting]
  )
  const onSortingChange = useCallback(
    (updater: Updater<SortingState>) =>
      navigate(pagination, resolve(updater, sorting)),
    [navigate, pagination, sorting]
  )

  return { filters, onPaginationChange, onSortingChange, pagination, sorting }
}
