import { z } from 'zod'

import { docTypeSchema } from '../doc-type'

export type TranslationFn = (key: any, options?: any) => string

export const aiAssessmentRuleDefinitionTypes = [
  'GENERAL',
  'AGREEMENT_TEMPLATE',
  'CONTRACT',
  'POLICY',
] as const
export const aiAssessmentRuleDefinitionTypeSchema = z.enum(
  aiAssessmentRuleDefinitionTypes
)
export type AiAssessmentRuleDefinitionType = z.infer<
  typeof aiAssessmentRuleDefinitionTypeSchema
>

export const aiAssessmentRuleModels = [
  'NONE',
  'KAVAN_VISION_SMALL',
  'KAVAN_VISION_BIG',
  'KAVAN_TEXT_SMALL',
  'KAVAN_TEXT_BIG',
  'KAVAN_MEDICAL_SMALL',
  'KAVAN_MEDICAL_BIG',
] as const
export const aiAssessmentRuleModelSchema = z.enum(aiAssessmentRuleModels)
export type AiAssessmentRuleModel = z.infer<typeof aiAssessmentRuleModelSchema>

export const aiAssessmentRuleStatuses = ['ACTIVE', 'INACTIVE'] as const
export const aiAssessmentRuleStatusSchema = z.enum(aiAssessmentRuleStatuses)
export type AiAssessmentRuleStatus = z.infer<
  typeof aiAssessmentRuleStatusSchema
>

export const aiAssessmentRuleStates = [
  'CORE',
  'DUPLICATION',
  'IMAGE',
  'DOCS_VALIDATION',
  'CODE_DETECTION',
  'EXTRACTION',
  'HELP',
  'INFORMATION',
  'CALCULATION',
  'CALCULATION_VALIDATION',
  'AUTO_APPROVE',
  'ELIGIBLE',
] as const
export const aiAssessmentRuleStateSchema = z.enum(aiAssessmentRuleStates)
export type AiAssessmentRuleState = z.infer<typeof aiAssessmentRuleStateSchema>

export const aiAssessmentRuleAutomationLevels = [
  'HINT',
  'FULL_AUTO',
  'REQUIRE_APPROVE',
] as const
export const aiAssessmentRuleAutomationLevelSchema = z.enum(
  aiAssessmentRuleAutomationLevels
)
export type AiAssessmentRuleAutomationLevel = z.infer<
  typeof aiAssessmentRuleAutomationLevelSchema
>

export const aiAssessmentRuleAutomationLevelResponseSchema = z.object({
  automationLevel: aiAssessmentRuleAutomationLevelSchema.nullish(),
  minThreshold: z.number().nullish(),
  maxThreshold: z.number().nullish(),
})
export type AiAssessmentRuleAutomationLevelItem = z.infer<
  typeof aiAssessmentRuleAutomationLevelResponseSchema
>

export const automationLevelSchema = z.object({
  automationLevel: aiAssessmentRuleAutomationLevelSchema.optional(),
  minThreshold: z.number().optional(),
  maxThreshold: z.number().optional(),
})
export type AutomationLevel = z.infer<typeof automationLevelSchema>

export const aiAssessmentRuleDetailSchema = z.object({
  id: z.string().nullish(),
  prompt: z.string().nullish(),
  methodNames: z.string().nullish(),
  inputParams: z.string().nullish(),
  docType: docTypeSchema.nullish(),
  minThreshold: z.number().nullish(),
  maxThreshold: z.number().nullish(),
})
export type AiAssessmentRuleDetail = z.infer<
  typeof aiAssessmentRuleDetailSchema
>

const thresholdFormSchema = (t: TranslationFn) =>
  z
    .string()
    .regex(/^\d+$/, t('aiAssessmentRules.validation.number'))
    .refine(
      (value) => Number.isFinite(Number(value)),
      t('aiAssessmentRules.validation.number')
    )

const thresholdRangeSchema = (t: TranslationFn) =>
  z
    .object({
      minThreshold: thresholdFormSchema(t),
      maxThreshold: thresholdFormSchema(t),
    })
    .refine(
      ({ minThreshold, maxThreshold }) =>
        Number(minThreshold) <= Number(maxThreshold),
      {
        message: t('aiAssessmentRules.validation.maxThreshold'),
        path: ['maxThreshold'],
      }
    )

const optionalThresholdRangeSchema = (t: TranslationFn) =>
  z
    .object({
      maxThreshold: z
        .string()
        .refine(
          (value) => value === '' || /^\d+$/.test(value),
          t('aiAssessmentRules.validation.number')
        ),
      minThreshold: z
        .string()
        .refine(
          (value) => value === '' || /^\d+$/.test(value),
          t('aiAssessmentRules.validation.number')
        ),
    })
    .refine(
      ({ minThreshold, maxThreshold }) =>
        minThreshold === '' ||
        maxThreshold === '' ||
        Number(minThreshold) <= Number(maxThreshold),
      {
        message: t('aiAssessmentRules.validation.maxThreshold'),
        path: ['maxThreshold'],
      }
    )

export const aiAssessmentRuleDetailFormSchema = (t: TranslationFn) =>
  optionalThresholdRangeSchema(t).extend({
    docTypeCode: z.string(),
    inputParams: z.string().refine((value) => {
      try {
        JSON.parse(value)
        return true
      } catch {
        return false
      }
    }, t('aiAssessmentRules.validation.json')),
    methodNames: z.string(),
    prompt: z.string(),
  })
export type AiAssessmentRuleDetailForm = z.infer<
  ReturnType<typeof aiAssessmentRuleDetailFormSchema>
