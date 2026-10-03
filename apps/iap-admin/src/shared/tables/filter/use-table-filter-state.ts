import { useCallback, useMemo, useState } from 'react'

import { updateTableFilterValue } from '@shared/tables/filter/filter-utils'
import type {
  TableFilterValue,
  TableFilterValues,
} from '@shared/tables/filter/types'
import type { PaginationState } from '@tanstack/react-table'

const initialPagination: PaginationState = { pageIndex: 0, pageSize: 40 }

export function useTableFilterState(initialValues: TableFilterValues = {}) {
  const [filters, setFilters] = useState<TableFilterValues>(initialValues)
  const [pagination, setPagination] = useState(initialPagination)
  const onChange = useCallback(
    (id: string, value: TableFilterValue) =>
      setFilters((previous) => updateTableFilterValue(previous, id, value)),
    []
  )
  const reset = useCallback((nextFilters: TableFilterValues = {}) => {
    setFilters(nextFilters)
    setPagination((previous) => ({ ...previous, pageIndex: 0 }))
  }, [])
  const isFiltered = useMemo(() => Object.keys(filters).length > 0, [filters])

  return {
    filters,
    isFiltered,
    onChange,
    pagination,
    reset,
    setFilters,
    setPagination,
    setValues: setFilters,
    values: filters,
  }
}
