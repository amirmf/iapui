import { z } from 'zod'
import { attachmentSchema, claimRequestYesNoSchema, docTypeSchema, subInsuredPersonSchema } from '@iap/api-types'

export const myClaimRequestFormSchema = (t: (key: string) => string) => z.object({
  submitDate: z.date(t('claimRequests.validation.submitDateRequired')),
  amount: z.string().nonempty(t('claimRequests.validation.amountRequired')).refine((v) => Number(v) >= 10_000, t('assessmentItems.validation.amountItemMin')).refine((v) => Number(v) <= 10_000_000_000, t('assessmentItems.validation.amountItemMax')),
  attachments: z.array(attachmentSchema).nonempty(t('claimRequests.validation.attachmentsRequired')),
  docType: docTypeSchema.pick({ id: true, docType: true, docTypeCode: true, documentGuide: true }).refine((v) => Boolean(v.id && v.id.length > 1), t('claimRequests.validation.docTypeRequired')),
  extNationalCode: subInsuredPersonSchema.refine((v) => Boolean(v.nationalCode), t('claimRequests.validation.subInsuredPersonRequired')),
  extPolicyId: z.number().min(1, t('claimRequests.validation.insurancePolicyRequired')),
  isForeign: claimRequestYesNoSchema.optional(),
})
export type MyClaimRequestForm = z.infer<ReturnType<typeof myClaimRequestFormSchema>>
export type MyClaimRequestPayload = Omit<MyClaimRequestForm, 'amount' | 'docType' | 'extNationalCode'> & { amount: number; docType: { id: string }; extNationalCode: string }
