import type {
  AiAssessmentRule,
  AiAssessmentRuleAutomationLevelItem,
  AiAssessmentRuleDetail,
  CreateAiAssessmentRuleRequest,
} from '@iap/api-types'

interface AiAssessmentRuleMutableSections {
  automationLevels?: AiAssessmentRuleAutomationLevelItem[]
  ruleDetails?: AiAssessmentRuleDetail[]
}

function optional<T>(value: T | null | undefined): T | undefined {
  return value ?? undefined
}

export function createAiAssessmentRuleUpdateData(
  rule: AiAssessmentRule,
  { automationLevels, ruleDetails }: AiAssessmentRuleMutableSections
): CreateAiAssessmentRuleRequest {
  return {
    agreementTemplateCode: optional(rule.agreementTemplateCode),
    aiModel: optional(rule.aiModel),
    automationLevels: automationLevels?.map((level) => ({
      automationLevel: optional(level.automationLevel),
      maxThreshold: optional(level.maxThreshold),
      minThreshold: optional(level.minThreshold),
    })),
    definitionType: optional(rule.definitionType),
    docTypes: optional(rule.docTypes),
    extContractId: optional(rule.extContractId),
    extPolicyId: optional(rule.extPolicyId),
    id: optional(rule.id),
    inputParams: optional(rule.inputParams),
    methodNames: optional(rule.methodNames),
    ruleDetails,
    ruleState: optional(rule.ruleState),
    skipRule: optional(rule.skipRule),
    status: optional(rule.status),
    thruDate: optional(rule.thruDate),
  }
}
