import { z } from 'zod'

export const subUserRouteSearchSchema = z
  .object({
    direction: z.string().optional(),
    displayName: z.string().optional(),
    mobileNumber: z.string().optional(),
    page: z.string().optional(),
    size: z.string().optional(),
    sort: z.string().optional(),
    status: z.union([z.string(), z.array(z.string())]).optional(),
    username: z.string().optional(),
  })
  .catchall(z.union([z.string(), z.number(), z.array(z.string())]))

export type SubUserRouteSearch = z.infer<typeof subUserRouteSearchSchema>
