import { z } from 'zod'

import { createPageRequestSchema, createPageResponseSchema } from '../common'
import { coverageSchema } from '../coverage'
import { damageCodeSchema } from '../damage-code'
import { userAccountSchema } from '../user-account'

type AgreementValidationTranslator = (key: string) => string

const isoDateTimeRegex =
  /^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?)(?:Z|[+-](?:[01]\d|2[0-3])(?::?[0-5]\d))?$/
const isoDateTimeSchema = z
  .string()
  .regex(isoDateTimeRegex, 'agreements.validation.invalidIsoDateTime')
  .nullish()
const optionalText = z.preprocess((value) => {
  if (typeof value === 'string') return value.trim() || undefined
  return value == null ? undefined : String(value)
}, z.string().optional())
const idSchema = z.object({ id: z.uuid() }).strict()
const idsSchema = z.array(z.uuid()).min(1)
const optionalThruDateQuerySchema = z
  .object({ thruDate: z.string().optional() })
  .strict()

export const agreementStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'DRAFT',
  'EXPIRED',
  'TERMINATED',
])
export type AgreementStatus = z.infer<typeof agreementStatusSchema>

export const agreementSchema = z
  .object({
    code: z.string().nullish(),
    createdAt: isoDateTimeSchema,
    createdBy: z.string().nullish(),
    extContractId: z.number().int().nullish(),
    extLocation: z.string().nullish(),
    extLocationCityId: z.number().int().nullish(),
    extLocationCityName: z.string().nullish(),
    extLocationName: z.string().nullish(),
    extLocationProvinceId: z.number().int().nullish(),
    extLocationProvinceName: z.string().nullish(),
    extPlanId: z.number().int().nullish(),
    extPolicyId: z.number().int().nullish(),
    fromDate: isoDateTimeSchema,
    id: z.uuid().nullish(),
    overrideRatio: z.number().nullish(),
    status: agreementStatusSchema.nullish(),
    templateCode: z.string().nullish(),
    thruDate: isoDateTimeSchema,
    title: z.string().nullish(),
    updatedAt: isoDateTimeSchema,
    updatedBy: z.string().nullish(),
  })
  .loose()
export type Agreement = z.infer<typeof agreementSchema>
export const agreementListSchema = z.array(agreementSchema)

export const agreementFormSchema = (t?: AgreementValidationTranslator) =>
  z.object({
    title: z
      .string()
      .min(
        1,
        t
          ? t('agreements.validation.titleRequired')
          : 'agreements.validation.titleRequired'
      ),
    code: z
      .string()
      .min(
        1,
        t
          ? t('agreements.validation.codeRequired')
          : 'agreements.validation.codeRequired'
      ),
    templateCode: optionalText,
    extLocation: optionalText,
    extContractId: optionalText,
    extPolicyId: optionalText,
    extPlanId: optionalText,
    overrideRatio: optionalText,
    status: agreementStatusSchema,
    fromDate: z.date(),
    thruDate: z.date().optional(),
  })
export type AgreementForm = z.infer<ReturnType<typeof agreementFormSchema>>
export const agreementPageSchema = createPageResponseSchema(agreementSchema)
export type AgreementPage = z.infer<typeof agreementPageSchema>
export const agreementPageFullSchema = createPageResponseSchema(agreementSchema)
export type AgreementPageFull = z.infer<typeof agreementPageFullSchema>
export const agreementPageRequestSchema = createPageRequestSchema()
export const getAgreementRequestSchema = z.object({ path: idSchema }).strict()
export const softDeleteAgreementRequestSchema = z
  .object({ path: idSchema, query: optionalThruDateQuerySchema })
  .strict()
export const createAgreementRequestSchema = agreementFormSchema().strict()
export const updateAgreementRequestSchema = z
  .object({ body: agreementFormSchema().strict(), path: idSchema })
  .strict()
export const softDeleteAgreementsRequestSchema = z
  .object({ body: idsSchema, query: optionalThruDateQuerySchema })
  .strict()
export const bulkDeleteAgreementsRequestSchema = idsSchema

export const agreementPartyRelationshipTypeSchema = z
  .enum(['GENERAL', 'ASSIGNMENT'])
  .optional()
export const agreementPartyRoleSchema = z
  .enum([
    'OWNER',
    'ASSESSMENT_USER',
    'MAIN_ASSESSMENT_USER',
    'HQ_USER',
    'DOCTOR_USER',
    'REQUEST_REGISTERY_AGENT',
    'MAIN_REQUEST_REGISTERY_AGENT',
    'BRANCH_USER',
    'CUSTOMER_USER',
  ])
  .optional()
