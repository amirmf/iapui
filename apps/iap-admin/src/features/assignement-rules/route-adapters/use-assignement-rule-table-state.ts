import { useCallback, useMemo } from 'react'

import {
  parseAssignementRuleTableSearch,
  toAssignementRuleTableSearch,
} from '@features/assignement-rules/route-adapters/table-search'
import type { TableFilterSearch } from '@shared/tables'
import { useRouter, useRouterState } from '@tanstack/react-router'
import type { PaginationState, Updater } from '@tanstack/react-table'

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function'
    ? (updater as (value: T) => T)(previous)
    : updater
}

export function useAssignementRuleTableState() {
  const router = useRouter()
  const search = useRouterState({
    select: (state) => state.location.search as TableFilterSearch,
  })
  const tableState = useMemo(
    () => parseAssignementRuleTableSearch(search),
    [search]
  )
  const pagination = tableState.pagination
  const filters = tableState.filters

  const setPagination = useCallback(
    (updater: Updater<PaginationState>) => {
      const next = resolveUpdater(updater, pagination)
      router.navigate({
        replace: true,
        search: toAssignementRuleTableSearch({
          filters,
          pagination: next,
        }) as never,
        to: './',
      })
    },
    [filters, pagination, router]
  )

  return { filters, pagination, setPagination }
}
