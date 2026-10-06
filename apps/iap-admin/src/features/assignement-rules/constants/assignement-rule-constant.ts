import type { AssignementRuleStatus } from '@iap/api-types'
import type { TFunction } from 'i18next'

export const ASSIGNEMENT_RULE_STATUS_TRANSLATION_KEYS = {
  ACTIVE: 'assignementRules.status.active',
  INACTIVE: 'assignementRules.status.inactive',
} as const satisfies Record<
  AssignementRuleStatus,
  'assignementRules.status.active' | 'assignementRules.status.inactive'
>

export const assignementRuleStatusTranslationKeys =
  ASSIGNEMENT_RULE_STATUS_TRANSLATION_KEYS

export const assignementRuleStatusBadgeColors: Record<
  AssignementRuleStatus,
  string
> = {
  ACTIVE: 'border-emerald-200 text-emerald-700',
  INACTIVE: 'border-slate-200 text-slate-600',
}

export function getAssignementRuleStatusOptions(
  t: TFunction
): Array<{ label: string; value: AssignementRuleStatus }> {
  return (['ACTIVE', 'INACTIVE'] as const).map((status) => ({
    label: String(t(assignementRuleStatusTranslationKeys[status] as never)),
    value: status,
  }))
}
