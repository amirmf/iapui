import { z } from 'zod'

/** Query parameter conventions shared by every filterable backend endpoint. */
export const fromDateRangeKey = '__from'
export const toDateRangeKey = '__to'
export const fromNumberRangeKey = '__fromNum'
export const toNumberRangeKey = '__toNum'
export const likeKey = '__like'

export const pageFilterValueSchema = z.union([
  z.string(),
  z.number(),
  z.array(z.string()),
  z.undefined(),
  z.null(),
])

export const pageSortDirectionSchema = z.enum(['desc', 'asc'])

/** Shared filter contract for all standard paginated API requests. */
export const pageFiltersSchema = z
  .object({
    direction: pageSortDirectionSchema.optional(),
    sort: z.string().optional(),
  })
  .catchall(pageFilterValueSchema)

export type ApiFilterParams = z.input<typeof pageFiltersSchema>

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
