import { useCallback, useState } from 'react'

import { updateTableFilterValue } from '@shared/tables/filter/filter-utils'
import type {
  TableFilterValue,
  TableFilterValues,
} from '@shared/tables/filter/types'

export function useTableFilterState(initialValues: TableFilterValues = {}) {
  const [values, setValues] = useState<TableFilterValues>(initialValues)
  const onChange = useCallback(
    (id: string, value: TableFilterValue) =>
      setValues((previous) => updateTableFilterValue(previous, id, value)),
    []
  )
  const reset = useCallback(
    (nextValues: TableFilterValues = {}) => setValues(nextValues),
    []
  )

  return { onChange, reset, setValues, values }
}
