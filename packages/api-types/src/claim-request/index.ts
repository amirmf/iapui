import { z } from 'zod'

import { createPageRequestSchema, createPageResponseSchema } from '../common'
import { docTypeSchema } from '../doc-type'

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
export const claimRequestYesNoSchema = z.enum(['Y', 'N'])
export const claimRequestRequestTypeSchema = z.enum(['MAIN', 'ADJUSTMENT'])
export const claimRequestDuplicateTypeSchema = z.enum([
  'IMAGE',
  'INFORMATION',
  'INFORMATION_EXTERNAL_CORE',
  'INFORMATION_EXTERNAL_FANHUB',
])

export const claimRequestDocumentSchema = z
  .object({
    dataJsonSchema: z.unknown().nullish(),
    docTypeCode: z.string().nullish(),
    documentType: z.string().nullish(),
    extractedData: z.unknown().nullish(),
    extractionDate: z.string().nullish(),
    extractionModel: z.string().nullish(),
    id: z.string().nullish(),
  })
  .loose()

const claimRequestDocTypeSchema = docTypeSchema.pick({
  docType: true,
  id: true,
})

const claimRequestAssignmentSchema = z
  .object({
    assignedAt: z.string().nullish(),
    assignedByDisplayName: z.string().nullish(),
    assignedByUserId: z.string().nullish(),
    assignedByUsername: z.string().nullish(),
    assignedEndAt: z.string().nullish(),
    assignedUserDisplayName: z.string().nullish(),
    assignedUserId: z.string().nullish(),
    assignedUserUsername: z.string().nullish(),
    description: z.string().nullish(),
    role: z.string().nullish(),
  })
  .loose()

const claimRequestStatusHistorySchema = z
  .object({
    endTimestamp: z.string().nullish(),
    notes: z.string().nullish(),
    status: claimRequestStatusSchema.nullish(),
    timestamp: z.string().nullish(),
    userId: z.string().nullish(),
    userIdDisplayName: z.string().nullish(),
    userIdUsername: z.string().nullish(),
  })
  .loose()

const claimRequestExternalDoctorSchema = z
  .object({
    city: z.string().nullish(),
    doctorCode: z.string().nullish(),
    doctorFamilyName: z.string().nullish(),
    doctorName: z.string().nullish(),
    major: z.string().nullish(),
    membership: z.string().nullish(),
  })
  .loose()

const claimRequestObjectionSchema = z
  .object({
    createdAt: z.string().nullish(),
    createdBy: z.string().nullish(),
    createdByDisplayName: z.string().nullish(),
    createdByUsername: z.string().nullish(),
    description: z.string().nullish(),
    registerAgentId: z.string().nullish(),
    roleType: z.enum(['ENDUSER', 'EXPERT', 'AI']).nullish(),
  })
  .loose()

const claimRequestAiAssessmentResultSchema = z
  .object({
    aiAssessmentRuleId: z.string().nullish(),
    amountValue: z.number().nullish(),
    approvedAt: z.string().nullish(),
    approveByName: z.string().nullish(),
    approveByUsername: z.string().nullish(),
    assessmentItemId: z.string().nullish(),
    assessmentRuleDetailId: z.string().nullish(),
    assessType: z
      .enum([
        'DUPLICATION',
        'CORE_MISMATCH',
        'NO_CEILING',
        'NO_COVERAGE',
        'IMAGE_DIGITALLY_EDITED',
        'NAME_MISMATCH',
        'DATE_MISMATCH',
        'DOCTOR_MISMATCH',
        'MEDICAL_CENTER_MISMATCH',
        'DOCS_MISMATCH',
        'INFORMATION_MISMATCH',
        'UNUSUAL_REQUEST_AMOUNT',
        'CALCULATION',
        'UNUSUAL_APPROVE_AMOUNT',
        'APPROVE',
        'EXPERT_UNUSUAL_CALCULATION',
        'EXPERT_UNUSUAL_CALCULATION_EXCEED_TARIFF',
        'NEED_SECOND_APPROVE',
      ])
      .nullish(),
    confidenceScore: z.number().nullish(),
    createdAt: z.string().nullish(),
    createdBy: z.string().nullish(),
    description: z.string().nullish(),
    id: z.string().nullish(),
    quantityValue: z.number().nullish(),
    repetitiveResponseCode: z.string().nullish(),
    repetitiveResponseDescription: z.string().nullish(),
    repetitiveResponseGroupCode: z.string().nullish(),
    resolutionType: z.enum(['NONE', 'RETURN', 'REJECT', 'APPROVE']).nullish(),
    title: z.string().nullish(),
  })
  .loose()

