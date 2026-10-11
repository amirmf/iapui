import { attachmentSchema } from '@iap/api-types'
import { z } from 'zod'

export const myClaimRequestObjectionFormSchema = (
  t: (
    key:
      | 'myiap.claimRequest.messages.descriptionRequired'
      | 'myiap.claimRequest.messages.attachmentsRequired'
  ) => string
) =>
  z.object({
    formDescription: z
      .string()
      .trim()
      .min(1, {
        message: t('myiap.claimRequest.messages.descriptionRequired'),
      }),
    attachments: z
      .array(attachmentSchema)
      .nonempty(t('myiap.claimRequest.messages.attachmentsRequired')),
  })

export type MyClaimRequestObjectionFormValues = z.infer<
  ReturnType<typeof myClaimRequestObjectionFormSchema>
>
