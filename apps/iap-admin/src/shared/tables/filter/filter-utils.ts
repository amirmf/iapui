import {
  type ApiFilterParams,
  fromDateRangeKey,
  fromNumberRangeKey,
  toDateRangeKey,
  toNumberRangeKey,
} from '@iap/shared-lib'
import type {
  TableFilterBaseProps,
  TableFilterValue,
  TableFilterValues,
} from '@shared/tables/filter/types'
import type { PaginationState, SortingState } from '@tanstack/react-table'

export const pageNumberQueryParamKey = 'page'
export const pageSizeQueryParamKey = 'pageSize'
export const sortQueryParamKey = 'sort'
export const directionQueryParamKey = 'sortDirection'

const reservedSearchKeys = new Set([
  pageNumberQueryParamKey,
  pageSizeQueryParamKey,
  sortQueryParamKey,
  directionQueryParamKey,
])

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

export type TableFilterSearch = Record<string, string | string[] | undefined>

export type ParsedTableFilterSearch = {
  filters: TableFilterSearch
  pagination: PaginationState
  sorting: SortingState
}

function parsePositiveInteger(value: unknown, fallback: number) {
  if (typeof value !== 'string') return fallback
  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

/** Parses the default page/pageSize/sort/sortDirection URL contract. */
export function parseTableFilterSearch(
  search: TableFilterSearch,
  defaultPageSize = 20
): ParsedTableFilterSearch {
  const filters: TableFilterSearch = {}

  for (const [key, value] of Object.entries(search)) {
    if (!reservedSearchKeys.has(key)) filters[key] = value
  }

  const sortDirection = search[directionQueryParamKey]
  const sortId = search[sortQueryParamKey]

  return {
    filters,
    pagination: {
      pageIndex: parsePositiveInteger(search[pageNumberQueryParamKey], 1) - 1,
      pageSize: parsePositiveInteger(
        search[pageSizeQueryParamKey],
        defaultPageSize
      ),
    },
    sorting:
      typeof sortId === 'string' &&
      (sortDirection === 'asc' || sortDirection === 'desc')
        ? [{ desc: sortDirection === 'desc', id: sortId }]
        : [],
  }
}

/** Serializes the default page/pageSize/sort/sortDirection URL contract. */
export function toTableFilterSearch(
  state: ParsedTableFilterSearch
): TableFilterSearch {
  const { filters, pagination, sorting } = state
  const [sort] = sorting

  return {
    ...filters,
    [pageNumberQueryParamKey]: String(pagination.pageIndex + 1),
    [pageSizeQueryParamKey]: String(pagination.pageSize),
    [sortQueryParamKey]: sort?.id,
    [directionQueryParamKey]: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
  }
}

export type QueryParamFilterConfig = {
  dateRangeFilterIds?: readonly string[]
  numberRangeFilterIds?: readonly string[]
}

function createRangeKeyMap(config: QueryParamFilterConfig) {
  const map = new Map<string, string>()

  for (const id of config.dateRangeFilterIds ?? []) {
    map.set(`${id}${fromDateRangeKey}`, `${id}From`)
    map.set(`${id}${toDateRangeKey}`, `${id}To`)
  }
  for (const id of config.numberRangeFilterIds ?? []) {
    map.set(`${id}${fromNumberRangeKey}`, `${id}From`)
    map.set(`${id}${toNumberRangeKey}`, `${id}To`)
  }

  return map
}

/** Maps API range keys to the table filter controls' range keys. */
export function toTableFilterValues<TFilters extends ApiFilterParams>(
  filters: TFilters,
  config: QueryParamFilterConfig
) {
  const keyMap = createRangeKeyMap(config)

  return Object.fromEntries(
    Object.entries(filters).map(([key, value]) => [
      keyMap.get(key) ?? key,
      value,
    ])
  ) as TFilters
}

/** Maps the table filter controls' range keys to API range keys. */
export function toApiFilterValues<TFilters extends ApiFilterParams>(
  filters: TFilters,
  config: QueryParamFilterConfig
) {
  const keyMap = createRangeKeyMap(config)
  const reversedKeyMap = new Map(
    [...keyMap.entries()].map(([apiKey, tableKey]) => [tableKey, apiKey])
  )

  return Object.fromEntries(
    Object.entries(filters).map(([key, value]) => [
      reversedKeyMap.get(key) ?? key,
      value,
    ])
  ) as TFilters
}
