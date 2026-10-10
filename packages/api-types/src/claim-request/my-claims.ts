import { z } from 'zod'

import { createPageRequestSchema } from '../common'
import { insurancePolicySchema } from '../insurance-policy'

export const myClaimRequestPageRequestSchema = createPageRequestSchema().extend(
  {
    size: z.number().int().positive().default(10),
  }
)

export const insurancePoliciesRequestSchema = z.object({}).strict()
export const insurancePoliciesResponseSchema = z.array(insurancePolicySchema)
export const myClaimSubInsuredPersonSchema = z.object({
  id: z.number().nullable(),
  nationalCode: z.string(),
  fullName: z.string(),
  isForeign: z.enum(['Y', 'N']).nullish(),
})
export const subInsuredPeopleRequestSchema = z
  .object({ policyId: z.number() })
  .strict()
export const subInsuredPeopleResponseSchema = z.array(myClaimSubInsuredPersonSchema)

export type MyClaimRequestPageRequest = z.input<
  typeof myClaimRequestPageRequestSchema
>
export type MyClaimSubInsuredPerson = z.infer<typeof myClaimSubInsuredPersonSchema>