export type AgreementPartyRole = z.infer<typeof agreementPartyRoleSchema>
export const agreementPartyApplBulkCreateWithRoleRoleSchema = z.enum([
  'OWNER',
  'ASSESSMENT_USER',
  'CUSTOMER_USER',
  'MAIN_ASSESSMENT_USER',
  'DOCTOR_USER',
  'REQUEST_REGISTERY_AGENT',
  'MAIN_REQUEST_REGISTERY_AGENT',
])
export type AgreementPartyApplBulkCreateWithRoleRole = z.infer<
  typeof agreementPartyApplBulkCreateWithRoleRoleSchema
>
export const agreementPartyApplSchema = z.object({
  agreementId: z.uuid().nullish(),
  createdAt: z.string().nullish(),
  createdBy: z.string().nullish(),
  docTypeCodes: z.array(z.string()).optional(),
  fromDate: z
    .string()
    .regex(isoDateTimeRegex, 'Invalid ISO datetime')
    .nullish(),
  id: z.uuid().optional(),
  relationshipType: agreementPartyRelationshipTypeSchema,
  role: agreementPartyRoleSchema,
  thruDate: z
    .string()
    .regex(isoDateTimeRegex, 'Invalid ISO datetime')
    .nullish(),
  updatedAt: z.string().nullish(),
  updatedBy: z.string().nullish(),
  userAccountId: z.uuid().nullish(),
})
export type AgreementPartyAppl = z.infer<typeof agreementPartyApplSchema>
export const agreementPartyApplCreateFormSchema = (
  t?: AgreementValidationTranslator
) =>
  z.object({
    userAccountId: z.uuid({
      error: t?.('agreementPartyAppls.validation.userAccountIdRequired'),
    }),
    role: agreementPartyApplBulkCreateWithRoleRoleSchema,
  })
export type AgreementPartyApplCreateForm = z.infer<
  ReturnType<typeof agreementPartyApplCreateFormSchema>
>
export const agreementPartyApplFormSchema = (
  t?: AgreementValidationTranslator
) =>
  z.object({
    userAccountId: z.uuid({
      error: t?.('agreementPartyAppls.validation.userAccountIdRequired'),
    }),
    relationshipType: agreementPartyRelationshipTypeSchema,
    role: agreementPartyRoleSchema,
    fromDate: z
      .date({ error: t?.('agreementPartyAppls.validation.fromDateRequired') })
      .optional(),
    thruDate: z.date().nullish(),
  })
export type AgreementPartyApplForm = z.infer<
  ReturnType<typeof agreementPartyApplFormSchema>
>
export const agreementPartyApplFullSchema = agreementPartyApplSchema.extend({
  agreement: agreementSchema.optional(),
  userAccount: userAccountSchema.nullish(),
})
export type AgreementPartyApplFull = z.infer<
  typeof agreementPartyApplFullSchema
>
export const agreementPartyApplPageFullSchema = createPageResponseSchema(
  agreementPartyApplFullSchema
)
export type AgreementPartyApplPageFull = z.infer<
  typeof agreementPartyApplPageFullSchema
>
export const agreementPartyApplPageSchema = createPageResponseSchema(
  agreementPartyApplSchema
)
export type AgreementPartyApplPage = z.infer<
  typeof agreementPartyApplPageSchema
>
export const agreementPartyApplBulkCreateWithRoleRequestSchema = z
  .object({
    agreementIds: idsSchema,
    docTypeCodes: z.array(z.string()).optional(),
    role: agreementPartyApplBulkCreateWithRoleRoleSchema.optional(),
    userAccountIds: idsSchema,
  })
  .strict()
export type AgreementPartyApplBulkCreateWithRoleRequest = z.infer<
  typeof agreementPartyApplBulkCreateWithRoleRequestSchema
>
export const agreementPartyApplPageRequestSchema =
  createPageRequestSchema().extend({
    agreementIds: z.array(z.string()).nullish(),
    userAccountIds: z.array(z.string()).nullish(),
  })
export const agreementPartyApplicationsPageRequestSchema =
  createPageRequestSchema().extend({ agreementId: z.string().optional() })
export const agreementPartyApplicationsRequestSchema =
  createPageRequestSchema().extend({ agreementId: z.string() })
export const agreementPartyApplBulkCreateRequestSchema = z
  .object({
    agreementIds: z.array(z.uuid()),
    userAccountIds: z.array(z.uuid()),
    docTypeCodes: z.array(z.string()),
  })
  .strict()
export const softDeleteAgreementPartyApplsRequestSchema = z
  .object({ body: idsSchema, query: optionalThruDateQuerySchema })
  .strict()
