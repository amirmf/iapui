import { claimRequestStatusSchema } from '@iap/api-types'
import { z } from 'zod'

type Translate = (
  key:
    'claimRequests.validation.status' | 'claimRequests.validation.description'
) => string
export const claimRequestObjectionFormSchema = (t: Translate) =>
  z
    .object({
      claimRequestStatus: z.enum(claimRequestStatusSchema.options, {
        error: t('claimRequests.validation.status'),
      }),
      description: z.string().nullish(),
      isCheat: z.enum(['Y', 'N']).optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.claimRequestStatus !== 'APPROVED' &&
        (!data.description || data.description.length <= 0)
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['description'],
          message: t('claimRequests.validation.description'),
        })
      }
    })
export type ClaimRequestObjectionForm = z.infer<
  ReturnType<typeof claimRequestObjectionFormSchema>
>
