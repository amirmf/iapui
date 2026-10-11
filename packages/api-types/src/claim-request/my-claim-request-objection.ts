import { z } from 'zod'

import { attachmentSchema } from '../files'
import { claimRequestStatusSchema } from './index'

export const myClaimRequestObjectionRequestSchema = z.strictObject({
  claimRequestId: z.string(),
  description: z.string(),
  attachments: z.array(attachmentSchema).default([]),
  claimRequestStatus: claimRequestStatusSchema.optional(),
})
export type MyClaimRequestObjectionRequest = z.input<
  typeof myClaimRequestObjectionRequestSchema
>
