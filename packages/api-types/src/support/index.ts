import { z } from 'zod'

import { createPageResponseSchema } from '../common'

const supportParametersContextValueSchema = z.union([
  z.object({}).loose(),
  z.string(),
  z.array(z.string()),
])

export const supportParametersContextSchema = z.record(
  z.string(),
  supportParametersContextValueSchema
)

export const supportFlowRequestSchema = z.object({
  featureKeys: z.array(z.string()).optional(),
  optionsPage: z.number().int().optional(),
  optionsSize: z.number().int().optional(),
  pageKey: z.string().optional(),
  parametersContext: supportParametersContextSchema.optional(),
  questionStack: z.array(z.string()).optional(),
  selectedQuestionKey: z.string().optional(),
  userPrompt: z.string().optional(),
})

export const supportOptionSchema = z.object({
  amount: z.number().nullable().optional(),
  businessKey: z.number().int().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  displayName: z.string().nullable().optional(),
  expectedAnswerTime: z.string().nullable().optional(),
  id: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  submitDate: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
})

export const supportOptionsPageSchema =
  createPageResponseSchema(supportOptionSchema)

export const supportRequiredParamInputDisplaySchema = z.enum([
  'TEXT',
  'LIST',
  'NOINPUT',
])
export type SupportRequiredParamInputDisplay = z.infer<
  typeof supportRequiredParamInputDisplaySchema
>

export const supportFlowResponseSchema = z.object({
  nextSelectableQuestionKeys: z
    .array(
      z.object({
        key: z.string().nullable().optional(),
        requiredParam: z.string().nullable().optional(),
        title: z.string().nullable().optional(),
      })
    )
    .optional(),
  parametersContext: supportParametersContextSchema.optional(),
  questionStack: z.array(z.string()).optional(),
  response: z
    .object({
      message: z.string().nullable().optional(),
      options: supportOptionsPageSchema.nullable().optional(),
      requiredParam: z.string().nullable().optional(),
      requiredParamInputDisplay: supportRequiredParamInputDisplaySchema
        .nullable()
        .optional(),
    })
    .optional(),
})

export type SupportFlowRequest = z.infer<typeof supportFlowRequestSchema>
export type SupportFlowResponse = z.infer<typeof supportFlowResponseSchema>
export type SupportOption = z.infer<typeof supportOptionSchema>

// ==========================================
// Support Questions API Contracts
// ==========================================

const supportQuestionIdPathSchema = z.object({ id: z.string().min(1) })
const supportQuestionFiltersSchema = z.record(
  z.string(),
  z.union([z.string(), z.array(z.string()), z.number(), z.undefined()])
)
const supportQuestionSortDirectionSchema = z.enum([
  'ASC',
  'DESC',
  'asc',
  'desc',
])

