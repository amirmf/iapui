import { z } from 'zod'

export const assessmentPromptRouteSearchSchema = z
  .object({
    'agreement.code': z.string().optional(),
    'agreement.title': z.string().optional(),
    direction: z.enum(['asc', 'desc']).optional(),
    docTypeCode: z.union([z.string(), z.array(z.string())]).optional(),
    page: z.string().optional(),
    placeType: z.union([z.string(), z.array(z.string())]).optional(),
    ruleState: z.union([z.string(), z.array(z.string())]).optional(),
    size: z.string().optional(),
    sort: z.string().optional(),
    status: z.union([z.string(), z.array(z.string())]).optional(),
    thruDate__from: z.string().optional(),
    thruDate__to: z.string().optional(),
    title: z.string().optional(),
  })
  .loose()
