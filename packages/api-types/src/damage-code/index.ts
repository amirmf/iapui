import { z } from 'zod'

import { createPageRequestSchema, createPageResponseSchema } from '../common'

/** ISO 8601 date-time format required by the reference pricing contracts. */
const isoDateTimeRegex =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/

const isoDateTimeSchema = z
  .string()
  .regex(isoDateTimeRegex, 'Invalid datetime format')
  .nullable()
  .optional()

export const damageCodeStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'PENDING',
  'DEPRECATED',
])
export type DamageCodeStatus = z.infer<typeof damageCodeStatusSchema>

export const priceTypeSchema = z.enum([
  'TOTAL',
  'PROFESSIONAL',
  'TECHNICAL',
  'BASE_ANESTHESIA_VALUE',
  'PRIVATE_SECTOR_TARIFF',
  'PRIVATE_SECTOR_SUPPLEMENTARY_INSURANCE',
  'GOVERNMENT_SECTOR_TARIFF',
  'GOVERNMENT_SECTOR_SUPPLEMENTARY_INSURANCE',
  'CHARITY_SECTOR_TARIFF',
  'CHARITY_SECTOR_SUPPLEMENTARY_INSURANCE',
  'PUBLIC_NON_GOVERNMENT_SECTOR_TARIFF',
  'PUBLIC_NON_GOVERNMENT_SUPPLEMENTARY_INSURANCE',
  'BASIC_INSURANCE_SHARE',
  'TEETH_GENERAL_DOCTOR',
  'TEETH_SPECIAL_DOCTOR',
])
export type PriceType = z.infer<typeof priceTypeSchema>

export const damageCodeSummarySchema = z
  .object({
    code: z.string().nullable().optional(),
    id: z.uuid().nullable().optional(),
    title: z.string().nullable().optional(),
  })
  .loose()
export type DamageCodeSummary = z.infer<typeof damageCodeSummarySchema>

export const damageCodePricingSchema = z
  .object({
    amount: z.number(),
    createdAt: isoDateTimeSchema,
    createdBy: z.string().nullable().optional(),
    damageCode: damageCodeSummarySchema.nullable().optional(),
    damageCodeId: z.uuid(),
    fromDate: isoDateTimeSchema,
    id: z.uuid().nullable().optional(),
    priceType: priceTypeSchema,
    thruDate: isoDateTimeSchema,
    unit: z.string().nullable().optional(),
    updatedAt: isoDateTimeSchema,
    updatedBy: z.string().nullable().optional(),
  })
  .loose()
export type DamageCodePricing = z.infer<typeof damageCodePricingSchema>

export const damageCodeSchema = z
  .object({
    code: z.string().nullable().optional(),
    codeType: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    extCode: z.string().nullable().optional(),
    extId: z.string().nullable().optional(),
    fromDate: z.string().nullable().optional(),
    id: z.uuid().nullable().optional(),
    isDentalService: z.int().nullable().optional(),
    pricing: z.array(damageCodePricingSchema).optional(),
    status: damageCodeStatusSchema.optional(),
    thruDate: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
  })
  .loose()
export type DamageCode = z.infer<typeof damageCodeSchema>

export const damageCodeFormSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  codeType: z.string().optional(),
  description: z.string().optional(),
  extCode: z.string().optional(),
  extId: z.string().optional(),
  fromDate: z.date().optional(),
  status: damageCodeStatusSchema,
  thruDate: z.date().optional(),
  title: z.string().min(1, 'Title is required'),
})
export type DamageCodeForm = z.infer<typeof damageCodeFormSchema>

export const damageCodeRequestSchema = z
  .object({
    code: z.string().min(1),
    codeType: z.string().optional(),
    description: z.string().optional(),
    extCode: z.string().optional(),
    extId: z.string().optional(),
    fromDate: z.string().optional(),
    id: z.uuid().optional(),
    status: damageCodeStatusSchema,
    thruDate: z.string().optional(),
    title: z.string().min(1),
  })
  .strict()

