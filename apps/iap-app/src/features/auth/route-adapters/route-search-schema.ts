import { z } from 'zod'

export const authRouteSearchSchema = z
  .object({
    callbackUrl: z.string().optional(),
  })
  .strict()
