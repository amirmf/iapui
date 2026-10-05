import { z } from 'zod'

export const personSpecialDiseaseRouteSearchSchema = z
  .object({
    page: z.string().optional(),
    size: z.string().optional(),
  })
  .catchall(z.union([z.string(), z.number(), z.array(z.string())]))
