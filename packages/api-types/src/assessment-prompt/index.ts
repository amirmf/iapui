import { z } from 'zod'

import { agreementSchema } from './agreement'

export const assessmentPromptRuleStateSchema = z.enum([
  'PRELIMINARY',
  'SECONDARY',
  'CALCULATION',
  'DISPLAY',
])
export type AssessmentPromptRuleState = z.infer<
  typeof assessmentPromptRuleStateSchema
>

export const assessmentPromptStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'PENDING',
])
export type AssessmentPromptStatus = z.infer<
  typeof assessmentPromptStatusSchema
>

export const assessmentPromptPlaceTypeSchema = z.enum([
  'HOSPITAL',
  'CLINIC',
  'SURGERY_CENTER',
])
export type AssessmentPromptPlaceType = z.infer<
  typeof assessmentPromptPlaceTypeSchema
>

const assessmentPromptDtoSchema = z.object({
  id: z.uuid().nullish(),
  title: z.string().nullish(),
  prompt: z.string().nullish(),
  agreementId: z.uuid().nullish(),
  ruleState: assessmentPromptRuleStateSchema.nullish(),
  status: assessmentPromptStatusSchema.nullish(),
  placeType: assessmentPromptPlaceTypeSchema.nullish(),
  docTypeCode: z.string().nullish(),
  inputParams: z.string().nullish(),
  methodNames: z.string().nullish(),
  fromDate: z.string().nullish(),
  thruDate: z.string().nullish(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
  createdBy: z.string().nullish(),
  updatedBy: z.string().nullish(),
})

export const assessmentPromptSchema = assessmentPromptDtoSchema
  .extend({ agreement: agreementSchema.nullish() })
  .loose()
export type AssessmentPrompt = z.infer<typeof assessmentPromptSchema>

export const assessmentPromptListSchema = z.array(assessmentPromptSchema)

const sortSchema = z
  .object({
    empty: z.boolean().nullish(),
    sorted: z.boolean().nullish(),
    unsorted: z.boolean().nullish(),
  })
  .strip()

const pageableSchema = z
  .object({
    offset: z.number().nullish(),
    sort: sortSchema.nullish(),
    pageNumber: z.number().int().nullish(),
    pageSize: z.number().int().nullish(),
    paged: z.boolean().nullish(),
    unpaged: z.boolean().nullish(),
  })
  .strip()

export const pageAssessmentPromptSchema = z
  .object({
    content: assessmentPromptListSchema.nullish(),
    totalElements: z.number().nullish(),
    totalPages: z.number().int().nullish(),
    size: z.number().int().nullish(),
    number: z.number().int().nullish(),
    sort: sortSchema.nullish(),
    pageable: pageableSchema.nullish(),
    first: z.boolean().nullish(),
    last: z.boolean().nullish(),
    numberOfElements: z.number().int().nullish(),
    empty: z.boolean().nullish(),
  })
  .loose()
export type PageAssessmentPrompt = z.infer<typeof pageAssessmentPromptSchema>

export const pageAssessmentPromptsRequestSchema = z
  .object({
    page: z.number().int().optional(),
    size: z.number().int().optional(),
    filters: z.record(
      z.string(),
      z.union([z.string(), z.number(), z.array(z.string()), z.undefined()])
    ),
  })
  .strip()
export type PageAssessmentPromptsRequest = z.infer<
  typeof pageAssessmentPromptsRequestSchema
>

const assessmentPromptIdPathSchema = z.object({ id: z.string().uuid() }).strip()
const optionalThruDateQuerySchema = z
  .object({ thruDate: z.string().optional() })
  .strip()

export const listAssessmentPromptsRequestSchema = z
  .object({
    sort: z.string().optional(),
    direction: z.string().optional(),
  })
  .strip()
export type ListAssessmentPromptsRequest = z.infer<
  typeof listAssessmentPromptsRequestSchema
>

export const getAssessmentPromptRequestSchema = z
  .object({ path: assessmentPromptIdPathSchema })
  .strip()
export type GetAssessmentPromptRequest = z.infer<
  typeof getAssessmentPromptRequestSchema
>

export const createAssessmentPromptRequestSchema = assessmentPromptDtoSchema
export type CreateAssessmentPromptRequest = z.infer<
  typeof createAssessmentPromptRequestSchema
>

export const updateAssessmentPromptRequestSchema = z
  .object({
    path: assessmentPromptIdPathSchema,
    body: createAssessmentPromptRequestSchema,
  })
  .strip()
export type UpdateAssessmentPromptRequest = z.infer<
  typeof updateAssessmentPromptRequestSchema
>

export const deleteAssessmentPromptRequestSchema =
  getAssessmentPromptRequestSchema
export type DeleteAssessmentPromptRequest = z.infer<
  typeof deleteAssessmentPromptRequestSchema
>

export const softDeleteAssessmentPromptRequestSchema = z
  .object({
    path: assessmentPromptIdPathSchema,
    query: optionalThruDateQuerySchema,
  })
  .strip()
export type SoftDeleteAssessmentPromptRequest = z.infer<
  typeof softDeleteAssessmentPromptRequestSchema
>

export const softDeleteAssessmentPromptsRequestSchema = z
  .object({
    body: z.array(z.string().uuid()),
    query: optionalThruDateQuerySchema,
  })
  .strip()
export type SoftDeleteAssessmentPromptsRequest = z.infer<
  typeof softDeleteAssessmentPromptsRequestSchema
>

export const bulkDeleteAssessmentPromptsRequestSchema = z.array(
  z.string().uuid()
)
export type BulkDeleteAssessmentPromptsRequest = z.infer<
  typeof bulkDeleteAssessmentPromptsRequestSchema
>

export const emptyAssessmentPromptActionResponseSchema = z
  .union([z.undefined(), z.literal('')])
  .transform(() => undefined)

export const assessmentPromptFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  prompt: z.string().min(1, 'Prompt is required'),
  agreementId: z.string().uuid('Agreement is required').optional(),
  ruleState: assessmentPromptRuleStateSchema,
  status: assessmentPromptStatusSchema,
  placeType: assessmentPromptPlaceTypeSchema.nullable(),
  docTypeCode: z.string().optional().nullable(),
  methodNames: z.string().optional().nullable(),
  inputParams: z.string().optional().nullable(),
  fromDate: z.date(),
  thruDate: z.date().optional(),
})
export type AssessmentPromptForm = z.infer<typeof assessmentPromptFormSchema>
