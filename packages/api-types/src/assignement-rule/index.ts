import { z } from 'zod'

import { createPageRequestSchema, createPageResponseSchema } from '../common'

export const assignementRuleIdSchema = z.uuid()

export const assignementRuleStatusSchema = z.enum(['ACTIVE', 'INACTIVE'])
export type AssignementRuleStatus = z.infer<typeof assignementRuleStatusSchema>

export const assignementRuleSchema = z
  .object({
    id: assignementRuleIdSchema.nullish(),
    title: z.string().nullish(),
    docTypeCode: z.string().nullish(),
    extPolicyId: z.number().int().nullish(),
    extContractId: z.number().int().nullish(),
    extWorkUnitCode: z.number().int().nullish(),
    mainAssignedUserUsername: z.string().nullish(),
    amountMin: z.number().nullish(),
    amountMax: z.number().nullish(),
    amountApprovedMin: z.number().nullish(),
    amountApprovedMax: z.number().nullish(),
    status: assignementRuleStatusSchema.nullish(),
    fromDate: z.string().nullish(),
    thruDate: z.string().nullish(),
    createdAt: z.string().nullish(),
    updatedAt: z.string().nullish(),
    createdBy: z.string().nullish(),
    updatedBy: z.string().nullish(),
  })
  .loose()

export type AssignementRule = z.infer<typeof assignementRuleSchema>

export const pageAssignementRuleSchema = createPageResponseSchema(
  assignementRuleSchema
)
export type PageAssignementRule = z.infer<typeof pageAssignementRuleSchema>

export const assignementRulePageRequestSchema = createPageRequestSchema()
export type AssignementRulePageRequest = z.infer<
  typeof assignementRulePageRequestSchema
>

export const assignementRuleRequestSchema = z.strictObject({
  title: z.string().trim().min(1),
  docTypeCode: z.string().trim().optional(),
  extPolicyId: z.number().int().optional(),
  extContractId: z.number().int().optional(),
  extWorkUnitCode: z.number().int().optional(),
  mainAssignedUserUsername: z.string().trim().optional(),
  amountMin: z.number().optional(),
  amountMax: z.number().optional(),
  amountApprovedMin: z.number().optional(),
  amountApprovedMax: z.number().optional(),
  status: assignementRuleStatusSchema,
  fromDate: z.date().nullish(),
  thruDate: z.date().nullish(),
})

export type AssignementRuleRequest = z.infer<
  typeof assignementRuleRequestSchema
>

export const assignementRuleIdsSchema = z.array(assignementRuleIdSchema).min(1)
export type AssignementRuleIds = z.infer<typeof assignementRuleIdsSchema>
export const bulkDeleteAssignementRulesRequestSchema = assignementRuleIdsSchema
