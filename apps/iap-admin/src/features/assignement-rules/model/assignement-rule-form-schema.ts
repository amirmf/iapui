import { assignementRuleStatusSchema } from '@iap/api-types'
import type { TFunction } from 'i18next'
import { z } from 'zod'

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
    fromDate: z.date().nullish(),
    mainAssignedUserUsername: z.string().trim().optional(),
    status: assignementRuleStatusSchema,
    thruDate: z.date().nullish(),
    title: z.string().trim().min(1, t('assignementRules.errors.titleRequired')),
    ...assignementRuleNumericFormFields,
  })

export type AssignementRuleForm = z.infer<
  ReturnType<typeof assignementRuleFormSchema>
>
