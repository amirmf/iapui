import { z } from 'zod'

import { createPageResponseSchema } from '../common'

export const getPreAuthsRequestSchema = z
  .object({
    nationalCode: z.string().trim().min(1),
    page: z.number().int().min(0).optional(),
    policyId: z.number().int(),
    size: z.number().int().positive().optional(),
  })
  .strict()

export const getSubInsuredPeopleRequestSchema = z
  .object({ policyId: z.number().int().positive() })
  .strict()

export const preAuthSchema = z
  .object({
    acceptanceId: z.number().int().nullish(),
    amount: z.number().nullish(),
    cancellationDesc: z.string().nullish(),
    certificationExpertId: z.number().nullish(),
    chargePlanId: z.number().int().nullish(),
    comment: z.string().nullish(),
    dataSenderId: z.number().int().nullish(),
    desc: z.string().nullish(),
    docDeliveryAgentId: z.number().int().nullish(),
    doctorName: z.string().nullish(),
    firstInsurerId: z.number().nullish(),
    franchise: z.number().nullish(),
    hasDmgClaim: z.number().nullish(),
    healthPolicyInsuredPersonId: z.number().int().nullish(),
    id: z.number().int().nullish(),
    illnessDesc: z.string().nullish(),
    illnessId: z.number().int().nullish(),
    illnessTypeId: z.number().int().nullish(),
    insuredPersonId: z.number().int().nullish(),
    isForAccident: z.number().int().nullish(),
    isFranchiseDeduction: z.number().int().nullish(),
    isIllnessEmergency: z.number().int().nullish(),
    isLeniency: z.number().int().nullish(),
    isPaymentFromCash: z.number().int().nullish(),
    issuDate: z.string().nullish(),
    leftEyeDioptre: z.number().nullish(),
    mcSpecialty: z.string().nullish(),
    medicalCenterId: z.number().int().nullish(),
    nationalCode: z.string().nullish(),
    opUnitId: z.number().int().nullish(),
    policyId: z.number().int().nullish(),
    preAuthValidityBeginDate: z.string().nullish(),
    preAuthValidityEndDate: z.string().nullish(),
    receptionDate: z.string().nullish(),
    rightEyeDioptre: z.number().nullish(),
    status: z.number().int().nullish(),
    systemCalculated: z.number().nullish(),
  })
  .loose()

export const pagePreAuthSchema = createPageResponseSchema(preAuthSchema)

export const subInsuredPersonSchema = z
  .object({
    fullName: z.string(),
    id: z.number().nullable(),
    isForeign: z.enum(['Y', 'N']).nullish(),
    nationalCode: z.string(),
  })
  .loose()

export const subInsuredPeopleSchema = z.array(subInsuredPersonSchema)

export type GetPreAuthsRequest = z.infer<typeof getPreAuthsRequestSchema>
export type GetSubInsuredPeopleRequest = z.infer<
  typeof getSubInsuredPeopleRequestSchema
>
export type PreAuth = z.infer<typeof preAuthSchema>
export type PagePreAuth = z.infer<typeof pagePreAuthSchema>
export type SubInsuredPerson = z.infer<typeof subInsuredPersonSchema>
