import { z } from 'zod'

export const coverageRouteSearchSchema = z
  .object({
    code: z.string().optional(),
    coverageType: z.string().optional(),
    direction: z.enum(['asc', 'desc']).optional(),
    extId: z.string().optional(),
    page: z.string().optional(),
    size: z.string().optional(),
    sort: z.string().optional(),
    status: z.string().optional(),
    thruDateFrom: z.string().optional(),
    thruDateTo: z.string().optional(),
    title: z.string().optional(),
  })
  .strict()
