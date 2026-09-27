import type {
  TableFilterBaseProps,
  TableFilterValue,
  TableFilterValues,
} from '@shared/tables/filter/types'

export const tableFilterKeys = {
  dateFrom: (id: string) => `${id}From`,
  dateTo: (id: string) => `${id}To`,
  numberFrom: (id: string) => `${id}From`,
  numberTo: (id: string) => `${id}To`,
}

export function hasTableFilterValue(value: TableFilterValue) {
  return Array.isArray(value) ? value.length > 0 : Boolean(value)
}

export function isTableFiltered(
  values: TableFilterValues,
  ignoredIds: readonly string[] = []
) {
  return Object.entries(values).some(
    ([id, value]) => !ignoredIds.includes(id) && hasTableFilterValue(value)
  )
}

export function updateTableFilterValue(
  values: TableFilterValues,
  id: string,
  value: TableFilterValue
) {
  const next = { ...values }
  if (hasTableFilterValue(value)) next[id] = value
  else delete next[id]
  return next
}

export function parseTableFilterDate(value: TableFilterValue) {
  if (typeof value !== 'string' || !value) return undefined
  const date = new Date(value.includes('T') ? value : `${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export function toTableFilterDate(
  date: Date | undefined,
  mode: 'date' | 'date-time' = 'date'
) {
  if (!date) return undefined
  if (mode === 'date-time') return date.toISOString()
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

export function getTableFilterCount(props: TableFilterBaseProps) {
  return (
    (props.textFilters?.length ?? 0) +
    (props.numberRangeFilters?.length ?? 0) +
    (props.dateRangeFilters?.length ?? 0) +
    (props.dateTimeRangeFilters?.length ?? 0) +
    (props.facetedFilters?.length ?? 0)
  )
}
