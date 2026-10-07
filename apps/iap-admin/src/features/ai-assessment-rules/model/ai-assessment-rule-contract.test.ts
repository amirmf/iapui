import {
  aiAssessmentRuleDetailFormSchema,
  aiAssessmentRuleFormSchema,
  aiAssessmentRuleSchema,
  listAiAssessmentRulesRequestSchema,
  pageAiAssessmentRuleSchema,
} from '@iap/api-types'
import { describe, expect, it } from 'vitest'

describe('ai-assessment-rule contracts', () => {
  it('parses valid list request with default values', () => {
    const parsed = listAiAssessmentRulesRequestSchema.parse({})
    expect(parsed.page).toBe(0)
    expect(parsed.size).toBe(30)
    expect(parsed.filters).toEqual({})
  })

  it('validates rule schema', () => {
    const raw = {
      aiModel: 'KAVAN_TEXT_SMALL',
      automationLevels: [
        {
          automationLevel: 'HINT',
          maxThreshold: 90,
          minThreshold: 10,
        },
      ],
      definitionType: 'GENERAL',
      id: 'rule-123',
      inputParams: '{}',
      ruleDetails: [],
      ruleState: 'CORE',
      status: 'ACTIVE',
    }
    const parsed = aiAssessmentRuleSchema.parse(raw)
    expect(parsed.id).toBe('rule-123')
    expect(parsed.definitionType).toBe('GENERAL')
    expect(parsed.automationLevels?.[0]?.automationLevel).toBe('HINT')
  })

  it('validates page rule schema', () => {
    const pageRaw = {
      content: [
        {
          id: 'rule-1',
          status: 'ACTIVE',
        },
      ],
      empty: false,
      first: true,
      last: true,
      number: 0,
      numberOfElements: 1,
      size: 30,
      totalElements: 1,
      totalPages: 1,
    }
    const parsed = pageAiAssessmentRuleSchema.parse(pageRaw)
    expect(parsed.totalElements).toBe(1)
    expect(parsed.content?.[0]?.id).toBe('rule-1')
  })

  it('validates detail form schema json validation', () => {
    const t = ((k: string) => k) as never
    const schema = aiAssessmentRuleDetailFormSchema(t)

    const validResult = schema.safeParse({
      docTypeCode: 'DOC1',
      inputParams: '{"key": "value"}',
      maxThreshold: '100',
      methodNames: 'checkDoc',
      minThreshold: '10',
      prompt: 'Check document',
    })
    expect(validResult.success).toBe(true)

    const invalidResult = schema.safeParse({
      docTypeCode: 'DOC1',
      inputParams: 'invalid-json',
      maxThreshold: '100',
      methodNames: 'checkDoc',
      minThreshold: '10',
      prompt: 'Check document',
    })
    expect(invalidResult.success).toBe(false)
  })

  it('validates form schema JSON and field requirements', () => {
    const t = ((k: string) => k) as never
    const schema = aiAssessmentRuleFormSchema(t)

    const valid = schema.safeParse({
      aiModel: 'KAVAN_TEXT_SMALL',
      definitionType: 'GENERAL',
      docTypes: [],
      inputParams: '{}',
      ruleState: 'INFORMATION',
      status: 'ACTIVE',
    })
    expect(valid.success).toBe(true)
  })
})
