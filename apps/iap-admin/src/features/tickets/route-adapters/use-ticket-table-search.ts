import { useCallback, useMemo } from 'react'

import { parseTicketTableSearch } from '@features/tickets/route-adapters/table-search'
import { useLocation, useRouter } from '@tanstack/react-router'
import type {
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table'

function resolveUpdater<T>(updater: Updater<T>, previous: T) {
  return typeof updater === 'function'
    ? (updater as (value: T) => T)(previous)
    : updater
}

export function useTicketTableSearch() {
  const location = useLocation()
  const tableState = useMemo(
    () =>
      parseTicketTableSearch(
        Object.fromEntries(
          Object.entries(location.search).filter(
            ([, value]) =>
              typeof value === 'string' ||
              (Array.isArray(value) &&
                value.every((entry) => typeof entry === 'string'))
          )
        ) as Record<string, string | string[] | undefined>
      ),
    [location.search]
  )
  return { tableState, search: location.search }
}

export function useTicketTableNavigation(
  pagination: PaginationState,
  sorting: SortingState,
  setSorting: (value: SortingState) => void
) {
  const router = useRouter()
  const onPaginationChange = useCallback(
    (updater: Updater<PaginationState>) => {
      const next = resolveUpdater(updater, pagination)
      void router.navigate({
        replace: true,
        search: (previous: Record<string, unknown>) =>
          ({
            ...previous,
            page: String(next.pageIndex + 1),
            size: String(next.pageSize),
          }) as never,
        to: './',
      })
    },
    [router, pagination]
  )
  const onSortingChange = useCallback(
    (updater: Updater<SortingState>) => {
      const next = resolveUpdater(updater, sorting)
      setSorting(next)
      void router.navigate({
        replace: true,
        search: (previous: Record<string, unknown>) => {
          const search = { ...previous }
          if (next[0]) {
            search.sort = next[0].id
            search.direction = next[0].desc ? 'desc' : 'asc'
          } else {
            delete search.sort
            delete search.direction
          }
          return search as never
        },
        to: './',
      })
    },
    [router, sorting, setSorting]
  )

  return { onPaginationChange, onSortingChange }
}
