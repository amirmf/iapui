import { z } from 'zod'

import { createPageRequestSchema } from '../common'

export const outpatientDocAcceptanceStatusEnum = z.enum([
  'SUBMIT',
  'SENT_TO_SERVER',
  'REJECT',
  'FAILED',
  'DELETED',
  'SUCCESS',
])
export const outpatientDocAcceptanceWsStatusEnum = z.enum([
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
    status: outpatientDocAcceptanceStatusEnum.nullish(),
    claimRequestId: z.string().nullish(),
    assessmentItemId: z.string().nullish(),
    wsResult: z.string().nullish(),
    wsStatus: outpatientDocAcceptanceWsStatusEnum.nullish(),
  })
  .loose()

export type DmgCase = z.infer<typeof dmgCaseSchema>

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
    status: outpatientDocAcceptanceStatusEnum.nullish(),
    claimRequestId: z.string().nullish(),
    wsResult: z.string().nullish(),
    wsStatus: outpatientDocAcceptanceWsStatusEnum.nullish(),
    dmgCases: z.array(dmgCaseSchema).nullish(),
    afterInqueryResult: z.lazy((): z.ZodType => issuanceSchema).nullish(),
  })
  .loose()

export type Issuance = z.infer<typeof issuanceSchema>

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
    status: outpatientDocAcceptanceStatusEnum.nullish(),
    claimRequestId: z.string().nullish(),
    wsResult: z.string().nullish(),
    wsStatus: outpatientDocAcceptanceWsStatusEnum.nullish(),
    issuance: issuanceSchema.nullish(),
  })
  .loose()

export type OutpatientClaim = z.infer<typeof outpatientClaimSchema>

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
    status: outpatientDocAcceptanceStatusEnum.nullish(),
    inqueryStatusId: z.number().nullish(),
    inqueryStatusTitle: z.string().nullish(),
    claimRequestId: z.string().nullish(),
    wsResult: z.string().nullish(),
    wsStatus: outpatientDocAcceptanceWsStatusEnum.nullish(),
    cancelWsResponseStatus: z.number().nullish(),
    cancelWsResponseBodyText: z.string().nullish(),
    outpatientClaim: outpatientClaimSchema.nullish(),
    createdAt: z.string().nullish(),
    updatedAt: z.string().nullish(),
  })
  .loose()

export type OutpatientDocAcceptance = z.infer<
  typeof outpatientDocAcceptanceSchema
>

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

export const pageOutpatientDocAcceptanceSchema = z
  .object({
    totalPages: z.number(),
    totalElements: z.number(),
    pageable: pageableObjectSchema.optional(),
    size: z.number(),
    content: z.array(outpatientDocAcceptanceSchema),
    number: z.number(),
    sort: sortObjectSchema.optional(),
    numberOfElements: z.number(),
    first: z.boolean(),
    last: z.boolean(),
    empty: z.boolean(),
  })
  .loose()

export type PageOutpatientDocAcceptance = z.infer<
  typeof pageOutpatientDocAcceptanceSchema
>

const numericString = z.preprocess((value) => {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
  }

  if (value === null || value === undefined) {
    return undefined
  }

  return value
}, z.string().optional())

export const outpatientDocAcceptanceFormSchema = z.object({
  exId: numericString,
  docDeliveryKindId: numericString,
  deliveryDate: z.string().trim().optional(),
  acceptanceKindId: numericString,
  claimCount: numericString,
  dichargeMonth: numericString,
  totalAmount: numericString,
  policyId: numericString,
  insuredPersonId: numericString,
  medicalCenterId: numericString,
  letterDate: z.string().trim().optional(),
  letterNo: z.string().trim().optional(),
  secretariatNo: z.string().trim().optional(),
  secretariatDate: z.string().trim().optional(),
  paymentDate: z.string().trim().optional(),
  docDelivererAgentId: numericString,
  dataSenderId: numericString,
  claimExpertId: numericString,
  opUnitId: numericString,
  exStatus: numericString,
  status: outpatientDocAcceptanceStatusEnum.optional(),
  claimRequestId: z.string().trim().optional(),
  wsResult: z.string().trim().optional(),
  wsStatus: outpatientDocAcceptanceWsStatusEnum.optional(),
})

