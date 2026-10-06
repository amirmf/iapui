import type {
  AiAssessmentRuleAutomationLevel,
  AiAssessmentRuleDefinitionType,
  AiAssessmentRuleModel,
  AiAssessmentRuleSkipRule,
  AiAssessmentRuleState,
  AiAssessmentRuleStatus,
} from '@iap/api-types'
import type { TFunction } from 'i18next'

export const AI_ASSESSMENT_RULE_DEFINITION_TYPE_TRANSLATION_KEYS: Record<
  AiAssessmentRuleDefinitionType,
  `aiAssessmentRules.enums.definitionTypes.${string}`
> = {
  AGREEMENT_TEMPLATE:
    'aiAssessmentRules.enums.definitionTypes.agreementTemplate',
  CONTRACT: 'aiAssessmentRules.enums.definitionTypes.contract',
  GENERAL: 'aiAssessmentRules.enums.definitionTypes.general',
  POLICY: 'aiAssessmentRules.enums.definitionTypes.policy',
}

export const AI_ASSESSMENT_RULE_MODEL_TRANSLATION_KEYS: Record<
  AiAssessmentRuleModel,
  `aiAssessmentRules.enums.models.${string}`
> = {
  KAVAN_MEDICAL_BIG: 'aiAssessmentRules.enums.models.kavanMedicalBig',
  KAVAN_MEDICAL_SMALL: 'aiAssessmentRules.enums.models.kavanMedicalSmall',
  KAVAN_TEXT_BIG: 'aiAssessmentRules.enums.models.kavanTextBig',
  KAVAN_TEXT_SMALL: 'aiAssessmentRules.enums.models.kavanTextSmall',
  KAVAN_VISION_BIG: 'aiAssessmentRules.enums.models.kavanVisionBig',
  KAVAN_VISION_SMALL: 'aiAssessmentRules.enums.models.kavanVisionSmall',
  NONE: 'aiAssessmentRules.enums.models.none',
}

export const AI_ASSESSMENT_RULE_STATUS_TRANSLATION_KEYS: Record<
  AiAssessmentRuleStatus,
  `aiAssessmentRules.enums.status.${string}`
> = {
  ACTIVE: 'aiAssessmentRules.enums.status.active',
  INACTIVE: 'aiAssessmentRules.enums.status.inactive',
}

export const AI_ASSESSMENT_RULE_STATUS_COLORS: Record<
  AiAssessmentRuleStatus,
  string
> = {
  ACTIVE: 'border-green-200 bg-green-100/30 text-green-900 dark:text-green-200',
  INACTIVE: 'border-gray-200 bg-gray-100/30 text-gray-900 dark:text-gray-200',
}

export const AI_ASSESSMENT_RULE_STATE_TRANSLATION_KEYS: Record<
  AiAssessmentRuleState,
  `aiAssessmentRules.enums.ruleStates.${string}`
> = {
  AUTO_APPROVE: 'aiAssessmentRules.enums.ruleStates.autoApprove',
  CALCULATION: 'aiAssessmentRules.enums.ruleStates.calculation',
  CALCULATION_VALIDATION:
    'aiAssessmentRules.enums.ruleStates.calculationValidation',
  CODE_DETECTION: 'aiAssessmentRules.enums.ruleStates.codeDetection',
  CORE: 'aiAssessmentRules.enums.ruleStates.core',
  DOCS_VALIDATION: 'aiAssessmentRules.enums.ruleStates.docsValidation',
  DUPLICATION: 'aiAssessmentRules.enums.ruleStates.duplication',
  ELIGIBLE: 'aiAssessmentRules.enums.ruleStates.eligible',
  EXTRACTION: 'aiAssessmentRules.enums.ruleStates.extraction',
  HELP: 'aiAssessmentRules.enums.ruleStates.help',
  IMAGE: 'aiAssessmentRules.enums.ruleStates.image',
  INFORMATION: 'aiAssessmentRules.enums.ruleStates.information',
}

export const AI_ASSESSMENT_RULE_AUTOMATION_LEVEL_TRANSLATION_KEYS: Record<
  AiAssessmentRuleAutomationLevel,
  `aiAssessmentRules.enums.automationLevels.${string}`
> = {
  FULL_AUTO: 'aiAssessmentRules.enums.automationLevels.fullAuto',
  HINT: 'aiAssessmentRules.enums.automationLevels.hint',
  REQUIRE_APPROVE: 'aiAssessmentRules.enums.automationLevels.requireApprove',
}

export const AI_ASSESSMENT_RULE_SKIP_RULE_TRANSLATION_KEYS: Record<
  AiAssessmentRuleSkipRule,
  `aiAssessmentRules.enums.skipRules.${string}`
> = {
  SKIP: 'aiAssessmentRules.enums.skipRules.skip',
}

const toOptions = <T extends string>(
  translationKeys: Record<T, string>,
  t: TFunction
) =>
  (Object.keys(translationKeys) as T[]).map((value) => ({
    label: t(translationKeys[value] as never),
    value,
  }))

export const getAiAssessmentRuleDefinitionTypeOptions = (t: TFunction) =>
  toOptions(AI_ASSESSMENT_RULE_DEFINITION_TYPE_TRANSLATION_KEYS, t)

export const getAiAssessmentRuleModelOptions = (t: TFunction) =>
  toOptions(AI_ASSESSMENT_RULE_MODEL_TRANSLATION_KEYS, t)

export const getAiAssessmentRuleStatusOptions = (t: TFunction) =>
  toOptions(AI_ASSESSMENT_RULE_STATUS_TRANSLATION_KEYS, t)

export const getAiAssessmentRuleStateOptions = (t: TFunction) =>
  toOptions(AI_ASSESSMENT_RULE_STATE_TRANSLATION_KEYS, t)

export const getAiAssessmentRuleAutomationLevelOptions = (t: TFunction) =>
  toOptions(AI_ASSESSMENT_RULE_AUTOMATION_LEVEL_TRANSLATION_KEYS, t)
