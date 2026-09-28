import { z } from 'zod'

import { createPageRequestSchema, createPageResponseSchema } from '../common'

export const claimRequestStatusSchema = z.enum([
  'SUBMITTED',
  'IN_REVIEW',
  'IN_ASSESSMENT',
  'DELEGATED',
  'DEDICATED_TO_USER',
  'RETURN',
  'REJECTED',
  'APPROVED',
  'SENT',
  'SENT_FAILED',
  'FAILED_FETCH_API',
  'TERMINATED',
  'PAID',
  'PAYMENT_REJECTED',
  'PAYMENT_RETURN',
  'PAYMENT_RETURN_RESEND',
  'DELETED',
])

export const claimRequestAiStatusSchema = z.enum([
  'APPROVED',
  'RETURN',
  'REVIEW_REQUIRED',
  'REVIEW_REQUIRED_SUBMIT_INFO_DUPLICATED',
  'REVIEW_REQUIRED_IMAGE_DUPLICATED',
  'REVIEW_REQUIRED_IMAGE_DIGITALLY_EDITED',
  'RETURN_NO_COVERAGE',
  'RETURN_MAX_CEILING',
  'REJECT',
])

export const claimRequestIbanStatusSchema = z.enum(['Y', 'N'])

const claimRequestDocumentSchema = z
  .object({
    documentType: z.string().nullish(),
  })
  .loose()

const claimRequestDocTypeSchema = z
  .object({
    docType: z.string().nullish(),
    id: z.string().nullish(),
  })
  .loose()

export const claimRequestSchema = z
  .object({
    aiStatus: claimRequestAiStatusSchema.nullish(),
    amount: z.number().nullish(),
    assignedUserUsername: z.string().nullish(),
    assessedAt: z.string().nullish(),
    baseClaimRequestId: z.string().nullish(),
    businessKey: z.number().nullish(),
    corePaidAmount: z.number().nullish(),
    corePaidAmountPercent: z.number().nullish(),
    createdAt: z.string().nullish(),
    documents: z.array(claimRequestDocumentSchema).nullish(),
    docType: claimRequestDocTypeSchema.nullish(),
    extContractId: z.number().nullish(),
    extCustomerName: z.string().nullish(),
    extDisplayName: z.string().nullish(),
    extMainNationalCode: z.string().nullish(),
    extNationalCode: z.string().nullish(),
    extPaymentDate: z.string().nullish(),
    extPlanCaption: z.string().nullish(),
    extPolicyId: z.number().nullish(),
    extWorkUnitName: z.string().nullish(),
    ibanStatus: z.string().nullish(),
    id: z.string().nullish(),
    isReturn: claimRequestIbanStatusSchema.nullish(),
    latestAssignementDisplayName: z.string().nullish(),
    requestType: z.enum(['MAIN', 'ADJUSTMENT']).nullish(),
    status: claimRequestStatusSchema.nullish(),
    submitDate: z.string().nullish(),
    totalSumAmount: z.number().nullish(),
  })
  .loose()

export const pageClaimRequestSchema =
  createPageResponseSchema(claimRequestSchema)

export const pageClaimRequestRequestSchema = createPageRequestSchema()

export const claimRequestIdsSchema = z.array(z.string().trim().min(1)).min(1)
export const claimRequestIdSchema = z.string().trim().min(1)

export const assignNewClaimRequestsRequestSchema = z
  .object({
    extContractId: z.string().trim().min(1).optional(),
    extPolicyId: z.string().trim().min(1).optional(),
  })
  .strict()

export const claimRequestBulkStatusChangeRequestSchema = z
  .object({
    claimRequestId: claimRequestIdsSchema,
    claimRequestStatus: claimRequestStatusSchema,
    description: z.string().trim().optional(),
    isCheat: claimRequestIbanStatusSchema.default('N'),
  })
  .strict()

export const coreAiDataExtractionRequestSchema = z
  .object({
    claimRequestId: z.string().trim().min(1),
    initiatedBy: z.string().trim().min(1),
    workflowId: z.string().trim().min(1),
  })
  .strict()

export const coreAiDataExtractionResponseSchema = z
  .object({
    claimRequestId: z.string().nullish(),
    status: z.string().nullish(),
    workflowId: z.string().nullish(),
  })
  .loose()

export const assignClaimRequestToMeStatusRequestSchema = z
  .object({
    claimRequestStatus: claimRequestStatusSchema.optional(),
    description: z.string().trim().optional(),
  })
  .strict()

export const updateClaimRequestDocTypeRequestSchema = z
  .object({
    claimRequestId: claimRequestIdSchema,
    newDocType: z.string().trim().min(1),
  })
  .strict()

export type ClaimRequest = z.infer<typeof claimRequestSchema>
export type ClaimRequestAiStatus = z.infer<typeof claimRequestAiStatusSchema>
export type ClaimRequestStatus = z.infer<typeof claimRequestStatusSchema>
export type ClaimRequestYesNo = z.infer<typeof claimRequestIbanStatusSchema>
export type PageClaimRequest = z.infer<typeof pageClaimRequestSchema>
export type PageClaimRequestRequest = z.input<
  typeof pageClaimRequestRequestSchema
>
export type ClaimRequestBulkStatusChangeRequest = z.input<
  typeof claimRequestBulkStatusChangeRequestSchema
>
export type CoreAiDataExtractionRequest = z.input<
  typeof coreAiDataExtractionRequestSchema
>
export type CoreAiDataExtractionResponse = z.infer<
  typeof coreAiDataExtractionResponseSchema
>
export type AssignClaimRequestToMeStatusRequest = z.input<
  typeof assignClaimRequestToMeStatusRequestSchema
>
export type UpdateClaimRequestDocTypeRequest = z.input<
  typeof updateClaimRequestDocTypeRequestSchema
>
