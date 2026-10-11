import {
  type Attachment,
  attachmentSchema,
  docTypeSchema,
  subInsuredPersonResponseSchema,
} from '@iap/api-types'
import type { TFunction } from 'i18next'
import { z } from 'zod'

export const agentClaimRequestFormSchema = (t: TFunction) =>
  z.object({
    inquiryNationalCode: z
      .string()
      .trim()
      .length(
        10,
        t('agent.claimRequests.create.validation.inquiryNationalCodeLength')
      )
      .min(
        1,
        t('agent.claimRequests.create.validation.inquiryNationalCodeRequired')
      ),
    submitDate: z.date(t('claimRequests.validation.submitDateRequired')),
    amount: z.string().min(1, t('claimRequests.validation.amountRequired')),
    attachments: z
      .array(attachmentSchema)
      .nonempty(t('claimRequests.validation.attachmentsRequired')),
    docType: docTypeSchema
      .pick({
        id: true,
        docType: true,
        docTypeCode: true,
        documentGuide: true,
      })
      .extend({
        id: z.string().min(1, t('claimRequests.validation.docTypeRequired')),
      }),
    extNationalCode: subInsuredPersonResponseSchema.refine(
      (value) => !!value.nationalCode,
      {
        message: t('claimRequests.validation.subInsuredPersonRequired'),
      }
    ),
    extPolicyId: z
      .number()
      .min(1, t('claimRequests.validation.insurancePolicyRequired')),
  })

export type AgentClaimRequestFormValues = z.infer<
  ReturnType<typeof agentClaimRequestFormSchema>
>

export type AgentClaimRequestPayload = Omit<
  AgentClaimRequestFormValues,
  'extNationalCode'
> & {
  extNationalCode: string
}

export type MyClaimRequestPayload = AgentClaimRequestPayload

export const defaultValues: Partial<AgentClaimRequestFormValues> = {
  inquiryNationalCode: '',
  submitDate: undefined,
  amount: '',
  attachments: [] as Attachment[],
  docType: {
    id: '',
    docType: '',
    docTypeCode: '',
    documentGuide: '',
  },
  extNationalCode: {
    id: 0,
    nationalCode: '',
    fullName: '',
  },
  extPolicyId: 0,
}

export const defaultAgentClaimRequestFormValues = defaultValues
