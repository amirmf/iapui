import { z } from 'zod'

import { assessmentItemSchema } from '../assessment-item'
import { createPageResponseSchema } from '../common'
import { damageCodeSchema } from '../damage-code'

export const externalIllnessAmountSchema = z
  .object({
    amount: z.number().nullish(),
  })
  .loose()

export type ExternalIllnessAmount = z.infer<typeof externalIllnessAmountSchema>

export const externalIllnessFranchiseSchema = z
  .object({
    Franchise: z.number().nullish(),
  })
  .loose()

export type ExternalIllnessFranchise = z.infer<
  typeof externalIllnessFranchiseSchema
>

export const externalDoctorSchema = z
  .object({
    doctorName: z.string().nullish(),
    doctorFamilyName: z.string().nullish(),
    doctorCode: z.string().nullish(),
    major: z.string().nullish(),
    city: z.string().nullish(),
    membership: z.string().nullish(),
  })
  .loose()

export type ExternalDoctor = z.infer<typeof externalDoctorSchema>

export const getPreAuthsRequestSchema = z.strictObject({
  policyId: z.number().int(),
  nationalCode: z.string(),
  page: z.number().int().min(0).optional(),
  size: z.number().int().positive().optional(),
})

export type GetPreAuthsRequest = z.infer<typeof getPreAuthsRequestSchema>

export const preAuthInquirySchema = z
  .object({
    id: z.number().int().nullish(),
    amount: z.number().nullish(),
    franchise: z.number().nullish(),
    desc: z.string().nullish(),
    illnessDesc: z.string().nullish(),
    illnessId: z.number().int().nullish(),
    issuDate: z.string().nullish(),
    receptionDate: z.string().nullish(),
    preAuthValidityBeginDate: z.string().nullish(),
    preAuthValidityEndDate: z.string().nullish(),
    status: z.number().int().nullish(),
  })
  .loose()

export type PreAuthInquiry = z.infer<typeof preAuthInquirySchema>

export const pagePreAuthInquirySchema =
  createPageResponseSchema(preAuthInquirySchema)

export type PagePreAuthInquiry = z.infer<typeof pagePreAuthInquirySchema>

export const tariffEnumSchema = z.enum([
  'PRIVATE_SECTOR_TARIFF',
  'PRIVATE_SECTOR_SUPPLEMENTARY_INSURANCE',
  'GOVERNMENT_SECTOR_TARIFF',
  'PUBLIC_NON_GOVERNMENT_SECTOR_TARIFF',
  'CHARITY_SECTOR_TARIFF',
  'TEETH_GENERAL_DOCTOR',
  'TEETH_SPECIAL_DOCTOR',
])

export type TariffEnumType = z.infer<typeof tariffEnumSchema>

export const paymentCalculationRequestSchema = z.strictObject({
  claimRequestId: z.string(),
  damageCode: z.string(),
  coverageDetailId: z.string().nullish(),
  amount: z.number(),
  amountItem: z.number(),
  quantity: z.number().nullish(),
  franchiseAmount: z.number().nullish(),
  franchisePercentage: z.number().nullish(),
  dontApplyTariff: z.boolean().optional(),
  assessmentItemId: z.string().optional(),
  priceType: tariffEnumSchema.optional(),
  overrideInsuredPersonId: z.number().nullish(),
})

export type PaymentCalculationRequest = z.infer<
  typeof paymentCalculationRequestSchema
>

export const paymentCalculationResponseSchema = z.object({
  amount: z.number().optional(),
  amountItem: z.number().optional(),
  maxPerCaseAmount: z.number().nullish(),
  maxCoverageAmount: z.number().nullish(),
  franchiseAmount: z.number().nullish(),
  franchiseAmountItem: z.number().nullish(),
  franchisePercentage: z.number().nullish(),
  payAmount: z.number().optional(),
  usedCoverageAmount: z.number().nullish(),
  overrideInsuredPersonId: z.number().nullish(),
  dontApplyTariff: z.boolean().nullish(),
})

export type PaymentCalculationResponse = z.infer<
  typeof paymentCalculationResponseSchema
>

export const assessmentItemIdRequestSchema = z.strictObject({ id: z.string() })
export const externalIllnessAmountRequestSchema = z.strictObject({
  insuredPersonId: z.union([z.string(), z.number()]),
  receptionDate: z.string(),
  rootCoverageId: z.string(),
  usedId: z.union([z.string(), z.number()]).optional(),
})
export const externalFranchiseAmountRequestSchema = z.strictObject({
  policyId: z.union([z.string(), z.number()]),
  healthPolicyInsuredPersonId: z.union([z.string(), z.number()]),
  IllnessId: z.union([z.string(), z.number()]),
  ReceptionDate: z.string().optional(),
})
export const externalDoctorLookupRequestSchema = z.strictObject({
  medicalNumberId: z.string().optional(),
  doctorName: z.string().optional(),
  doctorFamilyName: z.string().optional(),
})

export const doctorLookupResponseSchema = z.unknown()

export const assessmentItemWriteRequestSchema = assessmentItemSchema
  .strict()
  .extend({ damageCode: damageCodeSchema.nullish() })
export type AssessmentItemsData = z.infer<
  typeof assessmentItemWriteRequestSchema
>
export const assessmentItemIdsRequestSchema = z.array(z.string())
export const assessmentItemSoftDeleteQuerySchema = z.strictObject({
  thruDate: z.string().optional(),
})
