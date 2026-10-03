import { z } from 'zod'

const optionalTableValueSchema = z
  .union([z.string(), z.array(z.string())])
  .optional()

export const claimReportRouteSearchSchema = z
  .object({
    deliveryDateFrom: z.string().optional(),
    deliveryDateTo: z.string().optional(),
    exId: z.string().optional(),
    'outpatientClaim.claimNo': z.string().optional(),
    'outpatientClaim.inqueryStatusTitle': z.string().optional(),
    direction: z.enum(['asc', 'desc']).optional(),
    page: z.string().optional(),
    policyId: z.string().optional(),
    size: z.string().optional(),
    sort: z.string().optional(),
    status: optionalTableValueSchema,
  })
  .strict()