const claimRequestDuplicateSchema = z
  .object({
    approvedAt: z.string().nullish(),
    approvedBy: z.string().nullish(),
    businessKey: z.number().nullish(),
    claimRequestId: z.string().nullish(),
    description: z.string().nullish(),
    duplicateConfidence: z.number().nullish(),
    duplicateScore: z.number().nullish(),
    duplicateTotalCount: z.number().int().nullish(),
    duplicatesDetail: z
      .array(
        z.object({
          amount: z.number().nullish(),
          damageCodeCode: z.string().nullish(),
          damageCodeId: z.string().nullish(),
          description: z.string().nullish(),
          duplicateConfidence: z.number().nullish(),
          duplicateScore: z.number().nullish(),
          sourceAttachmentId: z.string().nullish(),
          sourceMinioObjectName: z.string().nullish(),
          targetAttachmentId: z.string().nullish(),
          targetMinioObjectName: z.string().nullish(),
        })
      )
      .nullish(),
    extClaimId: z.string().nullish(),
    extDmgCaseId: z.string().nullish(),
    extIllnessDesc: z.string().nullish(),
    extIllnessId: z.string().nullish(),
    extPreAuthzId: z.string().nullish(),
    id: z.string().nullish(),
    sourceTotalCount: z.number().int().nullish(),
    targetTotalCount: z.number().int().nullish(),
    type: claimRequestDuplicateTypeSchema.nullish(),
    validatorType: z.enum(['GENERAL']).nullish(),
  })
  .loose()

const claimRequestSubInsuredPersonSchema = z.object({
  age: z.number().nullish(),
  birthday: z.string().nullish(),
  dependantId: z.string().nullish(),
  dependantTitle: z.string().nullish(),
  genderId: z.string().nullish(),
  genderTitle: z.string().nullish(),
  id: z.number().nullish(),
  lastName: z.string().nullish(),
  maritalStatusId: z.string().nullish(),
  maritalStatusTitle: z.string().nullish(),
  name: z.string().nullish(),
  nationalCode: z.string().nullish(),
  relationId: z.string().nullish(),
  relationTitle: z.string().nullish(),
})

