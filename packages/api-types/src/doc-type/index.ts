import { z } from 'zod'

import { createPageRequestSchema, createPageResponseSchema } from '../common'

export const docTypeCodeSchema = z.string()
export const docTypeCodesSchema = z.array(docTypeCodeSchema)

export const docTypeResponseSchema = z
  .object({
    id: z.string().nullable().optional(),
    docType: z.string().nullable().optional(),
    docTypeCode: docTypeCodeSchema.nullable().optional(),
    prompt: z.string().nullable().optional(),
    documentGuide: z.string().nullable().optional(),
    dataJsonSchema: z.string().nullable().optional(),
    dataSubmissionExample: z.string().nullable().optional(),
    agreementCode: z.string().nullable().optional(),
    minThreshold: z.number().nullable().optional(),
    maxThreshold: z.number().nullable().optional(),
    maxThresholdItem: z.number().nullable().optional(),
    maxThresholdCountItem: z.number().nullable().optional(),
    sequence: z.number().int().nullable().optional(),
    deleteDate: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
    ceilingControlDamageCode: z.string().nullable().optional(),
    ceilingControlErrorDescription: z.string().nullable().optional(),
    noCoverageErrorDescription: z.string().nullable().optional(),
  })
  .loose()
export const docTypeSchema = docTypeResponseSchema
export type DocType = z.infer<typeof docTypeSchema>
export const docTypeRequestSchema = docTypeResponseSchema
export type DocTypeRequest = z.infer<typeof docTypeRequestSchema>
export const updateDocTypePayloadSchema = docTypeRequestSchema.partial()
export type UpdateDocTypeRequest = z.infer<typeof updateDocTypePayloadSchema>
const toOptionalNumber = (value: unknown) => {
  if (value === '' || value === null || value === undefined) return undefined
  if (typeof value === 'number') return value
  const parsed = Number(value)
  return Number.isNaN(parsed) ? Number.NaN : parsed
}
const optionalNumberField = (message: string) =>
  z
    .preprocess(toOptionalNumber, z.number().optional())
    .refine((value) => value === undefined || !Number.isNaN(value), message)
export const docTypeFormSchema = z.object({
  ceilingControlDamageCode: z.string().nullable().optional(),
  ceilingControlErrorDescription: z.string().nullable().optional(),
  dataJsonSchema: z
    .string()
    .min(2, 'Data JSON Schema is required')
    .refine((value) => {
      try {
        JSON.parse(value)
        return true
      } catch {
        return false
      }
    }, 'Invalid JSON format'),
  docType: z.string().min(1, 'Doc type is required'),
  docTypeCode: docTypeCodeSchema.min(1, 'Doc type code is required'),
  documentGuide: z.string().optional(),
  maxThreshold: optionalNumberField('Max threshold must be a number'),
  maxThresholdCountItem: optionalNumberField(
    'Max threshold count item must be a number'
  ),
  maxThresholdItem: optionalNumberField('Max threshold item must be a number'),
  minThreshold: optionalNumberField('Min threshold must be a number'),
  noCoverageErrorDescription: z.string().nullable().optional(),
  prompt: z.string().min(1, 'Prompt is required'),
  sequence: optionalNumberField('Sequence must be a number'),
})
export type DocTypeForm = z.infer<typeof docTypeFormSchema>
export const docTypeInlineFormSchema = docTypeFormSchema.extend({
  dataJsonSchema: z.string().optional(),
  dataSubmissionExample: z.string().optional(),
})
export type DocTypeInlineForm = z.infer<typeof docTypeInlineFormSchema>
export const pageDocTypeSchema = createPageResponseSchema(docTypeSchema)
export type PageDocType = z.infer<typeof pageDocTypeSchema>

export const docTypePageSchema = pageDocTypeSchema
export const docTypePageRequestSchema = createPageRequestSchema()
const docTypeIdPathSchema = z.object({ id: z.string() }).strict()
const optionalThruDateQuerySchema = z
  .object({ thruDate: z.string().optional() })
  .strict()
export const getDocTypeRequestSchema = z
  .object({ path: docTypeIdPathSchema })
  .strict()
const docTypeMutationPayloadSchema = docTypeRequestSchema.extend({
  id: z.string(),
})
export const createDocTypeRequestSchema = docTypeRequestSchema
export const updateDocTypeRequestSchema = z
  .object({ body: docTypeMutationPayloadSchema, path: docTypeIdPathSchema })
  .strict()
export const updateDocTypeInlineRequestSchema = updateDocTypeRequestSchema
export const updateDocTypeSchemaRequestSchema = z
  .object({
    body: docTypeRequestSchema
      .pick({ dataJsonSchema: true })
      .extend({ id: z.string() }),
    path: docTypeIdPathSchema,
  })
  .strict()
export const updateDocTypeSubmissionExampleRequestSchema = z
  .object({
    body: docTypeRequestSchema
      .pick({ dataSubmissionExample: true })
      .extend({ id: z.string() }),
    path: docTypeIdPathSchema,
  })
  .strict()
export const deleteDocTypeRequestSchema = getDocTypeRequestSchema
export const softDeleteDocTypesRequestSchema = z
  .object({ body: z.array(z.string()), query: optionalThruDateQuerySchema })
  .strict()
export const bulkDeleteDocTypesRequestSchema = z.array(z.string())
