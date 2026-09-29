import { z } from 'zod'

export const docTypeRouteSearchSchema = z
  .object({
    docType: z.string().optional(),
    page: z.string().optional(),
    pageSize: z.string().optional(),
    sort: z.string().optional(),
    sortDirection: z.enum(['asc', 'desc']).optional(),
  })
  .strict()
