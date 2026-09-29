import { z } from 'zod'

export const assessmentItemStatusSchema = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'FAILED_FETCH_API',
])

export const assessmentItemDamageCodeSchema = z
  .object({
    code: z.string().nullable().optional(),
    coverageDetailExtCode: z.string().nullable().optional(),
    coverageDetailExtId: z.string().nullable().optional(),
    coverageDetailId: z.string().nullable().optional(),
    extCode: z.string().nullable().optional(),
    extId: z.string().nullable().optional(),
    id: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
  })
  .loose()

export const assessmentItemSchema = z
  .object({
    amount: z.number().nullable().optional(),
    amountItem: z.number().nullable().optional(),
    claimRequestId: z.string().nullable().optional(),
    corePaidAmount: z.number().nullable().optional(),
    corePaidAmountPercent: z.number().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    damageCode: assessmentItemDamageCodeSchema.nullable().optional(),
    description: z.string().nullable().optional(),
    estimatedAmount: z.number().nullable().optional(),
    franchizeDeductionAmount: z.number().nullable().optional(),
    franchizeDeductionAmountItem: z.number().nullable().optional(),
    id: z.string().optional(),
    maxPerCaseAmount: z.number().nullable().optional(),
    partyId: z.uuid().nullable().optional(),
    quantity: z.number().nullable().optional(),
    remainCoverageAmount: z.number().nullable().optional(),
    status: assessmentItemStatusSchema.nullable().optional(),
    toothNumber: z.number().int().nullable().optional(),
    toothNumbers: z.array(z.number().int()).nullable().optional(),
    updatedAt: z.string().nullable().optional(),
  })
  .loose()

export const assessmentItemListSchema = z.array(assessmentItemSchema)
export const findAssessmentItemsByClaimRequestRequestSchema = z.object({
  path: z.object({ claimRequestId: z.string().trim().min(1) }),
})

export type AssessmentItem = z.infer<typeof assessmentItemSchema>
export type FindAssessmentItemsByClaimRequestRequest = z.infer<
  typeof findAssessmentItemsByClaimRequestRequestSchema
>
