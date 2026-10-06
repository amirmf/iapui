import { useEffect, useRef, useState } from 'react'

import { DateRangePicker, type DateRangeValue, cn } from '@iap/ui'
import { formatDate } from '@shared/lib/format-date'
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
    presentation?: 'default' | 'reference'
  }
) {
  const {
    className,
    debounceMs = 500,
    fromPlaceholder = 'From',
    fromKey,
    id,
    locale,
    mode = 'date',
    onValueChange,
    presentation = 'default',
    toPlaceholder = 'To',
    toKey,
    values,
    wrapperClassName,
  } = props
  const resolvedFromKey = fromKey ?? tableFilterKeys.dateFrom(id)
  const resolvedToKey = toKey ?? tableFilterKeys.dateTo(id)
  const fromValue = values[resolvedFromKey]
  const toValue = values[resolvedToKey]
  const [localRange, setLocalRange] = useState<DateRangeValue>(() => ({
    from: parseTableFilterDate(fromValue),
    to: parseTableFilterDate(toValue),
  }))
  const pending = useRef<number | undefined>(undefined)
  useEffect(() => {
    setLocalRange({
      from: parseTableFilterDate(fromValue),
      to: parseTableFilterDate(toValue),
    })
  }, [fromValue, toValue])
  useEffect(() => () => window.clearTimeout(pending.current), [])
  const emit = (range: DateRangeValue) => {
    onValueChange(resolvedFromKey, toTableFilterDate(range.from, mode))
    onValueChange(resolvedToKey, toTableFilterDate(range.to, mode))
  }

  const picker = (
    <DateRangePicker
      presentation={presentation}
      className={cn(
        presentation === 'reference' && 'p-3',
        presentation !== 'reference' && wrapperClassName,
        presentation !== 'reference' && className
      )}
      triggerClassName={cn(
        presentation === 'reference' && 'h-8 w-full',
        presentation === 'reference' && className
      )}
      fromPlaceholder={fromPlaceholder}
      formatLabel={presentation === 'reference' ? formatDate : undefined}
      separator={presentation === 'reference' ? '-' : undefined}
      locale={locale}
      mode={mode}
      onChange={(range) => {
        if (presentation === 'reference') {
          setLocalRange(range)
          window.clearTimeout(pending.current)
          pending.current = window.setTimeout(() => emit(range), debounceMs)
        } else emit(range)
      }}
      toPlaceholder={toPlaceholder}
      value={
        presentation === 'reference'
          ? localRange
          : {
              from: parseTableFilterDate(values[resolvedFromKey]),
              to: parseTableFilterDate(values[resolvedToKey]),
            }
      }
    />
  )
  return presentation === 'reference' ? (
    <div className={wrapperClassName}>{picker}</div>
  ) : (
    picker
  )
}

export const TableFilterDateTimeRangeFilter = TableFilterDateRangeFilter
