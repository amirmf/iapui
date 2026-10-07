import {
  assessmentItemStatusSchema,
  assessmentItemToothTypeSchema,
  damageCodeSchema,
  tariffEnumSchema,
} from '@iap/api-types'
import { z } from 'zod'

type AssessmentTranslate = (
  key:
    | 'assessmentItems.validation.adjustmentTitle'
    | 'assessmentItems.validation.adjustmentTotalSumAmount'
    | 'assessmentItems.validation.adjustmentTotalSumAmountGreaterThanZero'
    | 'assessmentItems.validation.amountItem'
    | 'assessmentItems.validation.amountItemMax'
    | 'assessmentItems.validation.amountItemMin'
    | 'assessmentItems.validation.claimRequestId'
    | 'assessmentItems.validation.damageCodeId'
    | 'assessmentItems.validation.franchisePercentageRange'
    | 'assessmentItems.validation.overrideInsuredPersonId'
    | 'assessmentItems.validation.quantity'
    | 'assessmentItems.validation.quantityMax'
    | 'assessmentItems.validation.quantityMin'
    | 'assessmentItems.validation.toothNumber.max'
    | 'assessmentItems.validation.toothNumber.min'
) => string

export const assessmentItemFormSchema = (t?: AssessmentTranslate) => {
  return z
    .object({
      claimRequestId: z
        .string()
        .nonempty(t?.('assessmentItems.validation.claimRequestId')),
      damageCode: damageCodeSchema.refine((damageCode) => !!damageCode.id, {
        message: t?.('assessmentItems.validation.damageCodeId'),
      }),
      status: assessmentItemStatusSchema,
      amountItem: z
        .string()
        .nonempty(t?.('assessmentItems.validation.amountItem'))
        .refine((value) => Number(value) >= Math.pow(10, 4), {
          message: t?.('assessmentItems.validation.amountItemMin'),
        })
        .refine((value) => Number(value) <= Math.pow(10, 10), {
          message: t?.('assessmentItems.validation.amountItemMax'),
        }),
      estimatedAmount: z.number(),
      quantity: z
        .string()
        .nonempty(t?.('assessmentItems.validation.quantity'))
        .refine((value) => !isNaN(Number(value)) && Number(value) >= 1, {
          message: t?.('assessmentItems.validation.quantityMin'),
        })
        .refine((value) => !isNaN(Number(value)) && Number(value) < 101, {
          message: t?.('assessmentItems.validation.quantityMax'),
        }),
      // franchizeDeductionAmount: z.string(),
      withFranchize: z.boolean().optional(),
      useFloatCoverage: z.boolean().optional(),
      // dontApplyTariff: z.boolean().optional(),
      tariff: tariffEnumSchema.nullish(),
      overrideRatio: z.number().nullish(),
      // franchisePercentage: z
      //   .string()
      //   .refine(
      //     (value) =>
      //       !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100,
      //     {
      //       message: t?.('assessmentItems.validation.franchisePercentageRange'),
      //     }
      //   )
      //   .optional(),
      // amount: z.string(),
      toothNumber: z
        .number()
        .int()
        .min(0, t?.('assessmentItems.validation.toothNumber.min'))
        .max(906, t?.('assessmentItems.validation.toothNumber.max'))
        .nullable()
        .optional(),
      toothNumbers: z
        .array(z.int())
        .min(1, t?.('assessmentItems.validation.toothNumber.min'))
        // .number()
        // .int()
        // .min(0, tFunc('assessmentItems.validation.toothNumber.min'))
        // .max(906, tFunc('assessmentItems.validation.toothNumber.max'))
        .nullable()
        .optional(),
      toothType: assessmentItemToothTypeSchema.nullish(),
      remainCoverageAmount: z.number().nullish(),
      maxPerCaseAmount: z.number().nullish(),
      overrideInsuredPersonId: z.number().nullish(),
    })
    .superRefine((data, ctx) => {
      if (data.useFloatCoverage && data.overrideInsuredPersonId == null) {
        ctx.addIssue({
          code: 'custom',
          path: ['overrideInsuredPersonId'],
          message: t?.('assessmentItems.validation.overrideInsuredPersonId'),
        })
      }
    })
}

export type AssessmentItemFormType = z.infer<
  ReturnType<typeof assessmentItemFormSchema>
>

export const assessmentItemAdjustmentFormSchema = (t?: AssessmentTranslate) => {
  const tFunc = t || ((key: string) => key)

  return z.object({
    title: z
      .string()
      .trim()
      .nonempty(tFunc('assessmentItems.validation.adjustmentTitle')),
    description: z.string().optional(),
    totalSumAmount: z
      .string()
      .trim()
      .nonempty(tFunc('assessmentItems.validation.adjustmentTotalSumAmount'))
      .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
        message: tFunc(
          'assessmentItems.validation.adjustmentTotalSumAmountGreaterThanZero'
        ),
      }),
  })
}

export type AssessmentItemAdjustmentFormValues = z.infer<
  ReturnType<typeof assessmentItemAdjustmentFormSchema>
>
