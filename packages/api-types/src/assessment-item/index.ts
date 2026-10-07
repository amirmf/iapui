import { z } from 'zod'

import { dmgCaseSchema } from '../outpatient-doc-acceptance'

export const assessmentItemStatusSchema = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'FAILED_FETCH_API',
])

export const assessmentItemToothTypeSchema = z.enum(['PERMANENT', 'DECIDUOUS'])

export type AssessmentItemToothType = z.infer<
  typeof assessmentItemToothTypeSchema
>

export const claimRequestAdjustmentStatusSchema = z.enum([
  'SUBMITTED',
  'APPROVED',
  'SENT',
  'SENT_FAILED',
  'TERMINATED',
  'PAYMENT_REJECTED',
  'PAID',
])

export type ClaimRequestAdjustmentStatus = z.infer<
  typeof claimRequestAdjustmentStatusSchema
>

export const damageCodeReferenceSchema = z
  .object({
    // Some APIs may return non-UUID or null IDs, so allow any string or null
    id: z.string().nullish(),
    code: z.string().nullish(),
    title: z.string().nullish(),
    extId: z.string().nullish(),
    extCode: z.string().nullish(),
    coverageDetailId: z.string().nullish(),
    coverageDetailExtId: z.string().nullish(),
    coverageDetailExtCode: z.string().nullish(),
  })
  .loose()

export type damageCodeReferenceType = z.infer<typeof damageCodeReferenceSchema>

export const claimRequestAdjustmentSchema = z
  .object({
    title: z.string().nullish(),
    description: z.string().nullish(),
    createdBy: z.string().nullish(),
    totalSumAmount: z.number().nullish(),
    status: claimRequestAdjustmentStatusSchema.nullish(),
    adjClaimRequestId: z.string().nullish(),
    damageCode: damageCodeReferenceSchema.nullish(),
    toothNumber: z.number().int().nullish(),
    toothNumbers: z.array(z.number().int()).nullish(),
    toothType: assessmentItemToothTypeSchema.nullish(),
    jaw: z.string().nullish(),
    estimatedAmount: z.number().nullish(),
    amountItem: z.number().nullish(),
    amount: z.number().nullish(),
    franchizeDeductionAmount: z.number().nullish(),
    franchizeDeductionAmountItem: z.number().nullish(),
    remainCoverageAmount: z.number().nullish(),
    maxPerCaseAmount: z.number().nullish(),
    quantity: z.number().nullish(),
  })
  .loose()

export type ClaimRequestAdjustment = z.infer<
  typeof claimRequestAdjustmentSchema
>

export const assessmentItemSchema = z
  .object({
    id: z.string().optional(),
    partyId: z.uuid().nullish(),
    claimRequestId: z.string().nullish(),
    damageCode: damageCodeReferenceSchema.nullish(),
    toothNumber: z.number().int().nullish(),
    toothNumbers: z.array(z.number().int()).nullish(),
    toothType: assessmentItemToothTypeSchema.nullish(),
    jaw: z.string().nullish(),
    estimatedAmount: z.number().nullish(),
    amountItem: z.number().nullish(),
    amount: z.number().nullish(),
    corePaidAmount: z.number().nullish(),
    corePaidAmountPercent: z.number().nullish(),
    franchizeDeductionAmount: z.number().nullish(),
    franchizeDeductionAmountItem: z.number().nullish(),
    remainCoverageAmount: z.number().nullish(),
    maxPerCaseAmount: z.number().nullish(),
    quantity: z.number().nullish(),
    status: assessmentItemStatusSchema.nullish(),
    description: z.string().nullish(),
    claimRequestAdjustment: claimRequestAdjustmentSchema.nullish(),
    overrideInsuredPersonId: z.number().nullish(),
    createdAt: z.string().nullish(),
    updatedAt: z.string().nullish(),
  })
  .loose()

export type AssessmentItem = z.infer<typeof assessmentItemSchema>

export const assessmentItemListSchema = z.array(assessmentItemSchema)
export const findAssessmentItemsByClaimRequestRequestSchema = z.object({
  path: z.object({ claimRequestId: z.string().trim().min(1) }),
})

export type FindAssessmentItemsByClaimRequestRequest = z.infer<
  typeof findAssessmentItemsByClaimRequestRequestSchema
>

export const afterCalculationResultRequestSchema = z
  .object({
    claimRequestId: z.string(),
    assessmentItemId: z.string().optional(),
  })
  .strict()
export const afterCalculationResultResponseSchema = z.array(dmgCaseSchema)
export type AfterCalculationResultRequest = z.infer<
  typeof afterCalculationResultRequestSchema
>
export type AfterCalculationResultResponse = z.infer<
  typeof afterCalculationResultResponseSchema
>

export const assessmentItemDamageCodeSchema = damageCodeReferenceSchema