export type OutpatientDocAcceptanceForm = z.infer<
  typeof outpatientDocAcceptanceFormSchema
>

export const outpatientDocAcceptanceGenerationFormSchema = z.object({
  claimRequestId: z.string().nullish(),
  date: z.date(),
})

export type OutpatientDocAcceptanceGenerationForm = z.infer<
  typeof outpatientDocAcceptanceGenerationFormSchema
>

export const outpatientDocAcceptanceAdjustmentGenerationFormSchema = z.object({
  claimRequestId: z.string().trim().optional(),
})

export type OutpatientDocAcceptanceAdjustmentGenerationForm = z.infer<
  typeof outpatientDocAcceptanceAdjustmentGenerationFormSchema
>

export const outpatientDocAcceptanceSubmissionFormSchema = z.object({
  outpatientDocAcceptanceId: z.string().nullish(),
  date: z.date().nullish(),
})

export type OutpatientDocAcceptanceSubmissionForm = z.infer<
  typeof outpatientDocAcceptanceSubmissionFormSchema
>

export const outpatientClaimFormSchema = z.object({
  acceptanceId: numericString,
  announcementDate: z.string().trim().optional(),
  chargePlanId: numericString,
  claimExpertId: numericString,
  dataSenderId: numericString,
  description: z.string().trim().optional(),
  dmgRegisterarId: numericString,
  docDelivererAgentId: numericString,
  docDeliveryKindId: numericString,
  draftExpertId: numericString,
  estimateAmount: numericString,
  expertiseEndDate: z.string().trim().optional(),
  hasPreAuth: z.boolean().optional(),
  hasReturnDocs: z.boolean().optional(),
  exId: numericString,
  claimNo: numericString,
  insuredPersonId: numericString,
  isMatchedWithList: z.boolean().optional(),
  isPaymentFromCash: z.boolean().optional(),
  letterNo: z.string().trim().optional(),
  medicalCenterId: numericString,
  policyId: numericString,
  statusChangeDate: z.string().trim().optional(),
  exStatus: numericString,
  status: outpatientDocAcceptanceStatusEnum.optional(),
  claimRequestId: z.string().trim().optional(),
  wsResult: z.string().trim().optional(),
  wsStatus: outpatientDocAcceptanceWsStatusEnum.optional(),
})

export type OutpatientClaimForm = z.infer<typeof outpatientClaimFormSchema>

export const issuanceFormSchema = z.object({
  draftKindId: numericString,
  description: z.string().trim().optional(),
  certificationExpertId: numericString,
  complementReasonId: numericString,
  dataSenderId: numericString,
  amount: numericString,
  autoCalc: z.boolean().optional(),
  claimId: numericString,
  docAcceptanceId: numericString,
  draftNo: z.string().trim().optional(),
  draftReasonId: numericString,
  reasonId: numericString,
  exId: numericString,
  isComfort: z.boolean().optional(),
  issuDate: z.string().trim().optional(),
  sourceId: numericString,
  exStatus: numericString,
  calcTime: z.string().trim().optional(),
  changeTime: z.string().trim().optional(),
  paymentPreparationTime: z.string().trim().optional(),
  calcJobStatus: numericString,
  status: outpatientDocAcceptanceStatusEnum.optional(),
  claimRequestId: z.string().trim().optional(),
  wsResult: z.string().trim().optional(),
  wsStatus: outpatientDocAcceptanceWsStatusEnum.optional(),
})

export type IssuanceForm = z.infer<typeof issuanceFormSchema>

