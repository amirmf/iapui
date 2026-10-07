import { z } from 'zod'

type Translate = (
  key: 'claimRequests.documentReceipt.validation.nationalCodeRequired'
) => string

export const exportClaimRequestDocumentReceiptFormSchema = (t: Translate) =>
  z.object({
    extMainNationalCode: z
      .string()
      .trim()
      .min(
        1,
        t('claimRequests.documentReceipt.validation.nationalCodeRequired')
      ),
  })

export type ExportClaimRequestDocumentReceiptForm = z.infer<
  ReturnType<typeof exportClaimRequestDocumentReceiptFormSchema>
>
