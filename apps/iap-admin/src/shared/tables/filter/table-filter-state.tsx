import { useCallback, useState } from 'react'

import {
  getTableFilterCount,
  isTableFiltered,
  updateTableFilterValue,
} from '@shared/tables/filter/filter-utils'
import { TableFilterContent } from '@shared/tables/filter/table-filter-content'
import { TableFilterShell } from '@shared/tables/filter/table-filter-shell'
import type {
  TableFilterBaseProps,
  TableFilterValues,
} from '@shared/tables/filter/types'

export function TableFilterState(
  props: TableFilterBaseProps & {
    ignoredFilterIds?: readonly string[]
    onValuesChange: (
      updater: (previous: TableFilterValues) => TableFilterValues
    ) => void
    values: TableFilterValues
  }
) {
  const {
    className,
    defaultVisibleFilterCount = 6,
    ignoredFilterIds,
    labels,
    onValuesChange,
    values,
    ...filterProps
  } = props
  const [expanded, setExpanded] = useState(false)
  const onValueChange = useCallback(
    (id: string, value: string | string[] | undefined) =>
      onValuesChange((previous) => updateTableFilterValue(previous, id, value)),
    [onValuesChange]
  )
  const count = getTableFilterCount(props)

  return (
    <TableFilterShell
      className={className}
      collapseLabel={labels?.collapse}
      expandLabel={labels?.expand}
      expanded={expanded}
      hasMoreFilters={count > defaultVisibleFilterCount}
      isFiltered={isTableFiltered(values, ignoredFilterIds)}
      onExpandChange={() => setExpanded((current) => !current)}
      onReset={() => onValuesChange(() => ({}))}
      resetLabel={labels?.reset}
    >
      <TableFilterContent
        {...filterProps}
        defaultVisibleFilterCount={defaultVisibleFilterCount}
        expanded={expanded}
        onValueChange={onValueChange}
        values={values}
      />
    </TableFilterShell>
  )
}

/** Compatibility name retained for existing feature consumers. */
export const TableFilters = TableFilterState
