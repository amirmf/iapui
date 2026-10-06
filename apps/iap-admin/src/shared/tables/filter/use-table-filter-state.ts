import { useCallback, useState } from 'react'

import { updateTableFilterValue } from '@shared/tables/filter/filter-utils'
import type {
  TableFilterValue,
  TableFilterValues,
} from '@shared/tables/filter/types'
import type {
  OnChangeFn,
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table'

export type TableFilterStateModel<TFilters extends TableFilterValues> = {
  filters: TFilters
  pagination: PaginationState
  sorting: SortingState
}

export function resolveTableUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function'
    ? (updater as (previous: T) => T)(previous)
    : updater
}

/** Keeps local filter, pagination, and sorting state in sync for a table. */
export function useTableFilterState<TFilters extends TableFilterValues>(
  initialState: TableFilterStateModel<TFilters>
) {
  const [state, setState] =
    useState<TableFilterStateModel<TFilters>>(initialState)

  const onFiltersChange = useCallback((updater: Updater<TFilters>) => {
    setState((previous) => ({
      ...previous,
      filters: resolveTableUpdater(updater, previous.filters),
      pagination: { ...previous.pagination, pageIndex: 0 },
    }))
  }, [])
  const onPaginationChange = useCallback<OnChangeFn<PaginationState>>(
    (updater) => {
      setState((previous) => ({
        ...previous,
        pagination: resolveTableUpdater(updater, previous.pagination),
      }))
    },
    []
  )
  const onSortingChange = useCallback<OnChangeFn<SortingState>>((updater) => {
    setState((previous) => ({
      ...previous,
      pagination: { ...previous.pagination, pageIndex: 0 },
      sorting: resolveTableUpdater(updater, previous.sorting),
    }))
  }, [])
  const onFilterValueChange = useCallback(
    (id: string, value: TableFilterValue) =>
      onFiltersChange(
        (previous) => updateTableFilterValue(previous, id, value) as TFilters
      ),
    [onFiltersChange]
  )
  const resetFilters = useCallback((nextFilters: TFilters = {} as TFilters) => {
    setState((previous) => ({
      ...previous,
      filters: nextFilters,
      pagination: { ...previous.pagination, pageIndex: 0 },
    }))
  }, [])

  return {
    ...state,
    onFiltersChange,
    onFilterValueChange,
    onPaginationChange,
    onSortingChange,
    resetFilters,
    setState,
  }
}
