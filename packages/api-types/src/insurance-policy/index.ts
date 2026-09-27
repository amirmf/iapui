import { z } from 'zod'

/** The authenticated customer's policy summary from GET /my/iap/my-policies. */
export const insurancePolicySchema = z.object({
  id: z.number(),
  planId: z.number(),
  title: z.string(),
})

export type InsurancePolicy = z.infer<typeof insurancePolicySchema>