>

export const aiAssessmentRuleAutomationLevelFormSchema = (t: TranslationFn) =>
  thresholdRangeSchema(t).extend({
    automationLevel: aiAssessmentRuleAutomationLevelSchema,
  })
export type AiAssessmentRuleAutomationLevelForm = z.infer<
  ReturnType<typeof aiAssessmentRuleAutomationLevelFormSchema>
>

export const aiAssessmentRuleSkipRuleSchema = z.enum(['SKIP'])
export type AiAssessmentRuleSkipRule = z.infer<
  typeof aiAssessmentRuleSkipRuleSchema
>

export const aiAssessmentRuleSchema = z
  .object({
    agreementTemplateCode: z.string().nullish(),
    aiModel: aiAssessmentRuleModelSchema.nullish(),
    automationLevels: z
      .array(aiAssessmentRuleAutomationLevelResponseSchema)
      .nullish(),
    createdAt: z.string().nullish(),
    createdBy: z.string().nullish(),
    definitionType: aiAssessmentRuleDefinitionTypeSchema.nullish(),
    docTypes: z.array(docTypeSchema).nullish(),
    extContractId: z.number().int().nullish(),
    extPolicyId: z.number().int().nullish(),
    id: z.string().nullish(),
    inputParams: z.string().nullish(),
    methodNames: z.string().nullish(),
    ruleDetails: z.array(aiAssessmentRuleDetailSchema).nullish(),
    ruleState: aiAssessmentRuleStateSchema.nullish(),
    skipRule: aiAssessmentRuleSkipRuleSchema.nullish(),
    status: aiAssessmentRuleStatusSchema.nullish(),
    thruDate: z.string().nullish(),
    updatedAt: z.string().nullish(),
    updatedBy: z.string().nullish(),
  })
  .loose()
export type AiAssessmentRule = z.infer<typeof aiAssessmentRuleSchema>

export const pageAiAssessmentRuleSchema = z
  .object({
    content: z.array(aiAssessmentRuleSchema).nullish(),
    empty: z.boolean(),
    first: z.boolean(),
    last: z.boolean(),
    number: z.number(),
    numberOfElements: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
  })
  .loose()
export type PageAiAssessmentRule = z.infer<typeof pageAiAssessmentRuleSchema>

export const listAiAssessmentRulesRequestSchema = z.object({
  direction: z.enum(['ASC', 'DESC']).optional(),
  filters: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.array(z.string()), z.undefined()])
    )
    .default({}),
  page: z.number().int().nonnegative().default(0),
  size: z.number().int().positive().default(30),
  sort: z.string().optional(),
})
export type ListAiAssessmentRulesRequest = z.infer<
  typeof listAiAssessmentRulesRequestSchema
>

export const getAiAssessmentRuleRequestSchema = z.object({
  id: z.string().min(1),
})
export type GetAiAssessmentRuleRequest = z.infer<
  typeof getAiAssessmentRuleRequestSchema
>

export const bulkDeleteAiAssessmentRulesRequestSchema = z
  .array(z.string().min(1))
  .min(1)
export type BulkDeleteAiAssessmentRulesRequest = z.infer<
  typeof bulkDeleteAiAssessmentRulesRequestSchema
>

export const emptyAiAssessmentRuleActionResponseSchema = z
  .union([z.undefined(), z.literal('')])
  .transform(() => undefined)

export const createAiAssessmentRuleRequestSchema = z.object({
  agreementTemplateCode: z.string().optional(),
  aiModel: aiAssessmentRuleModelSchema.optional(),
  automationLevels: z.array(automationLevelSchema).optional(),
  definitionType: aiAssessmentRuleDefinitionTypeSchema.optional(),
  docTypes: z.array(docTypeSchema).optional(),
  extContractId: z.number().int().optional(),
  extPolicyId: z.number().int().optional(),
  id: z.string().optional(),
  inputParams: z.string().optional(),
  methodNames: z.string().optional(),
  ruleDetails: z.array(aiAssessmentRuleDetailSchema).optional(),
  ruleState: aiAssessmentRuleStateSchema.optional(),
  skipRule: aiAssessmentRuleSkipRuleSchema.optional(),
  status: aiAssessmentRuleStatusSchema.optional(),
  thruDate: z.string().optional(),
})
export type CreateAiAssessmentRuleRequest = z.infer<
  typeof createAiAssessmentRuleRequestSchema
>

export const aiAssessmentRuleFormSchema = (_t: TranslationFn) =>
  createAiAssessmentRuleRequestSchema
    .omit({
      automationLevels: true,
      ruleDetails: true,
    })
    .extend({
      aiModel: aiAssessmentRuleModelSchema,
      definitionType: aiAssessmentRuleDefinitionTypeSchema,
      docTypes: z.array(docTypeSchema).default([]),
      extContractId: z.string().optional(),
      extPolicyId: z.string().optional(),
      inputParams: z.string().refine((value) => {
        try {
          JSON.parse(value)
          return true
        } catch {
          return false
        }
      }, _t('aiAssessmentRules.validation.json')),
      ruleState: aiAssessmentRuleStateSchema,
      status: aiAssessmentRuleStatusSchema,
    })
export type AiAssessmentRuleForm = z.infer<
  ReturnType<typeof aiAssessmentRuleFormSchema>
>

export const updateAiAssessmentRuleRequestSchema = z.object({
  data: createAiAssessmentRuleRequestSchema,
  id: z.string().min(1),
})
export type UpdateAiAssessmentRuleRequest = z.infer<
  typeof updateAiAssessmentRuleRequestSchema
>
