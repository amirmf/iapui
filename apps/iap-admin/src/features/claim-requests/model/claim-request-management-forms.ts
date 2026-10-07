import { z } from 'zod'

export type {
  ClaimRequest,
  ClaimRequestStatus,
  PartyRole,
  AddObjectionRequest,
} from '@iap/api-types'
export { zodResolver as typedZodResolver } from '@hookform/resolvers/zod'
export const claimRequestReplayFormSchema = (
  t: (
    key:
      | 'claimRequests.messages.descriptionRequired'
      | 'claimRequests.messages.assignmentUserRequired'
  ) => string
) =>
  z.object({
    description: z
      .string()
      .trim()
      .nonempty(t('claimRequests.messages.descriptionRequired')),
  })

export type ClaimRequestReplayForm = z.infer<
  ReturnType<typeof claimRequestReplayFormSchema>
>

export const claimRequestAssigneeFieldsFormSchema = (
  t: (
    key:
      | 'claimRequests.messages.descriptionRequired'
      | 'claimRequests.messages.assignmentUserRequired'
  ) => string
) =>
  z.object({
    agreementId: z.string().optional(),
    assigneeId: z
      .string()
      .nonempty(t('claimRequests.messages.assignmentUserRequired')),
    description: z
      .string()
      .nonempty(t('claimRequests.messages.descriptionRequired')),
  })

export type ClaimRequestAssigneeFieldsForm = z.infer<
  ReturnType<typeof claimRequestAssigneeFieldsFormSchema>
>

export const returnFromPaymentFormSchema = (
  t: (
    key:
      | 'claimRequests.returnFromPayment.validation.description'
      | 'claimRequests.returnFromPayment.validation.understood'
  ) => string
) =>
  z.object({
    understood: z.boolean().refine((value) => value, {
      message: t('claimRequests.returnFromPayment.validation.understood'),
    }),
    description: z
      .string()
      .trim()
      .min(1, t('claimRequests.returnFromPayment.validation.description')),
  })

export type ReturnFromPaymentForm = z.infer<
  ReturnType<typeof returnFromPaymentFormSchema>
>

export const returnFromPaymentSendAgainFormSchema = (
  t: (
    key:
      | 'claimRequests.returnFromPaymentSendAgain.validation.description'
      | 'claimRequests.returnFromPaymentSendAgain.validation.understood'
  ) => string
) =>
  z.object({
    understood: z.boolean().refine((value) => value, {
      message: t(
        'claimRequests.returnFromPaymentSendAgain.validation.understood'
      ),
    }),
    description: z
      .string()
      .trim()
      .min(
        1,
        t('claimRequests.returnFromPaymentSendAgain.validation.description')
      ),
  })

export type ReturnFromPaymentSendAgainForm = z.infer<
  ReturnType<typeof returnFromPaymentSendAgainFormSchema>
>

export const fanhubTaminNationalCodeFormSchema = (
  t: (
    key:
      | 'claimRequests.taminPrescriptions.validation.nationalCodeLength'
      | 'claimRequests.taminPrescriptions.validation.nationalCodeRequired'
  ) => string
) =>
  z.object({
    nationalCode: z
      .string()
      .trim()
      .min(
        1,
        t('claimRequests.taminPrescriptions.validation.nationalCodeRequired')
      )
      .length(
        10,
        t('claimRequests.taminPrescriptions.validation.nationalCodeLength')
      ),
  })
export type FanhubTaminNationalCodeForm = z.infer<
  ReturnType<typeof fanhubTaminNationalCodeFormSchema>
>

export const updateSubmitDateFormSchema = (
  t?: (
    key:
      | 'claimRequests.validation.amountRequired'
      | 'claimRequests.validation.submitDateRequired'
  ) => string
) =>
  z.object({
    submitDate: z.date({
      message: t?.('claimRequests.validation.submitDateRequired'),
    }),
    amount: z.string().nonempty({
      message: t?.('claimRequests.validation.amountRequired'),
    }),
  })

export type UpdateSubmitDateFormValues = z.input<
  ReturnType<typeof updateSubmitDateFormSchema>
>

export const fanhubIhioPrintCodeFormSchema = (
  t: (key: 'claimRequests.ihioPrintCode.validation.printCode') => string
) =>
  z.object({
    printCode: z
      .string()
      .trim()
      .min(1, t('claimRequests.ihioPrintCode.validation.printCode')),
  })
export type FanhubIhioPrintCodeForm = z.infer<
  ReturnType<typeof fanhubIhioPrintCodeFormSchema>
>
