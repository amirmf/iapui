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
    fromKey,
    id,
    locale,
    mode = 'date',
    onValueChange,
    toPlaceholder = 'To',
    toKey,
    values,
    wrapperClassName,
  } = props
  const resolvedFromKey = fromKey ?? tableFilterKeys.dateFrom(id)
  const resolvedToKey = toKey ?? tableFilterKeys.dateTo(id)

  return (
    <DateRangePicker
      className={cn(wrapperClassName, className)}
      fromPlaceholder={fromPlaceholder}
      locale={locale}
      mode={mode}
      onChange={(range) => {
        onValueChange(resolvedFromKey, toTableFilterDate(range.from, mode))
        onValueChange(resolvedToKey, toTableFilterDate(range.to, mode))
      }}
      toPlaceholder={toPlaceholder}
      value={{
        from: parseTableFilterDate(values[resolvedFromKey]),
        to: parseTableFilterDate(values[resolvedToKey]),
      }}
    />
  )
}

export const TableFilterDateTimeRangeFilter = TableFilterDateRangeFilter
