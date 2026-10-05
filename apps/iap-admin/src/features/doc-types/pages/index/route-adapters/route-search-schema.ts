import { z } from 'zod'

export const docTypeRouteSearchSchema = z
  .object({
    docType: z.string().optional(),
    page: z.string().optional(),
    size: z.string().optional(),
    sort: z.string().optional(),
    direction: z.enum(['asc', 'desc']).optional(),
  })
  .strict()
