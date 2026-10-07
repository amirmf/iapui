import {
  claimRequestIbanStatusSchema,
  claimRequestStatusSchema,
} from '@iap/api-types'
import type { TFunction } from 'i18next'
import { z } from 'zod'

export function claimRequestBulkStatusChangeFormSchema(t: TFunction) {
  return z.object({
    claimRequestStatus: z.enum(claimRequestStatusSchema.options, {
      error: t('claimRequests.validation.status'),
    }),
    description: z.string().optional(),
    isCheat: claimRequestIbanStatusSchema.optional(),
  })
}

export type ClaimRequestBulkStatusChangeForm = z.infer<
  ReturnType<typeof claimRequestBulkStatusChangeFormSchema>
>
