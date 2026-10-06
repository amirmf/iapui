import { z } from 'zod'

export const agreementRouteSearchSchema = z
  .object({
    direction: z.enum(['asc', 'desc']).optional(),
    extContractId: z.string().optional(),
    extLocation: z.string().optional(),
    extPlanId: z.string().optional(),
    extPolicyId: z.string().optional(),
    page: z.string().optional(),
    size: z.string().optional(),
    sort: z.string().optional(),
    status: z.union([z.string(), z.array(z.string())]).optional(),
    templateCode: z.string().optional(),
    thruDate__from: z.string().optional(),
    thruDate__to: z.string().optional(),
    title: z.string().optional(),
  })
  .strict()
