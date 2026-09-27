import { useCallback, useState } from 'react'

import type {
  OnChangeFn,
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table'

export type ServerTableState<TFilters extends Record<string, unknown>> = {
  filters: TFilters
  pagination: PaginationState
  sorting: SortingState
}

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function'
    ? (updater as (previous: T) => T)(previous)
    : updater
}

/** Keeps API parameters local to a feature while normalizing table callbacks. */
export function useServerTableState<TFilters extends Record<string, unknown>>(
  initialState: ServerTableState<TFilters>
) {
  const [state, setState] = useState<ServerTableState<TFilters>>(initialState)

  const onFiltersChange = useCallback((updater: Updater<TFilters>) => {
    setState((previous) => ({
      ...previous,
      filters: resolveUpdater(updater, previous.filters),
      pagination: { ...previous.pagination, pageIndex: 0 },
    }))
  }, [])
  const onPaginationChange = useCallback<OnChangeFn<PaginationState>>(
    (updater) => {
      setState((previous) => ({
        ...previous,
        pagination: resolveUpdater(updater, previous.pagination),
      }))
    },
    []
  )
  const onSortingChange = useCallback<OnChangeFn<SortingState>>((updater) => {
    setState((previous) => ({
      ...previous,
      pagination: { ...previous.pagination, pageIndex: 0 },
      sorting: resolveUpdater(updater, previous.sorting),
    }))
  }, [])

  return {
    ...state,
    onFiltersChange,
    onPaginationChange,
    onSortingChange,
    setState,
  }
}

/** Converts TanStack's zero-indexed state to common one-indexed API parameters. */
export function toServerTableParams<TFilters extends Record<string, unknown>>(
  state: ServerTableState<TFilters>
) {
  const [sorting] = state.sorting

  return {
    ...state.filters,
    page: state.pagination.pageIndex + 1,
    pageSize: state.pagination.pageSize,
    sort: sorting?.id,
    sortDirection: sorting ? (sorting.desc ? 'desc' : 'asc') : undefined,
  }
}