export const claimRequestSchema = z
  .object({
    aiAssessmentResults: z
      .array(claimRequestAiAssessmentResultSchema)
      .nullish(),
    aiStatus: claimRequestAiStatusSchema.nullish(),
    amount: z.number().nullish(),
    assignedAt: z.string().nullish(),
    assignedUserDisplayName: z.string().nullish(),
    assignedUserId: z.string().nullish(),
    assignedUserUsername: z.string().nullish(),
    assignmentHistory: z.array(claimRequestAssignmentSchema).nullish(),
    assessedAt: z.string().nullish(),
    attachments: z.array(z.object({}).loose()).nullish(),
    baseClaimRequestId: z.string().nullish(),
    businessKey: z.number().nullish(),
    corePaidAmount: z.number().nullish(),
    corePaidAmountPercent: z.number().nullish(),
    createdAt: z.string().nullish(),
    createdBy: z.string().nullish(),
    description: z.string().nullish(),
    documents: z.array(claimRequestDocumentSchema).nullish(),
    docType: claimRequestDocTypeSchema.nullish(),
    duplicates: z.array(claimRequestDuplicateSchema).nullish(),
    extContractId: z.number().nullish(),
    extCINumber: z.string().nullish(),
    extCustomerCityId: z.number().nullish(),
    extCustomerCityName: z.string().nullish(),
    extCustomerCompanyCode: z.string().nullish(),
    extCustomerId: z.number().nullish(),
    extCustomerName: z.string().nullish(),
    extCustomerNationalCode: z.string().nullish(),
    extDependantId: z.string().nullish(),
    extDependantTitle: z.string().nullish(),
    extDisplayName: z.string().nullish(),
    extAge: z.number().nullish(),
    extBirthday: z.string().nullish(),
    extGenderId: z.string().nullish(),
    extGenderTitle: z.string().nullish(),
    extHealthPolicyInsuredPersonId: z.number().nullish(),
    extInsuredPersonId: z.number().nullish(),
    extMainDisplayName: z.string().nullish(),
    extMainAge: z.string().nullish(),
    extMainBirthday: z.string().nullish(),
    extMainNationalCode: z.string().nullish(),
    extMaritalStatusId: z.string().nullish(),
    extMaritalStatusTitle: z.string().nullish(),
    extMobileNumber: z.string().nullish(),
    extNationalCode: z.string().nullish(),
    extPaymentDate: z.string().nullish(),
    extPlanId: z.number().nullish(),
    extPlanCaption: z.string().nullish(),
    extPolicyId: z.number().nullish(),
    extPolicyFullNo: z.string().nullish(),
    extRelationId: z.string().nullish(),
    extRelationTitle: z.string().nullish(),
    extSettlementDate: z.string().nullish(),
    extWorkUnitCityId: z.number().nullish(),
    extWorkUnitCityName: z.string().nullish(),
    extWorkUnitCode: z.number().nullish(),
    extWorkUnitName: z.string().nullish(),
    extWorkUnitProvinceId: z.number().nullish(),
    extWorkUnitProvinceName: z.string().nullish(),
    errorDescription: z.string().nullish(),
    expert_info_addon: z.record(z.string(), z.unknown()).nullish(),
    externalDoctor: claimRequestExternalDoctorSchema.nullish(),
    extractedDoctorSpeciality: z.string().nullish(),
    freeOcrText: z.string().nullish(),
    ibanStatus: z.string().nullish(),
    id: z.string().nullish(),
    isAssessed: claimRequestYesNoSchema.nullish(),
    isCheat: claimRequestYesNoSchema.nullish(),
    isForeign: claimRequestYesNoSchema.nullish(),
    isReturn: claimRequestIbanStatusSchema.nullish(),
    latestAssignementDisplayName: z.string().nullish(),
    latestAssignementUsername: z.string().nullish(),
    mainAssignedUserDisplayName: z.string().nullish(),
    mainAssignedUserUsername: z.string().nullish(),
    registeredByAgentDisplayName: z.string().nullish(),
    registeredByAgentUserId: z.string().nullish(),
    registeredByAgentUsername: z.string().nullish(),
    outpatientDocAcceptanceExtId: z.number().nullish(),
    outpatientDocAcceptanceId: z.string().nullish(),
    objections: z.array(claimRequestObjectionSchema).nullish(),
    requestType: z.enum(['MAIN', 'ADJUSTMENT']).nullish(),
    resultReasons: z.array(z.string()).nullish(),
    seenAt: z.string().nullish(),
    seenBy: z.string().nullish(),
    status: claimRequestStatusSchema.nullish(),
    statusHistory: z.array(claimRequestStatusHistorySchema).nullish(),
    subInsuredPeople: z.array(claimRequestSubInsuredPersonSchema).nullish(),
    specialDiseases: z.array(z.object({}).loose()).nullish(),
    submitDate: z.string().nullish(),
    totalSumAmount: z.number().nullish(),
    totalSumEstimatedAmount: z.number().nullish(),
    totalFranAmount: z.number().nullish(),
    updatedAt: z.string().nullish(),
    updatedBy: z.string().nullish(),
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
    description: z.string().optional(),
    isCheat: claimRequestIbanStatusSchema.optional(),
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
    description: z.string().optional(),
  })
  .strict()

export const updateClaimRequestDocTypeRequestSchema = z
  .object({
    claimRequestId: claimRequestIdSchema,
    newDocType: z.string().trim().min(1),
  })
  .strict()

export const updateClaimRequestDocumentsRequestSchema = z
  .object({
    body: z.object({ documents: z.array(claimRequestDocumentSchema) }).strict(),
    path: z.object({ id: claimRequestIdSchema }).strict(),
  })
  .strict()

export type ClaimRequest = z.infer<typeof claimRequestSchema>
export type ClaimRequestAiStatus = z.infer<typeof claimRequestAiStatusSchema>
export type ClaimRequestStatus = z.infer<typeof claimRequestStatusSchema>
export type ClaimRequestYesNo = z.infer<typeof claimRequestYesNoSchema>
export type ClaimRequestRequestType = z.infer<
  typeof claimRequestRequestTypeSchema
>
export type ClaimRequestDuplicateType = z.infer<
  typeof claimRequestDuplicateTypeSchema
>
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
export type UpdateClaimRequestDocumentsRequest = z.input<
  typeof updateClaimRequestDocumentsRequestSchema
>
