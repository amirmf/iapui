import { z } from 'zod'

import { createPageResponseSchema } from '../common'

export const dashboardFiltersSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.array(z.string()), z.undefined()])
)

const claimRequestStatusSchema = z.enum([
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

export const docTypeSchema = z
  .object({
    id: z.string().nullish(),
    docType: z.string().nullish(),
    docTypeCode: z.string().nullish(),
    prompt: z.string().nullish(),
    documentGuide: z.string().nullish(),
    dataJsonSchema: z.string().nullish(),
    dataSubmissionExample: z.string().nullish(),
    agreementCode: z.string().nullish(),
    minThreshold: z.number().nullish(),
    maxThreshold: z.number().nullish(),
    maxThresholdItem: z.number().nullish(),
    maxThresholdCountItem: z.number().nullish(),
    sequence: z.number().int().nullish(),
    deleteDate: z.string().nullish(),
    createdAt: z.string().nullish(),
    updatedAt: z.string().nullish(),
    ceilingControlDamageCode: z.string().nullish(),
    ceilingControlErrorDescription: z.string().nullish(),
    noCoverageErrorDescription: z.string().nullish(),
  })
  .loose()

export const pageDocTypeSchema = createPageResponseSchema(docTypeSchema)

const isoDateTimeRegex =
  /^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?)(?:Z|[+-](?:[01]\d|2[0-3])(?::?[0-5]\d))?$/
const agreementStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'DRAFT',
  'EXPIRED',
  'TERMINATED',
])

export const agreementWithoutMainAssessmentUserSchema = z
  .object({
    id: z.uuid().nullish(),
    createdAt: z.string().regex(isoDateTimeRegex).nullish(),
    updatedAt: z.string().regex(isoDateTimeRegex).nullish(),
    createdBy: z.string().nullish(),
    updatedBy: z.string().nullish(),
    title: z.string().nullish(),
    code: z.string().nullish(),
    extPolicyId: z.number().int().nullish(),
    extContractId: z.number().int().nullish(),
    extPlanId: z.number().int().nullish(),
    extLocation: z.string().nullish(),
    extLocationCityId: z.number().int().nullish(),
    extLocationCityName: z.string().nullish(),
    extLocationProvinceId: z.number().int().nullish(),
    extLocationProvinceName: z.string().nullish(),
    extLocationName: z.string().nullish(),
    status: agreementStatusSchema.nullish(),
    fromDate: z.string().regex(isoDateTimeRegex).nullish(),
    thruDate: z.string().regex(isoDateTimeRegex).nullish(),
    overrideRatio: z.number().nullish(),
    templateCode: z.string().nullish(),
  })
  .loose()

export const assigneeStatusSumReportSchema = z.object({
  status: claimRequestStatusSchema.nullish(),
  assignedUserUsername: z.string().nullish(),
  assignedUserDisplayName: z.string().nullish(),
  amount: z.coerce.number().optional(),
  totalSumAmount: z.coerce.number().optional(),
})
export const statusDocTypeCountReportSchema = z.object({
  status: claimRequestStatusSchema.nullish(),
  docType: docTypeSchema.nullish(),
  count: z.coerce.number().optional(),
})
export const assigneeStatusCountReportSchema = z.object({
  status: claimRequestStatusSchema.nullish(),
  assignedUserUsername: z.string().nullish(),
  assignedUserDisplayName: z.string().nullish(),
  count: z.coerce.number().optional(),
})
export const reportDistributionByStatusRequestSchema = z
  .object({ filters: dashboardFiltersSchema })
  .strict()
export const dashboardReportRequestSchema =
  reportDistributionByStatusRequestSchema
export const agreementsWithoutMainAssessmentUserRequestSchema = z
  .object({})
  .strict()
export const pageDocTypeRequestSchema = z
  .object({
    page: z.coerce.number().int().min(0),
    size: z.coerce.number().int().positive(),
  })
  .strict()
export const statusDistributionReportSchema = z.object({
  status: z.string().nullish(),
  count: z.coerce.number().optional(),
  amount: z.coerce.number().optional(),
  totalSumAmount: z.coerce.number().optional(),
})
export const assigneeStatusSumReportListSchema = z.array(
  assigneeStatusSumReportSchema
)
export const statusDocTypeCountReportListSchema = z.array(
  statusDocTypeCountReportSchema
)
export const assigneeStatusCountReportListSchema = z.array(
  assigneeStatusCountReportSchema
)
export const statusDistributionReportListSchema = z.array(
  statusDistributionReportSchema
)
export const agreementsWithoutMainAssessmentUserResponseSchema = z.array(
  agreementWithoutMainAssessmentUserSchema
)

export type DashboardFilters = z.infer<typeof dashboardFiltersSchema>
export type AssigneeStatusSumReport = z.infer<
  typeof assigneeStatusSumReportSchema
>
export type StatusDocTypeCountReport = z.infer<
  typeof statusDocTypeCountReportSchema
>
export type AssigneeStatusCountReport = z.infer<
  typeof assigneeStatusCountReportSchema
>
export type ReportDistributionByStatusRequest = z.infer<
  typeof reportDistributionByStatusRequestSchema
>
export type DashboardReportRequest = z.infer<
  typeof dashboardReportRequestSchema
>
export type AgreementsWithoutMainAssessmentUserRequest = z.infer<
  typeof agreementsWithoutMainAssessmentUserRequestSchema
>
export type AgreementsWithoutMainAssessmentUserResponse = z.infer<
  typeof agreementsWithoutMainAssessmentUserResponseSchema
>
export type StatusDistributionReport = z.infer<
  typeof statusDistributionReportSchema
>
export type AgreementWithoutMainAssessmentUser = z.infer<
  typeof agreementWithoutMainAssessmentUserSchema
>
export type DocType = z.infer<typeof docTypeSchema>
export type PageDocType = z.infer<typeof pageDocTypeSchema>
export type PageDocTypeRequest = z.infer<typeof pageDocTypeRequestSchema>
