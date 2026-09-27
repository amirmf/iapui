import { DateRangePicker, cn } from '@iap/ui'
import {
  parseTableFilterDate,
  tableFilterKeys,
  toTableFilterDate,
} from '@shared/tables/filter/filter-utils'
import type {
  DateRangeTableFilterConfig,
  TableFilterValues,
} from '@shared/tables/filter/types'

export function TableFilterDateRangeFilter(
  props: DateRangeTableFilterConfig & {
    onValueChange: (id: string, value: string | undefined) => void
    values: TableFilterValues
  }
) {
  const {
    className,
    fromPlaceholder = 'From',
    id,
    locale,
    mode = 'date',
    onValueChange,
    toPlaceholder = 'To',
    values,
    wrapperClassName,
  } = props
  const fromKey = tableFilterKeys.dateFrom(id)
  const toKey = tableFilterKeys.dateTo(id)

  return (
    <DateRangePicker
      className={cn(wrapperClassName, className)}
      fromPlaceholder={fromPlaceholder}
      locale={locale}
      mode={mode}
      onChange={(range) => {
        onValueChange(fromKey, toTableFilterDate(range.from, mode))
        onValueChange(toKey, toTableFilterDate(range.to, mode))
      }}
      toPlaceholder={toPlaceholder}
      value={{
        from: parseTableFilterDate(values[fromKey]),
        to: parseTableFilterDate(values[toKey]),
      }}
    />
  )
}

export const TableFilterDateTimeRangeFilter = TableFilterDateRangeFilter
