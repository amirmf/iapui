import { z } from 'zod'

import { createPageRequestSchema, createPageResponseSchema } from '../common'

export const outpatientDocAcceptanceStatusSchema = z.enum([
  'SUBMIT',
  'SENT_TO_SERVER',
  'REJECT',
  'FAILED',
  'DELETED',
  'SUCCESS',
])
export const outpatientDocAcceptanceWsStatusSchema = z.enum([
  'FAILD',
  'PROGRESS',
  'DONE',
])

export const dmgCaseSchema = z
  .object({
    id: z.string().nullish(),
    insuredPersonId: z.number().nullish(),
    serviceDate: z.string().nullish(),
    medicalSystemCode: z.number().nullish(),
    illnessId: z.number().nullish(),
    serviceDetailId: z.number().nullish(),
    serviceProvinceId: z.number().nullish(),
    tariffKindId: z.number().nullish(),
    doctorSpecialityId: z.number().nullish(),
    isFranchiseDeduction: z.boolean().nullish(),
    excessFranchiseAmount: z.number().nullish(),
    deductionKindId: z.number().nullish(),
    deductionAmount: z.number().nullish(),
    firstInsurerShareAmount: z.number().nullish(),
    expertiseFranchisePercent: z.number().nullish(),
    otherOrganizationsShareAmount: z.number().nullish(),
    toothId: z.number().nullish(),
    insuredIsAdult: z.boolean().nullish(),
    medicalCenterId: z.number().nullish(),
    drugCount: z.number().nullish(),
    deliveredDocTypeId: z.number().nullish(),
    preAuthId: z.number().nullish(),
    medicalBookLetSerialNo: z.number().nullish(),
    medicalBookletPageNo: z.number().nullish(),
    cardSerial: z.string().nullish(),
    deductionDesc: z.string().nullish(),
    discountAmount: z.number().nullish(),
    excessOfTheInsurersCommitmentAmount: z.number().nullish(),
    outOfTheInsurersCommitmentAmount: z.number().nullish(),
    thePatientLedFranchise: z.number().nullish(),
    otherRecoverableAmount: z.number().nullish(),
    requestedAmount: z.number().nullish(),
    approvedAmount: z.number().nullish(),
    drugClaimId: z.number().nullish(),
    systemCalculated: z.boolean().nullish(),
    dataSenderId: z.number().nullish(),
    claimId: z.number().nullish(),
    draftId: z.number().nullish(),
    firstInsurerId: z.number().nullish(),
    franchise: z.number().nullish(),
    exId: z.number().nullish(),
    nonPaymentReason: z.string().nullish(),
    totalAmount: z.number().nullish(),
    isCalculated: z.boolean().nullish(),
    status: outpatientDocAcceptanceStatusSchema.nullish(),
    claimRequestId: z.string().nullish(),
    assessmentItemId: z.string().nullish(),
    wsResult: z.string().nullish(),
    wsStatus: outpatientDocAcceptanceWsStatusSchema.nullish(),
  })
  .loose()

export const issuanceSchema = z
  .object({
    id: z.string().nullish(),
    draftKindId: z.number().nullish(),
    description: z.string().nullish(),
    certificationExpertId: z.number().nullish(),
    complementReasonId: z.number().nullish(),
    dataSenderId: z.number().nullish(),
    amount: z.number().nullish(),
    autoCalc: z.boolean().nullish(),
    claimId: z.number().nullish(),
    docAcceptanceId: z.number().nullish(),
    draftNo: z.string().nullish(),
    draftReasonId: z.number().nullish(),
    reasonId: z.number().nullish(),
    exId: z.number().nullish(),
    isComfort: z.boolean().nullish(),
    issuDate: z.string().nullish(),
    sourceId: z.number().nullish(),
    exStatus: z.number().nullish(),
    calcTime: z.string().nullish(),
    changeTime: z.string().nullish(),
    paymentPreparationTime: z.string().nullish(),
    calcJobStatus: z.number().nullish(),
    status: outpatientDocAcceptanceStatusSchema.nullish(),
    claimRequestId: z.string().nullish(),
    wsResult: z.string().nullish(),
    wsStatus: outpatientDocAcceptanceWsStatusSchema.nullish(),
    dmgCases: z.array(dmgCaseSchema).nullish(),
    afterInqueryResult: z.lazy((): z.ZodType => issuanceSchema).nullish(),
  })
  .loose()

