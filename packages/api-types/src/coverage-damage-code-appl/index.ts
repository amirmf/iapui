import { z } from 'zod'

import { createPageRequestSchema, createPageResponseSchema } from '../common'
import { coverageSchema } from '../coverage'

export const coverageDamageCodeApplStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'PENDING',
])
export type CoverageDamageCodeApplStatus = z.infer<
  typeof coverageDamageCodeApplStatusSchema
>

const damageCodeSchema = z
  .object({
    code: z.string().nullish(),
    id: z.string().uuid().nullish(),
    title: z.string().nullish(),
  })
  .loose()

/** Damage-code option contract used by the reference mapping form. */
export const coverageDamageCodeApplDamageCodeSchema = damageCodeSchema
export const coverageDamageCodeApplDamageCodePageSchema =
  createPageResponseSchema(coverageDamageCodeApplDamageCodeSchema)

const isoDateTimeRegex =
  /^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?)(?:Z|[+-](?:[01]\d|2[0-3])(?::?[0-5]\d))?$/
const isoDateTimeSchema = z.string().regex(isoDateTimeRegex).nullish()

export const coverageDamageCodeApplSchema = z
  .object({
    coverageDetailId: z.string().uuid().nullish(),
    createdAt: isoDateTimeSchema,
    createdBy: z.string().nullish(),
    damageCodeDescription: z.string().nullish(),
    damageCodeId: z.string().uuid().nullish(),
    description: z.string().nullish(),
    device: z.string().nullish(),
    fromDate: isoDateTimeSchema,
    id: z.string().uuid().nullish(),
    isRequired: z.boolean().nullish(),
    priority: z.number().nullish(),
    ratio: z.number().nullish(),
    ruleDesc: z.string().nullish(),
    serviceGroup: z.string().nullish(),
    serviceHeadline: z.string().nullish(),
    status: coverageDamageCodeApplStatusSchema.nullish(),
    thruDate: isoDateTimeSchema,
    updatedAt: isoDateTimeSchema,
    updatedBy: z.string().nullish(),
  })
  .loose()
export type CoverageDamageCodeAppl = z.infer<
  typeof coverageDamageCodeApplSchema
>
export const coverageDamageCodeApplFullSchema =
  coverageDamageCodeApplSchema.extend({
    coverageDetail: coverageSchema.nullish(),
    damageCode: damageCodeSchema.nullish(),
  })
export type CoverageDamageCodeApplFull = z.infer<
  typeof coverageDamageCodeApplFullSchema
>

export const coverageDamageCodeApplFormSchema = z.object({
  coverageDetailId: z.string().uuid().nullish(),
  damageCodeId: z.string().uuid().nullish(),
  description: z.string().nullish(),
  device: z.string().nullish(),
  fromDate: z.date().nullish(),
  isRequired: z.boolean().nullish(),
  priority: z.number().nullish(),
  ratio: z.number().nullish(),
  ruleDesc: z.string().nullish(),
  serviceGroup: z.string().nullish(),
  serviceHeadline: z.string().nullish(),
  status: coverageDamageCodeApplStatusSchema.nullish(),
  thruDate: z.date().nullish(),
})
export type CoverageDamageCodeApplForm = z.infer<
  typeof coverageDamageCodeApplFormSchema
>
export const coverageDamageCodeApplPageSchema = createPageResponseSchema(
  coverageDamageCodeApplFullSchema
)
export const coverageDamageCodeApplPageRequestSchema = createPageRequestSchema()
const idSchema = z.object({ id: z.string().uuid() }).strict()
export const createCoverageDamageCodeApplRequestSchema =
  coverageDamageCodeApplFormSchema
export const updateCoverageDamageCodeApplRequestSchema = z
  .object({
    body: coverageDamageCodeApplFormSchema.extend({ id: z.string().uuid() }),
    path: idSchema,
  })
  .strict()
export const deleteCoverageDamageCodeApplRequestSchema = z
  .object({ path: idSchema })
  .strict()
export const softDeleteCoverageDamageCodeApplsRequestSchema = z
  .object({
    body: z.array(z.string().uuid()).min(1),
    query: z.object({ thruDate: z.string().optional() }).strict(),
  })
  .strict()
export const bulkDeleteCoverageDamageCodeApplsRequestSchema = z
  .array(z.string().uuid())
  .min(1)
