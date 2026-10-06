import { z } from 'zod'

const optionalTableValueSchema = z
  .union([z.string(), z.array(z.string())])
  .optional()

export const outpatientDocAcceptanceRouteSearchSchema = z
  .object({
    deliveryDateFrom: z.string().optional(),
    deliveryDateTo: z.string().optional(),
    exId: z.string().optional(),
    letterNo: z.string().optional(),
    inqueryStatusId: z.string().optional(),
    inqueryStatusTitle: z.string().optional(),
    opUnitId: z.string().optional(),
    extLocationId: z.string().optional(),
    updatedAtFrom: z.string().optional(),
    updatedAtTo: z.string().optional(),
    wsStatus: optionalTableValueSchema,
    direction: z.enum(['asc', 'desc']).optional(),
    page: z.string().optional(),
    policyId: z.string().optional(),
    size: z.string().optional(),
    sort: z.string().optional(),
    status: optionalTableValueSchema,
  })
  .strict()