export const outpatientClaimSchema = z
  .object({
    id: z.string().nullish(),
    acceptanceId: z.number().nullish(),
    announcementDate: z.string().nullish(),
    chargePlanId: z.number().nullish(),
    claimExpertId: z.number().nullish(),
    dataSenderId: z.number().nullish(),
    description: z.string().nullish(),
    dmgRegisterarId: z.number().nullish(),
    docDelivererAgentId: z.number().nullish(),
    docDeliveryKindId: z.number().nullish(),
    draftExpertId: z.number().nullish(),
    estimateAmount: z.number().nullish(),
    expertiseEndDate: z.string().nullish(),
    hasPreAuth: z.boolean().nullish(),
    hasReturnDocs: z.boolean().nullish(),
    exId: z.number().nullish(),
    claimNo: z.number().nullish(),
    insuredPersonId: z.number().nullish(),
    isMatchedWithList: z.boolean().nullish(),
    isPaymentFromCash: z.boolean().nullish(),
    letterNo: z.string().nullish(),
    medicalCenterId: z.number().nullish(),
    policyId: z.number().nullish(),
    statusChangeDate: z.string().nullish(),
    exStatus: z.number().nullish(),
    inqueryStatusId: z.number().nullish(),
    inqueryStatusTitle: z.string().nullish(),
    status: outpatientDocAcceptanceStatusSchema.nullish(),
    claimRequestId: z.string().nullish(),
    wsResult: z.string().nullish(),
    wsStatus: outpatientDocAcceptanceWsStatusSchema.nullish(),
    issuance: issuanceSchema.nullish(),
  })
  .loose()

export const outpatientDocAcceptanceSchema = z
  .object({
    id: z.string().nullish(),
    exId: z.number().nullish(),
    docDeliveryKindId: z.number().nullish(),
    deliveryDate: z.string().nullish(),
    acceptanceKindId: z.number().nullish(),
    claimCount: z.number().nullish(),
    dichargeMonth: z.number().nullish(),
    totalAmount: z.number().nullish(),
    policyId: z.number().nullish(),
    extLocationId: z.number().nullish(),
    insuredPersonId: z.number().nullish(),
    medicalCenterId: z.number().nullish(),
    letterDate: z.string().nullish(),
    letterNo: z.string().nullish(),
    secretariatNo: z.string().nullish(),
    secretariatDate: z.string().nullish(),
    paymentDate: z.string().nullish(),
    docDelivererAgentId: z.number().nullish(),
    dataSenderId: z.number().nullish(),
    claimExpertId: z.number().nullish(),
    opUnitId: z.number().nullish(),
    exStatus: z.number().nullish(),
    status: outpatientDocAcceptanceStatusSchema.nullish(),
    inqueryStatusId: z.number().nullish(),
    inqueryStatusTitle: z.string().nullish(),
    claimRequestId: z.string().nullish(),
    wsResult: z.string().nullish(),
    wsStatus: outpatientDocAcceptanceWsStatusSchema.nullish(),
    cancelWsResponseStatus: z.number().nullish(),
    cancelWsResponseBodyText: z.string().nullish(),
    outpatientClaim: outpatientClaimSchema.nullish(),
    createdAt: z.string().nullish(),
    updatedAt: z.string().nullish(),
  })
  .loose()

const sortObjectSchema = z
  .object({
    sorted: z.boolean().optional(),
    empty: z.boolean().optional(),
    unsorted: z.boolean().optional(),
  })
  .loose()
const pageableObjectSchema = z
  .object({
    pageNumber: z.number().optional(),
    pageSize: z.number().optional(),
    offset: z.number().optional(),
    sort: sortObjectSchema.optional(),
    paged: z.boolean().optional(),
    unpaged: z.boolean().optional(),
  })
  .loose()

export const pageOutpatientDocAcceptanceSchema = createPageResponseSchema(
  outpatientDocAcceptanceSchema
).extend({
  totalPages: z.number(),
  totalElements: z.number(),
  pageable: pageableObjectSchema.optional(),
  size: z.number(),
  number: z.number(),
  sort: sortObjectSchema.optional(),
  numberOfElements: z.number(),
  first: z.boolean(),
  last: z.boolean(),
  empty: z.boolean(),
})

export const outpatientDocAcceptancePageRequestSchema =
  createPageRequestSchema()
export const outpatientDocAcceptanceExportRequestSchema = z
  .object({ outpatientDocAcceptanceId: z.string().min(1) })
  .strict()

export type DmgCase = z.infer<typeof dmgCaseSchema>
export type Issuance = z.infer<typeof issuanceSchema>
export type OutpatientClaim = z.infer<typeof outpatientClaimSchema>
export type OutpatientDocAcceptance = z.infer<
  typeof outpatientDocAcceptanceSchema
>
export type OutpatientDocAcceptanceStatus = z.infer<
  typeof outpatientDocAcceptanceStatusSchema
>
export type OutpatientDocAcceptanceWsStatus = z.infer<
  typeof outpatientDocAcceptanceWsStatusSchema
>
export type OutpatientDocAcceptancePageRequest = z.input<
  typeof outpatientDocAcceptancePageRequestSchema
>
export type PageOutpatientDocAcceptance = z.infer<
  typeof pageOutpatientDocAcceptanceSchema
>