export const damageCodePricingFormSchema = z.object({
  amount: z.number().min(0, 'Amount must be positive'),
  damageCodeId: z.uuid({ message: 'Damage code is required' }),
  fromDate: z.date().optional(),
  priceType: priceTypeSchema,
  thruDate: z.date().optional(),
  unit: z.string().optional(),
})
export type DamageCodePricingForm = z.infer<typeof damageCodePricingFormSchema>

export const damageCodePricingRequestSchema = z
  .object({
    amount: z.number().min(0),
    damageCodeId: z.uuid(),
    fromDate: z.string().optional(),
    id: z.uuid().optional(),
    priceType: priceTypeSchema,
    thruDate: z.string().optional(),
    unit: z.string().optional(),
  })
  .strict()

export const damageCodePageSchema = createPageResponseSchema(damageCodeSchema)
export const damageCodePageRequestSchema = createPageRequestSchema()
export type PageDamageCode = z.infer<typeof damageCodePageSchema>

export const damageCodePricingPageSchema = createPageResponseSchema(
  damageCodePricingSchema
)
export const damageCodePricingPageRequestSchema = createPageRequestSchema()
export type PageDamageCodePricing = z.infer<typeof damageCodePricingPageSchema>

const idPathSchema = z.object({ id: z.uuid() }).strict()
const optionalThruDateQuerySchema = z
  .object({ thruDate: z.string().optional() })
  .strict()

export const getDamageCodeRequestSchema = z
  .object({ path: idPathSchema })
  .strict()
export const createDamageCodeRequestSchema = damageCodeRequestSchema
export const updateDamageCodeRequestSchema = z
  .object({
    body: damageCodeRequestSchema.extend({ id: z.uuid() }),
    path: idPathSchema,
  })
  .strict()
export const deleteDamageCodeRequestSchema = getDamageCodeRequestSchema
export const softDeleteDamageCodesRequestSchema = z
  .object({
    body: z.array(z.uuid()).min(1),
    query: optionalThruDateQuerySchema,
  })
  .strict()
export const bulkDeleteDamageCodesRequestSchema = z.array(z.uuid()).min(1)

export const getDamageCodePricingRequestSchema = z
  .object({ path: idPathSchema })
  .strict()
export const createDamageCodePricingRequestSchema =
  damageCodePricingRequestSchema
export const updateDamageCodePricingRequestSchema = z
  .object({
    body: damageCodePricingRequestSchema.extend({ id: z.uuid() }),
    path: idPathSchema,
  })
  .strict()
export const deleteDamageCodePricingRequestSchema =
  getDamageCodePricingRequestSchema
export const softDeleteDamageCodePricingsRequestSchema = z
  .object({
    body: z.array(z.uuid()).min(1),
    query: optionalThruDateQuerySchema,
  })
  .strict()
export const bulkDeleteDamageCodePricingsRequestSchema = z
  .array(z.uuid())
  .min(1)

export const damageCodePricingPriceRequestSchema = z
  .object({
    damageCodeId: z.string(),
    policyId: z.number().int().optional(),
    priceType: priceTypeSchema,
    year: z.number().int().min(1300).max(2500),
  })
  .strict()
export const damageCodePricingPriceResponseSchema = z
  .object({
    overrideRatio: z.number().nullable().optional(),
    pricingList: z.array(damageCodePricingSchema).nullable().optional(),
  })
  .loose()
export type DamageCodePricingPriceRequest = z.infer<
  typeof damageCodePricingPriceRequestSchema
>
export type DamageCodePricingPriceResponse = z.infer<
  typeof damageCodePricingPriceResponseSchema
>

/** Reference name retained for consumers that use the pricing response contract. */
export const damageCodePricingResponseSchema =
  damageCodePricingPriceResponseSchema
export type DamageCodePricingResponse = z.infer<
  typeof damageCodePricingResponseSchema
>
