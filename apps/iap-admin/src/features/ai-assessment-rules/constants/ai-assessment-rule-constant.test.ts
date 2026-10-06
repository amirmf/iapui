import { describe, expect, it } from 'vitest'

import {
  AI_ASSESSMENT_RULE_DEFINITION_TYPE_TRANSLATION_KEYS,
  getAiAssessmentRuleAutomationLevelOptions,
  getAiAssessmentRuleDefinitionTypeOptions,
  getAiAssessmentRuleModelOptions,
  getAiAssessmentRuleStateOptions,
  getAiAssessmentRuleStatusOptions,
} from './ai-assessment-rule-constant'

describe('ai-assessment-rule-constant', () => {
  const mockTranslate = ((key: string) => `translated:${key}`) as never

  it('provides all definition type options with correct translations', () => {
    const options = getAiAssessmentRuleDefinitionTypeOptions(mockTranslate)
    expect(options).toHaveLength(4)
    expect(options.map((opt) => opt.value)).toEqual([
      'AGREEMENT_TEMPLATE',
      'CONTRACT',
      'GENERAL',
      'POLICY',
    ])
    expect(options[0]?.label).toBe(
      `translated:${AI_ASSESSMENT_RULE_DEFINITION_TYPE_TRANSLATION_KEYS.AGREEMENT_TEMPLATE}`
    )
  })

  it('provides all model options with correct translations', () => {
    const options = getAiAssessmentRuleModelOptions(mockTranslate)
    expect(options).toHaveLength(7)
    expect(options.some((opt) => opt.value === 'NONE')).toBe(true)
    expect(options.some((opt) => opt.value === 'KAVAN_TEXT_SMALL')).toBe(true)
  })

  it('provides status options', () => {
    const options = getAiAssessmentRuleStatusOptions(mockTranslate)
    expect(options).toHaveLength(2)
    expect(options.map((opt) => opt.value)).toEqual(['ACTIVE', 'INACTIVE'])
  })

  it('provides rule state options', () => {
    const options = getAiAssessmentRuleStateOptions(mockTranslate)
    expect(options).toHaveLength(12)
    expect(options.some((opt) => opt.value === 'INFORMATION')).toBe(true)
  })

  it('provides automation level options', () => {
    const options = getAiAssessmentRuleAutomationLevelOptions(mockTranslate)
    expect(options).toHaveLength(3)
    expect(options.map((opt) => opt.value)).toEqual([
      'FULL_AUTO',
      'HINT',
      'REQUIRE_APPROVE',
    ])
  })
})
