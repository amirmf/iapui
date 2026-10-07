import { z } from 'zod'

import {
  claimRequestAiStatusSchema,
  claimRequestSchema,
  claimRequestStatusSchema,
  claimRequestYesNoSchema,
} from '../claim-request'
import { createPageRequestSchema, createPageResponseSchema } from '../common'
import { docTypeSchema } from '../doc-type'

export const assignClaimRequestRequestSchema = z
  .object({
    assigneeId: z.string(),
    description: z.string().optional(),
    claimRequestStatus: claimRequestStatusSchema.optional(),
  })
  .strict()
export type AssignClaimRequestRequest = z.infer<
  typeof assignClaimRequestRequestSchema
>
export const addObjectionRequestSchema = z
  .object({
    claimRequestId: z.string(),
    description: z.string(),
    claimRequestStatus: claimRequestStatusSchema.optional(),
    isCheat: claimRequestYesNoSchema.optional(),
  })
  .strict()
export type AddObjectionRequest = z.infer<typeof addObjectionRequestSchema>
export const updateClaimManagementRequestSchema = claimRequestSchema
  .pick({ status: true, submitDate: true, amount: true })
  .strict()
export type UpdateClaimManagementRequest = z.infer<
  typeof updateClaimManagementRequestSchema
>
export const managementNoBodyRequestSchema = z.undefined()
export const inquiryFanavaranManagementRequestSchema = z
  .object({ claimRequestIds: z.array(z.string()) })
  .strict()
const documentSummarySchema = z
  .object({
    docTypeCode: z.string().nullish(),
    documentType: z.string().nullish(),
  })
  .loose()

const assessmentItemHistorySchema = z
  .object({
    amount: z.number().nullish(),
    damageCode: z.string().nullish(),
    damageCodeId: z.string().nullish(),
    damageCodeTitle: z.string().nullish(),
    damageCodeDescription: z.string().nullish(),
  })
  .loose()

export const claimRequestHistorySchema = z
  .object({
    id: z.string().nullish(),
    businessKey: z.number().nullish(),
    extNationalCode: z.string().nullish(),
    extDisplayName: z.string().nullish(),
    docType: docTypeSchema.nullish(),
    status: claimRequestStatusSchema.nullish(),
    aiStatus: claimRequestAiStatusSchema.nullish(),
    resultReasons: z.array(z.string()).nullish(),
    submitDate: z.string().nullish(),
    amount: z.number().nullish(),
    totalSumAmount: z.number().nullish(),
    totalSumEstimatedAmount: z.number().nullish(),
    createdAt: z.string().nullish(),
    updatedAt: z.string().nullish(),
    createdBy: z.string().nullish(),
    documents: z.array(documentSummarySchema).nullish(),
    assessmentItems: z.array(assessmentItemHistorySchema).nullish(),
    baseClaimRequestId: z.string().nullish(),
  })
  .loose()

export type ClaimRequestHistory = z.infer<typeof claimRequestHistorySchema>

export const pageClaimRequestHistorySchema = createPageResponseSchema(
  claimRequestHistorySchema
)
export type PageClaimRequestHistory = z.infer<
  typeof pageClaimRequestHistorySchema
>
export const claimRequestHistoryRequestSchema = createPageRequestSchema()
  .extend({ userId: z.string() })
  .strict()
export type ClaimRequestHistoryRequest = z.input<
  typeof claimRequestHistoryRequestSchema
>
