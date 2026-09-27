import {
  claimRequestIbanStatusSchema,
  claimRequestStatusSchema,
} from '@iap/api-types'
import type { TFunction } from 'i18next'
import { z } from 'zod'

export function createClaimRequestBulkStatusChangeSchema(t: TFunction) {
  return z.object({
    claimRequestStatus: claimRequestStatusSchema.optional().refine(Boolean, {
      message: t('claimRequests.validation.status'),
    }),
    description: z.string().optional(),
    isCheat: claimRequestIbanStatusSchema.optional(),
  })
}

export type ClaimRequestBulkStatusChangeForm = z.infer<
  ReturnType<typeof createClaimRequestBulkStatusChangeSchema>
>
