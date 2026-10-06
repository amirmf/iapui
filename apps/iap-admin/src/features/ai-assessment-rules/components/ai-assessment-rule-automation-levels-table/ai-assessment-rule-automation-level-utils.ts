import type { AiAssessmentRuleAutomationLevelItem } from '@iap/api-types'

export function replaceAutomationLevel(
  automationLevels: AiAssessmentRuleAutomationLevelItem[],
  currentAutomationLevel: AiAssessmentRuleAutomationLevelItem,
  nextAutomationLevel: AiAssessmentRuleAutomationLevelItem
): AiAssessmentRuleAutomationLevelItem[] {
  const index = automationLevels.indexOf(currentAutomationLevel)

  return index === -1
    ? automationLevels
    : automationLevels.map((automationLevel, automationLevelIndex) =>
        automationLevelIndex === index ? nextAutomationLevel : automationLevel
      )
}
