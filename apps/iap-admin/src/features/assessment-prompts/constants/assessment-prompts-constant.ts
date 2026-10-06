import type {
  AssessmentPromptPlaceType,
  AssessmentPromptRuleState,
  AssessmentPromptStatus,
} from '@iap/api-types'
import type { TFunction } from 'i18next'

export const ASSESSMENT_PROMPT_RULE_STATE_TRANSLATION_KEYS: Record<
  AssessmentPromptRuleState,
  `assessmentPrompts.ruleState.${string}`
> = {
  PRELIMINARY: 'assessmentPrompts.ruleState.preliminary',
  SECONDARY: 'assessmentPrompts.ruleState.secondary',
  CALCULATION: 'assessmentPrompts.ruleState.calculation',
  DISPLAY: 'assessmentPrompts.ruleState.display',
}

export const ASSESSMENT_PROMPT_STATUS_TRANSLATION_KEYS: Record<
  AssessmentPromptStatus,
  `assessmentPrompts.status.${string}`
> = {
  ACTIVE: 'assessmentPrompts.status.active',
  INACTIVE: 'assessmentPrompts.status.inactive',
  SUSPENDED: 'assessmentPrompts.status.suspended',
  PENDING: 'assessmentPrompts.status.pending',
}

export const ASSESSMENT_PROMPT_PLACE_TYPE_TRANSLATION_KEYS: Record<
  AssessmentPromptPlaceType,
  `assessmentPrompts.placeType.${string}`
> = {
  HOSPITAL: 'assessmentPrompts.placeType.hospital',
  CLINIC: 'assessmentPrompts.placeType.clinic',
  SURGERY_CENTER: 'assessmentPrompts.placeType.surgeryCenter',
}

export function getAssessmentPromptRuleStateOptions(t: TFunction) {
  const items: AssessmentPromptRuleState[] = [
    'PRELIMINARY',
    'SECONDARY',
    'CALCULATION',
    'DISPLAY',
  ]
  return items.map((value) => ({
    label: t(ASSESSMENT_PROMPT_RULE_STATE_TRANSLATION_KEYS[value] as never),
    value,
  }))
}

export function getAssessmentPromptStatusOptions(t: TFunction) {
  const items: AssessmentPromptStatus[] = [
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'PENDING',
  ]
  return items.map((value) => ({
    label: t(ASSESSMENT_PROMPT_STATUS_TRANSLATION_KEYS[value] as never),
    value,
  }))
}

export function getAssessmentPromptPlaceTypeOptions(t: TFunction) {
  const items: AssessmentPromptPlaceType[] = [
    'HOSPITAL',
    'CLINIC',
    'SURGERY_CENTER',
  ]
  return items.map((value) => ({
    label: t(ASSESSMENT_PROMPT_PLACE_TYPE_TRANSLATION_KEYS[value] as never),
    value,
  }))
}
