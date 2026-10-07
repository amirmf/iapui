import { z } from 'zod'

import { createPageRequestSchema } from '../common'

const agreementDateSchema = z
  .string()
  .regex(
    /^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?)(?:Z|[+-](?:[01]\d|2[0-3])(?::?[0-5]\d))?$/,
    'agreements.validation.invalidIsoDateTime'
  )

export const agreementStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'DRAFT',
  'EXPIRED',
  'TERMINATED',
])
export type AgreementStatus = z.infer<typeof agreementStatusSchema>

// The reference validates these fields even when a selector displays only a label.
export const agreementSchema = z
  .object({
    id: z.uuid().nullish(),
    createdAt: agreementDateSchema.nullish(),
    updatedAt: agreementDateSchema.nullish(),
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
    fromDate: agreementDateSchema.nullish(),
    thruDate: agreementDateSchema.nullish(),
    overrideRatio: z.number().nullish(),
    templateCode: z.string().nullish(),
  })
  .loose()
export type Agreement = z.infer<typeof agreementSchema>

export const pageAgreementSchema = z
  .object({
    content: z.array(agreementSchema).nullish(),
    totalElements: z.number(),
    totalPages: z.number(),
    size: z.number(),
    number: z.number(),
    first: z.boolean(),
    last: z.boolean(),
    numberOfElements: z.number(),
    empty: z.boolean(),
  })
  .loose()
export type PageAgreement = z.infer<typeof pageAgreementSchema>

export const agreementPageRequestSchema = createPageRequestSchema()
export type AgreementPageRequest = z.infer<typeof agreementPageRequestSchema>

export const getAgreementRequestSchema = z
  .object({ path: z.object({ id: z.string().uuid() }).strict() })
  .strict()
export type GetAgreementRequest = z.infer<typeof getAgreementRequestSchema>
