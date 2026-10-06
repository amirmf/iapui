import {
  type AssignementRule,
  type AssignementRuleIds,
  type AssignementRulePageRequest,
  type AssignementRuleRequest,
  type AssignementRuleStatus,
  type PageAssignementRule,
  assignementRuleIdsSchema,
  assignementRulePageRequestSchema,
  assignementRuleRequestSchema,
  assignementRuleSchema,
  assignementRuleStatusSchema,
  pageAssignementRuleSchema,
} from '@iap/api-types'
import type { TFunction } from 'i18next'
import { z } from 'zod'

export {
  type AssignementRule,
  type AssignementRuleIds,
  type AssignementRulePageRequest,
  type AssignementRuleRequest,
  type AssignementRuleStatus,
  assignementRuleIdsSchema,
  type PageAssignementRule,
  assignementRulePageRequestSchema,
  assignementRuleRequestSchema,
  assignementRuleSchema,
  assignementRuleStatusSchema,
  pageAssignementRuleSchema,
}

const assignementRuleNumericFormFields = {
  amountApprovedMax: z.string().optional(),
  amountApprovedMin: z.string().optional(),
  amountMax: z.string().optional(),
  amountMin: z.string().optional(),
  extContractId: z.string().optional(),
  extPolicyId: z.string().optional(),
  extWorkUnitCode: z.string().optional(),
}

export const assignementRuleFormSchema = (t: TFunction) =>
  z.object({
    docTypeCode: z.string().trim().optional(),
    fromDate: z.date().nullable().optional(),
    mainAssignedUserUsername: z.string().trim().optional(),
    status: assignementRuleStatusSchema,
    thruDate: z.date().nullable().optional(),
    title: z.string().trim().min(1, t('assignementRules.errors.titleRequired')),
    ...assignementRuleNumericFormFields,
  })

export type AssignementRuleForm = z.infer<
  ReturnType<typeof assignementRuleFormSchema>
>
