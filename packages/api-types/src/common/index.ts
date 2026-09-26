import { z } from 'zod'

/**
 * Creates the common backend page response contract.
 *
 * Content remains required because consumers render it directly. Pagination
 * metadata is nullable and optional to tolerate endpoints that omit it.
 */
export function createPageResponseSchema<TItemSchema extends z.ZodType>(
  itemSchema: TItemSchema
) {
  return z
    .object({
      content: z.array(itemSchema),
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
