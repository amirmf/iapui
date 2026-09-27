import {
  type ApiFilterParams,
  fromDateRangeKey,
  fromNumberRangeKey,
  toDateRangeKey,
  toNumberRangeKey,
} from '@iap/shared-lib'

export type QueryParamFilterValues = ApiFilterParams

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

export function toTableFilterValues<TFilters extends QueryParamFilterValues>(
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

export function toApiFilterValues<TFilters extends QueryParamFilterValues>(
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
