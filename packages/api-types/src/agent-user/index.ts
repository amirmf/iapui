import { mobilePhoneRegex } from '@iap/shared-lib'
import { z } from 'zod'

import { nationalityTypeSchema } from '../user-account/enums'

// Reference parity: unknown request keys are intentionally stripped.
export const agentSignupRequestSchema = z.object({
  phoneNumber: z.string().trim().regex(mobilePhoneRegex),
  nationalCode: z.string().trim().min(1),
  password: z
    .string()
    .min(6)
    .max(255)
    .refine((value) => value.trim().length > 0),
  nationalityType: nationalityTypeSchema.default('IR'),
})

export const agentSignupResponseSchema = z.undefined()

export type AgentSignupRequest = z.infer<typeof agentSignupRequestSchema>