export const bulkDeleteAgreementPartyApplsRequestSchema = idsSchema
export const createAgreementPartyApplRequestSchema =
  agreementPartyApplFormSchema().strict()
export const updateAgreementPartyApplRequestSchema = z
  .object({ body: agreementPartyApplFormSchema().strict(), path: idSchema })
  .strict()
export const getAgreementPartyApplRequestSchema = z
  .object({ path: idSchema })
  .strict()
export const softDeleteAgreementPartyApplRequestSchema = z
  .object({ path: idSchema, query: optionalThruDateQuerySchema })
  .strict()

export const agreementCoverageApplSchema = z.object({
  agreementId: z.uuid().nullish(),
  amountPerCase: z.number().nullish(),
  coverageAmount: z.number().nullish(),
  coverageDetailId: z.uuid().nullish(),
  coverageGroupId: z.uuid().nullish(),
  createdAt: z.string().nullish(),
  createdBy: z.string().nullish(),
  damageCodeId: z.uuid().nullish(),
  franchisePercentage: z.number().nullish(),
  fromDate: z.string().nullish(),
  id: z.uuid().nullish(),
  overrideRatio: z.number().nullish(),
  thruDate: z.string().nullish(),
  updatedAt: z.string().nullish(),
  updatedBy: z.string().nullish(),
})
export type AgreementCoverageAppl = z.infer<typeof agreementCoverageApplSchema>
export const agreementCoverageApplFormSchema = z.object({
  agreementId: z.string().min(1, 'Agreement is required'),
  coverageDetailId: z.string().nullish(),
  coverageGroupId: z.string().nullish(),
  damageCodeId: z.string().nullish(),
  overrideRatio: z.number().nullish(),
  franchisePercentage: z.number().nullish(),
  coverageAmount: z.number().nullish(),
  amountPerCase: z.number().nullish(),
  fromDate: z.date().nullish(),
  thruDate: z.date().nullish(),
})
export type AgreementCoverageApplForm = z.infer<
  typeof agreementCoverageApplFormSchema
>
export const agreementCoverageApplFullSchema =
  agreementCoverageApplSchema.extend({
    agreement: agreementSchema.nullish(),
    coverageDetail: coverageSchema.nullish(),
    coverageGroup: coverageSchema.nullish(),
    damageCode: damageCodeSchema.nullish(),
  })
export type AgreementCoverageApplFull = z.infer<
  typeof agreementCoverageApplFullSchema
>
export const agreementCoverageApplPageFullSchema = createPageResponseSchema(
  agreementCoverageApplFullSchema
)
export type AgreementCoverageApplPageFull = z.infer<
  typeof agreementCoverageApplPageFullSchema
>
export const agreementCoverageApplPageRequestSchema = createPageRequestSchema()
export const getAgreementCoverageApplRequestSchema = z
  .object({ path: idSchema })
  .strict()
export const softDeleteAgreementCoverageApplRequestSchema = z
  .object({ path: idSchema, query: optionalThruDateQuerySchema })
  .strict()
export const createAgreementCoverageApplRequestSchema =
  agreementCoverageApplFormSchema.strict()
export const updateAgreementCoverageApplRequestSchema = z
  .object({ body: agreementCoverageApplFormSchema.strict(), path: idSchema })
  .strict()
export const softDeleteAgreementCoverageApplsRequestSchema = z
  .object({ body: idsSchema, query: optionalThruDateQuerySchema })
  .strict()
export const bulkDeleteAgreementCoverageApplsRequestSchema = idsSchema
export const initializeAgreementCoverageApplsRequestSchema = z
  .object({ agreementId: z.uuid() })
  .strict()

// Preserve reference public contract names while existing consumers migrate.
export const pageAgreementSchema = agreementPageSchema
export type PageAgreement = z.infer<typeof pageAgreementSchema>
export const pageAgreementFullSchema = agreementPageFullSchema
export type PageAgreementFull = z.infer<typeof pageAgreementFullSchema>
export type agreementPartyRole = z.infer<typeof agreementPartyRoleSchema>
export const pageAgreementPartyApplSchema = agreementPartyApplPageSchema
export type PageAgreementPartyAppl = z.infer<
  typeof pageAgreementPartyApplSchema
>
export const pageAgreementPartyApplFullSchema = agreementPartyApplPageFullSchema
export type PageAgreementPartyApplFull = z.infer<
  typeof pageAgreementPartyApplFullSchema
>
export const pageAgreementCoverageApplFullSchema =
  agreementCoverageApplPageFullSchema
export type PageAgreementCoverageApplFull = z.infer<
  typeof pageAgreementCoverageApplFullSchema
>
