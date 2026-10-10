import { z } from 'zod'

import { createPageRequestSchema, createPageResponseSchema } from '../common'
import { docTypeSchema } from '../doc-type'
import { attachmentSchema } from '../files'
import { personSpecialDiseaseEnumSchema } from '../person-special-disease/enums'

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

const externalDoctorSchema = z
  .object({
    doctorName: z.string().nullish(),
    doctorFamilyName: z.string().nullish(),
    doctorCode: z.string().nullish(),
    major: z.string().nullish(),
    membership: z.string().nullish(),
    city: z.string().nullish(),
  })
  .loose()

const statusHistorySchema = z
  .object({
    status: claimRequestStatusSchema.nullish(),
    timestamp: z.string().nullish(),
    endTimestamp: z.string().nullish(),
    notes: z.string().nullish(),
    userId: z.string().nullish(),
    userIdDisplayName: z.string().nullish(),
    userIdUsername: z.string().nullish(),
  })
  .loose()

export type statusHistoryItemType = z.infer<typeof statusHistorySchema>

const assignmentHistorySchema = z
  .object({
    assignedUserId: z.string().nullish(),
    assignedUserUsername: z.string().nullish(),
    assignedUserDisplayName: z.string().nullish(),
    role: z.string().nullish(),
    assignedAt: z.string().nullish(),
    assignedEndAt: z.string().nullish(),
    assignedByUserId: z.string().nullish(),
    assignedByUsername: z.string().nullish(),
    assignedByDisplayName: z.string().nullish(),
    description: z.string().nullish(),
  })
  .loose()

const subInsuredPersonSchema = z.object({
  id: z.number().nullish(),
  nationalCode: z.string().nullish(),
  name: z.string().nullish(),
  lastName: z.string().nullish(),
  age: z.number().nullish(),
  birthday: z.string().nullish(),
  dependantId: z.string().nullish(),
  dependantTitle: z.string().nullish(),
  relationId: z.string().nullish(),
  relationTitle: z.string().nullish(),
  genderId: z.string().nullish(),
  genderTitle: z.string().nullish(),
  maritalStatusId: z.string().nullish(),
  maritalStatusTitle: z.string().nullish(),
})

export const subInsuredPersonResponseSchema = z
  .object({
    id: z.number().nullish(),
    nationalCode: z.string().nullish(),
    fullName: z.string().nullish(),
    isForeign: claimRequestYesNoSchema.nullish(),
  })
  .loose()

export const subInsuredPersonResponseListSchema = z.array(
  subInsuredPersonResponseSchema
)

export type SubInsuredPersonResponse = z.infer<
  typeof subInsuredPersonResponseSchema
>

export const claimDocumentSchema = z
  .object({
    id: z.string().nullish(),
    docTypeCode: z.string().nullish(),
    documentType: z.string().nullish(),
    dataJsonSchema: z.string().nullish(),
    extractedData: z.record(z.string(), z.unknown()).nullish(),
    extractionDate: z.string().nullish(),
    extractionModel: z.string().nullish(),
  })
  .loose()

export const claimRequestObjectionRoleTypeSchema = z.enum([
  'ENDUSER',
  'EXPERT',
  'AI',
])

export type ClaimRequestObjectionRoleType = z.infer<
  typeof claimRequestObjectionRoleTypeSchema
>

const claimRequestObjectionSchema = z
  .object({
    description: z.string().nullish(),
    createdAt: z.string().nullish(),
    createdBy: z.string().nullish(),
    createdByDisplayName: z.string().nullish(),
    createdByUsername: z.string().nullish(),
    registerAgentId: z.string().nullish(),
    roleType: claimRequestObjectionRoleTypeSchema.nullish(),
  })
  .loose()

export const aiAssessmentResultResolutionTypeSchema = z.enum([
  'NONE',
  'RETURN',
  'REJECT',
  'APPROVE',
])

