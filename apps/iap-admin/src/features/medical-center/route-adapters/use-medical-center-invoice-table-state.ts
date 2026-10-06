import { useCallback, useEffect, useState } from 'react'

import { parseMedicalCenterInvoiceTableSearch } from '@features/medical-center/route-adapters/table-search'
import type { TableFilterSearch } from '@shared/tables'
import { useLocation, useRouter } from '@tanstack/react-router'
import type {
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table'

export function useMedicalCenterInvoiceTableState() {
  const search = useLocation({
    select: (location) => location.search,
  }) as TableFilterSearch
  const router = useRouter()
  const state = parseMedicalCenterInvoiceTableSearch(search)
  // Source sorting is initialized once; external URL changes only refresh
  // pagination and filters. Each control writes only its own query parameters.
  const [initialSorting] = useState(() => state.sorting)
  const [sorting, setSorting] = useState<SortingState>([])
  useEffect(() => {
    setSorting(initialSorting)
  }, [initialSorting])
  const setPagination = useCallback(
    (updater: Updater<PaginationState>) => {
      const next =
        typeof updater === 'function' ? updater(state.pagination) : updater
      router.navigate({
        to: '.',
        replace: true,
        search: (previous: TableFilterSearch) => ({
          ...previous,
          page: String(next.pageIndex + 1),
          size: String(next.pageSize),
        }),
      } as never)
    },
    [router, state.pagination]
  )
  const onSortingChange = useCallback(
    (updater: Updater<SortingState>) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater
      setSorting(next)
      router.navigate({
        to: '.',
        replace: true,
        search: (previous: TableFilterSearch) => {
          const result = { ...previous }
          if (next.length) {
            result.sort = String(next[0].id)
            result.direction = next[0].desc ? 'desc' : 'asc'
          } else {
            delete result.sort
            delete result.direction
          }
          return result
        },
      } as never)
    },
    [router, sorting]
  )
  return {
    filters: state.filters,
    pagination: state.pagination,
    sorting,
    setPagination,
    onSortingChange,
  }
}