export const supportQuestionSchema = z.object({
  id: z.string().nullable().optional(),
  questionKey: z.string(),
  title: z.string().nullable().optional(),
  staticResponse: z.string().nullable().optional(),
  level: z.number().int().nullable().optional(),
  requiredParam: z.string().nullable().optional(),
  requiredParamInputDisplay: supportRequiredParamInputDisplaySchema
    .nullable()
    .optional(),
  sequence: z.number().int().nullable().optional(),
  nextSelectableQuestionKeys: z.array(z.string()).nullable().optional(),
  roles: z.array(z.string()).nullable().optional(),
  pageTags: z.array(z.string()).nullable().optional(),
  featureTags: z.array(z.string()).nullable().optional(),
  active: z.boolean().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type SupportQuestion = z.infer<typeof supportQuestionSchema>
export const supportQuestionListSchema = z.array(supportQuestionSchema)

export const pageSupportQuestionSchema = z
  .object({
    content: z.array(supportQuestionSchema).nullable().optional(),
    totalElements: z.number().int().nullable().optional(),
    totalPages: z.number().int().nullable().optional(),
    size: z.number().int().nullable().optional(),
    number: z.number().int().nullable().optional(),
    sort: z
      .object({
        empty: z.boolean().nullable().optional(),
        sorted: z.boolean().nullable().optional(),
        unsorted: z.boolean().nullable().optional(),
      })
      .nullable()
      .optional(),
    pageable: z
      .object({
        offset: z.number().int().nullable().optional(),
        pageNumber: z.number().int().nullable().optional(),
        pageSize: z.number().int().nullable().optional(),
        paged: z.boolean().nullable().optional(),
        unpaged: z.boolean().nullable().optional(),
      })
      .nullable()
      .optional(),
    first: z.boolean().nullable().optional(),
    last: z.boolean().nullable().optional(),
    numberOfElements: z.number().int().nullable().optional(),
    empty: z.boolean().nullable().optional(),
  })
  .loose()

export type PageSupportQuestion = z.infer<typeof pageSupportQuestionSchema>

export const supportQuestionPayloadSchema = z.object({
  questionKey: z.string().min(1),
  title: z.string().optional(),
  staticResponse: z.string().optional(),
  level: z.number().int().optional(),
  requiredParam: z.string().optional(),
  requiredParamInputDisplay: supportRequiredParamInputDisplaySchema.optional(),
  sequence: z.number().int().optional(),
  nextSelectableQuestionKeys: z.array(z.string()).optional(),
  roles: z.array(z.string()).optional(),
  pageTags: z.array(z.string()).optional(),
  featureTags: z.array(z.string()).optional(),
  active: z.boolean().optional(),
})
export const createSupportQuestionSchema = supportQuestionPayloadSchema

export const updateSupportQuestionPayloadSchema =
  supportQuestionPayloadSchema.extend({ id: z.string().min(1) })

export const updateSupportQuestionSchema = z.object({
  path: supportQuestionIdPathSchema,
  body: updateSupportQuestionPayloadSchema,
})

export type CreateSupportQuestionPayload = z.infer<
  typeof createSupportQuestionSchema
>
export type UpdateSupportQuestionPayload = z.infer<
  typeof updateSupportQuestionPayloadSchema
>

export const listSupportQuestionsRequestSchema = z.object({
  sort: z.string().optional(),
  direction: supportQuestionSortDirectionSchema.optional(),
  filters: supportQuestionFiltersSchema,
})

export const supportQuestionPageRequestSchema =
  listSupportQuestionsRequestSchema.extend({
    page: z.number().int().optional(),
    size: z.number().int().optional(),
  })

export const getSupportQuestionRequestSchema = z.object({
  path: supportQuestionIdPathSchema,
})

export const deleteSupportQuestionRequestSchema =
  getSupportQuestionRequestSchema

export const bulkDeleteSupportQuestionsRequestSchema = z.array(
  z.string().min(1)
)

export const emptySupportQuestionActionResponseSchema = z
  .union([z.undefined(), z.null(), z.literal('')])
  .transform(() => undefined)

export type ListSupportQuestionsRequest = z.infer<
  typeof listSupportQuestionsRequestSchema
>
export type SupportQuestionPageRequest = z.infer<
  typeof supportQuestionPageRequestSchema
>

// ==========================================
// Support Pages API Contracts
// ==========================================

const supportPageIdSchema = z.object({ id: z.string().min(1) })
const supportPageFiltersSchema = z.record(z.string(), z.string())

export const supportPageSchema = z.object({
  id: z.string().nullable().optional(),
  pageKey: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  active: z.boolean().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
})
export type SupportPage = z.infer<typeof supportPageSchema>
export const supportPageListSchema = z.array(supportPageSchema)

export const pageSupportPageSchema = z
  .object({
    content: z.array(supportPageSchema).nullable().optional(),
    totalElements: z.number().int().nullable().optional(),
    totalPages: z.number().int().nullable().optional(),
    size: z.number().int().nullable().optional(),
    number: z.number().int().nullable().optional(),
    first: z.boolean().nullable().optional(),
    last: z.boolean().nullable().optional(),
    numberOfElements: z.number().int().nullable().optional(),
    empty: z.boolean().nullable().optional(),
  })
  .loose()
export type PageSupportPage = z.infer<typeof pageSupportPageSchema>

export const supportPagePayloadSchema = z.object({
  pageKey: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  active: z.boolean().optional(),
})
export type SupportPagePayload = z.infer<typeof supportPagePayloadSchema>

export const updateSupportPagePayloadSchema = supportPagePayloadSchema.extend({
  id: z.string().min(1),
})
export type UpdateSupportPagePayload = z.infer<
  typeof updateSupportPagePayloadSchema
>

export const supportPageRequestSchema = z.object({
  page: z.number().int().optional(),
  size: z.number().int().optional(),
  sort: z.string().optional(),
  direction: z.enum(['ASC', 'DESC', 'asc', 'desc']).optional(),
  filters: supportPageFiltersSchema,
})
export type SupportPageRequest = z.infer<typeof supportPageRequestSchema>

export const supportPageByIdRequestSchema = z.object({
  path: supportPageIdSchema,
})
export const updateSupportPageRequestSchema = z.object({
  path: supportPageIdSchema,
  body: updateSupportPagePayloadSchema,
})
export const emptySupportPageActionResponseSchema = z
  .union([z.undefined(), z.null(), z.literal('')])
  .transform(() => undefined)

// ==========================================
// Support Features API Contracts
// ==========================================

const supportFeatureIdSchema = z.object({ id: z.string().min(1) })
const supportFeatureFiltersSchema = z.record(z.string(), z.string())

export const supportFeatureSchema = z.object({
  id: z.string().nullable().optional(),
  featureKey: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  pageKeys: z.array(z.string()).nullable().optional(),
  active: z.boolean().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
})
export type SupportFeature = z.infer<typeof supportFeatureSchema>
export const supportFeatureListSchema = z.array(supportFeatureSchema)

export const pageSupportFeatureSchema = z
  .object({
    content: z.array(supportFeatureSchema).nullable().optional(),
    totalElements: z.number().int().nullable().optional(),
    totalPages: z.number().int().nullable().optional(),
    size: z.number().int().nullable().optional(),
    number: z.number().int().nullable().optional(),
    first: z.boolean().nullable().optional(),
    last: z.boolean().nullable().optional(),
    numberOfElements: z.number().int().nullable().optional(),
    empty: z.boolean().nullable().optional(),
  })
  .loose()
export type PageSupportFeature = z.infer<typeof pageSupportFeatureSchema>

export const supportFeaturePayloadSchema = z.object({
  featureKey: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  pageKeys: z.array(z.string()).optional(),
  active: z.boolean().optional(),
})
export type SupportFeaturePayload = z.infer<typeof supportFeaturePayloadSchema>

export const updateSupportFeaturePayloadSchema =
  supportFeaturePayloadSchema.extend({ id: z.string().min(1) })
export type UpdateSupportFeaturePayload = z.infer<
  typeof updateSupportFeaturePayloadSchema
>

export const supportFeatureRequestSchema = z.object({
  page: z.number().int().optional(),
  size: z.number().int().optional(),
  sort: z.string().optional(),
  direction: z.enum(['ASC', 'DESC', 'asc', 'desc']).optional(),
  filters: supportFeatureFiltersSchema,
})
export type SupportFeatureRequest = z.infer<typeof supportFeatureRequestSchema>

export const supportFeatureByIdRequestSchema = z.object({
  path: supportFeatureIdSchema,
})
export const updateSupportFeatureRequestSchema = z.object({
  path: supportFeatureIdSchema,
  body: updateSupportFeaturePayloadSchema,
})
export const emptySupportFeatureActionResponseSchema = z
  .union([z.undefined(), z.null(), z.literal('')])
  .transform(() => undefined)