export type AiAssessmentResultResolutionType = z.infer<
  typeof aiAssessmentResultResolutionTypeSchema
>

export const aiAssessmentResultAssessTypeSchema = z.enum([
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

export type AiAssessmentResultAssessType = z.infer<
  typeof aiAssessmentResultAssessTypeSchema
>

export const duplicateValidatorTypeSchema = z.enum(['GENERAL'])

export type DuplicateValidatorType = z.infer<
  typeof duplicateValidatorTypeSchema
>

const duplicateDetailSchema = z.object({
  sourceAttachmentId: z.string().nullish(),
  sourceMinioObjectName: z.string().nullish(),
  targetAttachmentId: z.string().nullish(),
  targetMinioObjectName: z.string().nullish(),
  duplicateScore: z.number().nullish(),
  duplicateConfidence: z.number().nullish(),
  damageCodeCode: z.string().nullish(),
  damageCodeId: z.string().nullish(),
  amount: z.number().nullish(),
  description: z.string().nullish(),
})

export type duplicateDetail = z.infer<typeof duplicateDetailSchema>

export const aiAssessmentResultResponseSchema = z.object({
  id: z.string().nullish(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  repetitiveResponseDescription: z.string().nullish(),
  repetitiveResponseCode: z.string().nullish(),
  repetitiveResponseGroupCode: z.string().nullish(),
  resolutionType: aiAssessmentResultResolutionTypeSchema.nullish(),
  aiAssessmentRuleId: z.string().nullish(),
  assessmentRuleDetailId: z.string().nullish(),
  assessmentItemId: z.string().nullish(),
  assessType: aiAssessmentResultAssessTypeSchema.nullish(),
  amountValue: z.number().nullish(),
  quantityValue: z.number().nullish(),
  confidenceScore: z.number().nullish(),
  createdAt: z.string().nullish(),
  createdBy: z.string().nullish(),
  approvedAt: z.string().nullish(),
  approveByUsername: z.string().nullish(),
  approveByName: z.string().nullish(),
})

export type AiAssessmentResult = z.infer<
  typeof aiAssessmentResultResponseSchema
>

const duplicatesSchema = z.object({
  id: z.string().nullish(),
  claimRequestId: z.string().nullish(),
  businessKey: z.number().nullish(),
  type: claimRequestDuplicateTypeSchema.nullish(),
  validatorType: duplicateValidatorTypeSchema.nullish(),
  extClaimId: z.string().nullish(),
  extDmgCaseId: z.string().nullish(),
  extIllnessId: z.string().nullish(),
  extPreAuthzId: z.string().nullish(),
  extIllnessDesc: z.string().nullish(),
  description: z.string().nullish(),
  duplicateScore: z.number().nullish(),
  duplicateConfidence: z.number().nullish(),
  sourceTotalCount: z.number().int().nullish(),
  targetTotalCount: z.number().int().nullish(),
  duplicateTotalCount: z.number().int().nullish(),
  duplicatesDetail: z.array(duplicateDetailSchema).nullish(),
  approvedAt: z.string().nullish(),
  approvedBy: z.string().nullish(),
})

export type ClaimRequestObjection = z.infer<typeof claimRequestObjectionSchema>

export const ClaimRequestBaseSchema = z.object({
  id: z.string().nullish(),
  submitDate: z.string().nullish(),
  externalDoctor: externalDoctorSchema.nullish(),
  extPolicyId: z.number().nullish(),
  extPolicyFullNo: z.string().nullish(),
  extCINumber: z.string().nullish(),
  extContractId: z.number().nullish(),
  extPlanId: z.number().nullish(),
  extPlanCaption: z.string().nullish(),
  extHealthPolicyInsuredPersonId: z.number().nullish(),
  extCustomerId: z.number().nullish(),
  extInsuredPersonId: z.number().nullish(),
  extCustomerName: z.string().nullish(),
  extCustomerCompanyCode: z.string().nullish(),
  extCustomerNationalCode: z.string().nullish(),
  extCustomerCityId: z.number().nullish(),
  extCustomerCityName: z.string().nullish(),
  extNationalCode: z.string().nullish(),
  extDisplayName: z.string().nullish(),
  extMobileNumber: z.string().nullish(),
  extAge: z.number().nullish(),
  extBirthday: z.string().nullish(),
  extDependantId: z.string().nullish(),
  extDependantTitle: z.string().nullish(),
  extRelationId: z.string().nullish(),
  extRelationTitle: z.string().nullish(),
  extGenderId: z.string().nullish(),
  extGenderTitle: z.string().nullish(),
  extMaritalStatusId: z.string().nullish(),
  extMaritalStatusTitle: z.string().nullish(),
  extMainDisplayName: z.string().nullish(),
  extMainNationalCode: z.string().nullish(),
  extMainAge: z.string().nullish(),
  extMainBirthday: z.string().nullish(),
  extWorkUnitName: z.string().nullish(),
  extWorkUnitCode: z.number().nullish(),
  extWorkUnitCityId: z.number().nullish(),
  extWorkUnitProvinceId: z.number().nullish(),
  extWorkUnitCityName: z.string().nullish(),
  extWorkUnitProvinceName: z.string().nullish(),
  amount: z.number().nullish(),
  corePaidAmount: z.number().nullish(),
  corePaidAmountPercent: z.number().nullish(),
  description: z.string().nullish(),
  businessKey: z.number().nullish(),
  docType: docTypeSchema.nullish(),
  errorDescription: z.string().nullish(),
  extPaymentDate: z.string().nullish(),
  extSettlementDate: z.string().nullish(),
  extractedDoctorSpeciality: z.string().nullish(),
  status: claimRequestStatusSchema.nullish(),
  mainAssignedUserUsername: z.string().nullish(),
  mainAssignedUserDisplayName: z.string().nullish(),
  aiStatus: claimRequestAiStatusSchema.nullish(),
  resultReasons: z.array(z.string()).nullish(),
  aiAssessmentResults: z.array(aiAssessmentResultResponseSchema).nullish(),
  objections: z.array(claimRequestObjectionSchema).nullish(),
  attachments: z.array(attachmentSchema).nullish(),
  documents: z.array(claimDocumentSchema).nullish(),
  duplicates: z.array(duplicatesSchema).nullish(),
  subInsuredPeople: z.array(subInsuredPersonSchema).nullish(),
  specialDiseases: z.array(personSpecialDiseaseEnumSchema).nullish(),
  statusHistory: z.array(statusHistorySchema).nullish(),
  assignedAt: z.string().nullish(),
  assignedUserId: z.string().nullish(),
  assignedUserDisplayName: z.string().nullish(),
  assignedUserUsername: z.string().nullish(),
  assignmentHistory: z.array(assignmentHistorySchema).nullish(),
  latestAssignementUsername: z.string().nullish(),
  seenAt: z.string().nullish(),
  seenBy: z.string().nullish(),
  isAssessed: claimRequestYesNoSchema.nullish(),
  isReturn: claimRequestYesNoSchema.nullish(),
  isCheat: claimRequestYesNoSchema.nullish(),
  assessedAt: z.string().nullish(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
  createdBy: z.string().nullish(),
  latestAssignementDisplayName: z.string().nullish(),
  registeredByAgentUserId: z.string().nullish(),
  registeredByAgentUsername: z.string().nullish(),
  registeredByAgentDisplayName: z.string().nullish(),
  updatedBy: z.string().nullish(),
  freeOcrText: z.string().nullish(),
  expert_info_addon: z.record(z.string(), z.unknown()).nullish(),
  totalSumAmount: z.number().nullish(),
  totalSumEstimatedAmount: z.number().nullish(),
  totalFranAmount: z.number().nullish(),
  requestType: claimRequestRequestTypeSchema.nullish(),
  baseClaimRequestId: z.string().nullish(),
  isForeign: claimRequestYesNoSchema.nullish(),
  ibanStatus: z.string().nullish(),
  outpatientDocAcceptanceExtId: z.number().nullish(),
  outpatientDocAcceptanceId: z.string().nullish(),
})

export const claimRequestSchema = ClaimRequestBaseSchema
export const claimRequestDocumentSchema = claimDocumentSchema

export const pageClaimRequestSchema =
  createPageResponseSchema(claimRequestSchema)

export const pageClaimRequestRequestSchema = createPageRequestSchema()

export const claimRequestIdsSchema = z.array(z.string())
export const claimRequestIdSchema = z.string()

export const assignNewClaimRequestsRequestSchema = z
  .object({
    extContractId: z.string().trim().min(1).optional(),
    extPolicyId: z.string().trim().min(1).optional(),
  })
  .strict()

export const claimRequestBulkStatusChangeRequestSchema = z
  .object({
    claimRequestId: claimRequestIdsSchema,
    description: z.string().optional(),
    claimRequestStatus: claimRequestStatusSchema,
    isCheat: claimRequestIbanStatusSchema.optional(),
  })
  .strict()

export const coreAiWorkflowIdSchema = z
  .string()
  .trim()
  .min(1, 'Workflow ID is required')
export const coreAiDataExtractionRequestSchema = z
  .object({
    claimRequestId: z.string().min(1, 'Claim request ID is required'),
    workflowId: coreAiWorkflowIdSchema,
    initiatedBy: z.string().min(1, 'Initiator is required'),
  })
  .strict()
export const coreAiDataExtractionResponseSchema = z
  .object({
    claimRequestId: z.string().nullish(),
    workflowId: z.string().nullish(),
    status: z.string().nullish(),
  })
  .loose()
export const claimRequestListSchema = z.array(claimRequestSchema)
export const coreAiDataExtractionBulkRequestSchema = z.array(
  coreAiDataExtractionRequestSchema
)
export const coreAiDataExtractionBulkResponseSchema = z.array(
  coreAiDataExtractionResponseSchema
)
export const claimRequestVoidResponseSchema = z
  .unknown()
  .transform(() => undefined)
export const claimRequestExportExcelRequestSchema =
  createPageRequestSchema().pick({ filters: true })
export const claimRequestExportExcelResponseSchema = z.instanceof(Blob)

export const assignClaimRequestToMeStatusRequestSchema = z
  .object({
    description: z.string().optional(),
    claimRequestStatus: claimRequestStatusSchema.optional(),
  })
  .strict()

export const updateClaimRequestDocTypeRequestSchema = z
  .object({
    claimRequestId: claimRequestIdSchema,
    newDocType: z.string(),
  })
  .strict()

export const updateClaimRequestDocumentsRequestSchema = z
  .object({
    body: z.object({ documents: z.array(claimRequestDocumentSchema) }).strict(),
    path: z.object({ id: claimRequestIdSchema }).strict(),
  })
  .strict()

// Canonical reference contracts; existing consumers retain domain-qualified aliases.
export const claimRequestResponseSchema = claimRequestSchema
export const claimRequestRequestSchema = ClaimRequestBaseSchema.strict()
export const resolvedAttachmentSchema = attachmentSchema
export const addBulkObjectionRequestSchema =
  claimRequestBulkStatusChangeRequestSchema
export const assignNewClaimRequestsToMeRequestSchema =
  assignNewClaimRequestsRequestSchema
export type AddBulkObjectionRequest = z.infer<
  typeof addBulkObjectionRequestSchema
>
export type AssignNewClaimRequestsToMeRequest = z.infer<
  typeof assignNewClaimRequestsToMeRequestSchema
>
export type ClaimRequestRequest = z.infer<typeof claimRequestRequestSchema>
export type CoreAiWorkflowId = z.infer<typeof coreAiWorkflowIdSchema>

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

export * from './document-receipt'

export * from './my-claims'
