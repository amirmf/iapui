import { attachmentSchema } from '@iap/api-types'
import type { TFunction } from 'i18next'
import { z } from 'zod'

export const myClaimRequestObjectionFormSchema = (t: TFunction) =>
  z.object({
    formDescription: z
      .string()
      .trim()
      .min(1, t('myiap.claimRequest.messages.descriptionRequired')),
    attachments: z
      .array(attachmentSchema)
      .nonempty(t('myiap.claimRequest.messages.attachmentsRequired')),
  })

export type MyClaimRequestObjectionFormValues = z.infer<
  ReturnType<typeof myClaimRequestObjectionFormSchema>
>
