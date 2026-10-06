import { useEffect, useRef, useState } from 'react'

import { formatLocalDateTime } from '@iap/shared-lib'
import { DateRangePicker, type DateRangeValue, cn } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
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
    fromPlaceholder,
    fromKey,
    id,
    locale,
    mode = 'date',
    onValueChange,
    toPlaceholder,
    toKey,
    values,
    wrapperClassName,
    presentation = 'default',
  } = props
  const { t } = useTranslate()
  const resolvedFromKey =
    fromKey ??
    (presentation === 'reference'
      ? `${id}__from`
      : tableFilterKeys.dateFrom(id))
  const resolvedToKey =
    toKey ??
    (presentation === 'reference' ? `${id}__to` : tableFilterKeys.dateTo(id))
  const [range, setRange] = useState<DateRangeValue>(() => ({
    from: parseTableFilterDate(values[resolvedFromKey]),
    to: parseTableFilterDate(values[resolvedToKey]),
  }))
  const pending = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const isReference = presentation === 'reference'
  const fromValue = values[resolvedFromKey]
  const toValue = values[resolvedToKey]
  useEffect(() => {
    clearTimeout(pending.current)
    setRange({
      from: parseTableFilterDate(fromValue),
      to: parseTableFilterDate(toValue),
    })
  }, [fromValue, toValue, resolvedFromKey, resolvedToKey])
  useEffect(() => () => clearTimeout(pending.current), [])
  const change = (next: DateRangeValue) => {
    setRange(next)
    clearTimeout(pending.current)
    const publish = () => {
      onValueChange(
        resolvedFromKey,
        isReference && mode === 'date'
          ? next.from
            ? formatLocalDateTime(next.from, 'yyyy-MM-dd')
            : undefined
          : toTableFilterDate(next.from, mode)
      )
      onValueChange(
        resolvedToKey,
        isReference && mode === 'date'
          ? next.to
            ? formatLocalDateTime(next.to, 'yyyy-MM-dd')
            : undefined
          : toTableFilterDate(next.to, mode)
      )
    }
    if (isReference) pending.current = setTimeout(publish, 500)
    else publish()
  }

  return (
    <DateRangePicker
      presentation={presentation}
      className={cn(!isReference && [wrapperClassName, className])}
      wrapperClassName={isReference ? wrapperClassName : undefined}
      triggerClassName={cn(isReference && ['lg:w-[250px]', className])}
      fromPlaceholder={
        fromPlaceholder ?? (isReference ? t('common.from') : 'From')
      }
      clearLabel={isReference ? t('common.clear') : undefined}
      locale={locale}
      mode={mode}
      onChange={change}
      toPlaceholder={toPlaceholder ?? (isReference ? t('common.to') : 'To')}
      value={range}
    />
  )
}

export const TableFilterDateTimeRangeFilter = TableFilterDateRangeFilter
