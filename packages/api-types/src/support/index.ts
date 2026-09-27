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

export const supportRequiredParamInputDisplaySchema = z.enum(['LIST', 'TEXT'])

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
