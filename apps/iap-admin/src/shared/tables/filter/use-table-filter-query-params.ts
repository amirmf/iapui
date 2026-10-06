import { useCallback, useMemo } from 'react'

import type { TableFilterSearch } from '@shared/tables/filter/filter-utils'
import { useRouter } from '@tanstack/react-router'
import type {
  OnChangeFn,
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table'

import { resolveTableUpdater } from './use-table-filter-state'

export type TableFilterQueryParamsState<
  TFilters extends TableFilterSearch = TableFilterSearch,
> = {
  filters: TFilters
  pagination: PaginationState
  sorting: SortingState
}

type UseTableFilterQueryParamsOptions<
  TState extends TableFilterQueryParamsState,
> = {
  parse: (search: TableFilterSearch) => TState
  resetPageOnSortingChange?: boolean
  search: TableFilterSearch
  serialize: (state: TState) => TableFilterSearch
}

/**
 * Owns table transitions stored in route search parameters.
 *
 * Features retain ownership of parsing and serializing their URL contract so
 * endpoint-specific filter and sorting rules never leak into shared code.
 */
export function useTableFilterQueryParams<
  TState extends TableFilterQueryParamsState,
>(options: UseTableFilterQueryParamsOptions<TState>) {
  const { parse, resetPageOnSortingChange = true, search, serialize } = options
  const router = useRouter()
  const state = useMemo(() => parse(search), [parse, search])
  const navigate = useCallback(
    (nextState: TState) =>
      router.navigate({
        replace: true,
        search: serialize(nextState) as never,
        to: './',
      }),
    [router, serialize]
  )
  const onFiltersChange = useCallback(
    (updater: Updater<TState['filters']>) =>
      navigate({
        ...state,
        filters: resolveTableUpdater(updater, state.filters),
        pagination: { ...state.pagination, pageIndex: 0 },
      }),
    [navigate, state]
  )
  const onPaginationChange = useCallback<OnChangeFn<PaginationState>>(
    (updater) =>
      navigate({
        ...state,
        pagination: resolveTableUpdater(updater, state.pagination),
      }),
    [navigate, state]
  )
  const onSortingChange = useCallback<OnChangeFn<SortingState>>(
    (updater) =>
      navigate({
        ...state,
        pagination: resetPageOnSortingChange
          ? { ...state.pagination, pageIndex: 0 }
          : state.pagination,
        sorting: resolveTableUpdater(updater, state.sorting),
      }),
    [navigate, resetPageOnSortingChange, state]
  )
  const resetFilters = useCallback(
    () => onFiltersChange(() => ({}) as TState['filters']),
    [onFiltersChange]
  )

  return {
    ...state,
    onFiltersChange,
    onPaginationChange,
    onSortingChange,
    resetFilters,
  }
}