export const dmgCaseFormSchema = z.object({
  insuredPersonId: numericString,
  serviceDate: z.string().trim().optional(),
  medicalSystemCode: numericString,
  illnessId: numericString,
  serviceDetailId: numericString,
  serviceProvinceId: numericString,
  tariffKindId: numericString,
  doctorSpecialityId: numericString,
  isFranchiseDeduction: z.boolean().optional(),
  excessFranchiseAmount: numericString,
  deductionKindId: numericString,
  deductionAmount: numericString,
  firstInsurerShareAmount: numericString,
  expertiseFranchisePercent: numericString,
  otherOrganizationsShareAmount: numericString,
  toothId: numericString,
  insuredIsAdult: z.boolean().optional(),
  medicalCenterId: numericString,
  drugCount: numericString,
  deliveredDocTypeId: numericString,
  preAuthId: numericString,
  medicalBookLetSerialNo: numericString,
  medicalBookletPageNo: numericString,
  cardSerial: z.string().trim().optional(),
  deductionDesc: z.string().trim().optional(),
  discountAmount: numericString,
  excessOfTheInsurersCommitmentAmount: numericString,
  outOfTheInsurersCommitmentAmount: numericString,
  thePatientLedFranchise: numericString,
  otherRecoverableAmount: numericString,
  requestedAmount: numericString,
  approvedAmount: numericString,
  drugClaimId: numericString,
  systemCalculated: z.boolean().optional(),
  dataSenderId: numericString,
  claimId: numericString,
  draftId: numericString,
  firstInsurerId: numericString,
  franchise: numericString,
  exId: numericString,
  nonPaymentReason: z.string().trim().optional(),
  totalAmount: numericString,
  isCalculated: z.boolean().optional(),
  status: outpatientDocAcceptanceStatusEnum.optional(),
  claimRequestId: z.string().trim().optional(),
  assessmentItemId: z.string().trim().optional(),
  wsResult: z.string().trim().optional(),
  wsStatus: outpatientDocAcceptanceWsStatusEnum.optional(),
})

export type DmgCaseForm = z.infer<typeof dmgCaseFormSchema>

// Compatibility aliases for existing workspace consumers.
export const outpatientDocAcceptanceStatusSchema =
  outpatientDocAcceptanceStatusEnum
export const outpatientDocAcceptanceWsStatusSchema =
  outpatientDocAcceptanceWsStatusEnum
export type OutpatientDocAcceptanceStatus = z.infer<
  typeof outpatientDocAcceptanceStatusEnum
>
export type OutpatientDocAcceptanceWsStatus = z.infer<
  typeof outpatientDocAcceptanceWsStatusEnum
>
export const outpatientDocAcceptancePageRequestSchema =
  createPageRequestSchema().extend({
    sort: z.string().optional(),
    direction: z.string().optional(),
  })
export type OutpatientDocAcceptancePageRequest = z.input<
  typeof outpatientDocAcceptancePageRequestSchema
>
export const outpatientDocAcceptanceExportRequestSchema = z
  .object({ outpatientDocAcceptanceId: z.string().min(1) })
  .strict()

// Form schemas retain source stripping semantics; mapped transport bodies are strict.
function createTransportSchema(form: z.ZodObject, response: z.ZodObject) {
  return z
    .object(
      Object.fromEntries(
        Object.keys(form.shape).map((key) => [key, response.shape[key]])
      ) as Record<string, z.ZodType>
    )
    .strict()
}
export const outpatientDocAcceptanceMutationRequestSchema =
  createTransportSchema(
    outpatientDocAcceptanceFormSchema,
    outpatientDocAcceptanceSchema
  )
export const outpatientClaimMutationRequestSchema = createTransportSchema(
  outpatientClaimFormSchema,
  outpatientClaimSchema
)
export const issuanceMutationRequestSchema = createTransportSchema(
  issuanceFormSchema,
  issuanceSchema
)
export const dmgCaseMutationRequestSchema = createTransportSchema(
  dmgCaseFormSchema,
  dmgCaseSchema
).extend({ docAcceptanceId: z.number().optional() })
