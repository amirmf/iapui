import { pageFiltersSchema } from '@iap/shared-lib'
import { z } from 'zod'

/**
 * Creates the common request contract for filterable paginated endpoints.
 *
 * A domain can narrow `filterValueSchema` when its endpoint supports a more
 * restrictive filter shape. The output always contains page, size, and an
 * object of filters, while callers may omit them and rely on the defaults.
 */
export function createPageRequestSchema() {
  return z
    .object({
      filters: pageFiltersSchema.default({}),
      page: z.number().int().nonnegative().default(0),
      size: z.number().int().positive().default(20),
    })
    .strict()
}

/**
 * Creates the common backend page response contract.
 *
 * Content is always nullish; consumers treat missing or null content as an empty list.
 * Pagination metadata is nullable and optional to tolerate incomplete responses.
 */
export function createPageResponseSchema<TItemSchema extends z.ZodType>(
  itemSchema: TItemSchema
) {
  return z
    .object({
      content: z.array(itemSchema).nullish(),
      empty: z.boolean().nullish(),
      first: z.boolean().nullish(),
      last: z.boolean().nullish(),
      number: z.number().nullish(),
      numberOfElements: z.number().nullish(),
      size: z.number().nullish(),
      totalElements: z.number().nullish(),
      totalPages: z.number().nullish(),
    })
    .loose()
}
