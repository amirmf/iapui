/** Query parameter conventions shared by every filterable backend endpoint. */
export const fromDateRangeKey = '__from'
export const toDateRangeKey = '__to'
export const fromNumberRangeKey = '__fromNum'
export const toNumberRangeKey = '__toNum'
export const likeKey = '__like'

export type ApiFilterParams = Record<
  string,
  string | string[] | number | undefined
>

/** Mirrors the backend filter contract: array values are serialized as `__in`. */
export function transformApiFilterParams(
  filters: ApiFilterParams,
  ignoredKeys: readonly string[] = []
) {
  const ignored = new Set(ignoredKeys)

  return Object.fromEntries(
    Object.entries(filters)
      .filter(([key]) => !ignored.has(key))
      .map(([key, value]) =>
        Array.isArray(value) ? [`${key}__in`, value.join(',')] : [key, value]
      )
  )
}
