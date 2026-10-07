import { z } from 'zod'

import { createPageRequestSchema, createPageResponseSchema } from '../common'

const uuidSchema = z.uuid()
const idPathSchema = z.object({ id: uuidSchema }).strict()
const optionalThruDateQuerySchema = z
  .object({ thruDate: z.string().optional() })
  .strict()

export const repetitiveResponseGroupSchema = z
  .object({
    createdAt: z.string().nullish(),
    createdBy: z.string().nullish(),
    id: uuidSchema.nullish(),
    seqNum: z.number().int().nullish(),
    title: z.string().nullish(),
    updatedAt: z.string().nullish(),
    updatedBy: z.string().nullish(),
  })
  .loose()
export type RepetitiveResponseGroup = z.infer<
  typeof repetitiveResponseGroupSchema
>

export const repetitiveResponseGroupListSchema = z.array(
  repetitiveResponseGroupSchema
)

export const repetitiveResponseGroupRequestSchema = z
  .object({
    seqNum: z.number().int().optional(),
    title: z.string().optional(),
  })
  .strict()
export type RepetitiveResponseGroupRequest = z.infer<
  typeof repetitiveResponseGroupRequestSchema
>

export const repetitiveResponseGroupPageSchema = createPageResponseSchema(
  repetitiveResponseGroupSchema
)
export type PageRepetitiveResponseGroup = z.infer<
  typeof repetitiveResponseGroupPageSchema
>

export const repetitiveResponseGroupPageRequestSchema =
  createPageRequestSchema().extend({
    size: z.number().int().positive().default(30),
  })

export const getRepetitiveResponseGroupRequestSchema = z
  .object({ path: idPathSchema })
  .strict()
export const createRepetitiveResponseGroupRequestSchema =
  repetitiveResponseGroupRequestSchema
export const updateRepetitiveResponseGroupRequestSchema = z
  .object({
    body: repetitiveResponseGroupRequestSchema,
    path: idPathSchema,
  })
  .strict()
export const deleteRepetitiveResponseGroupRequestSchema =
  getRepetitiveResponseGroupRequestSchema
export const softDeleteRepetitiveResponseGroupsRequestSchema = z
  .object({
    body: z.array(uuidSchema).min(1),
    query: optionalThruDateQuerySchema,
  })
  .strict()
export const bulkDeleteRepetitiveResponseGroupsRequestSchema = z
  .array(uuidSchema)
  .min(1)

export const repetitiveResponseSchema = z
  .object({
    createdAt: z.string().nullish(),
    createdBy: z.string().nullish(),
    description: z.string().nullish(),
    id: uuidSchema.nullish(),
    repetitiveResponseGroup: repetitiveResponseGroupSchema.nullish(),
    repetitiveResponseGroupId: uuidSchema.nullish(),
    seqNum: z.number().int().nullish(),
    title: z.string().nullish(),
    updatedAt: z.string().nullish(),
    updatedBy: z.string().nullish(),
    usageCount: z.number().int().nullish(),
  })
  .loose()
export type RepetitiveResponse = z.infer<typeof repetitiveResponseSchema>

export const repetitiveResponseListSchema = z.array(repetitiveResponseSchema)

export const repetitiveResponseRequestSchema = z
  .object({
    description: z.string().optional(),
    repetitiveResponseGroupId: uuidSchema.optional(),
    seqNum: z.number().int().optional(),
    title: z.string().optional(),
    usageCount: z.number().int().optional(),
  })
  .strict()
export type RepetitiveResponseRequest = z.infer<
  typeof repetitiveResponseRequestSchema
>

export const repetitiveResponsePageSchema = createPageResponseSchema(
  repetitiveResponseSchema
)
export type PageRepetitiveResponse = z.infer<
  typeof repetitiveResponsePageSchema
>

export const repetitiveResponsePageRequestSchema = createPageRequestSchema()

export const getRepetitiveResponseRequestSchema = z
  .object({ path: idPathSchema })
  .strict()
export const createRepetitiveResponseRequestSchema =
  repetitiveResponseRequestSchema
export const updateRepetitiveResponseRequestSchema = z
  .object({
    body: repetitiveResponseRequestSchema,
    path: idPathSchema,
  })
  .strict()
export const deleteRepetitiveResponseRequestSchema =
  getRepetitiveResponseRequestSchema
export const softDeleteRepetitiveResponsesRequestSchema = z
  .object({
    body: z.array(uuidSchema).min(1),
    query: optionalThruDateQuerySchema,
  })
  .strict()
export const bulkDeleteRepetitiveResponsesRequestSchema = z
  .array(uuidSchema)
  .min(1)
