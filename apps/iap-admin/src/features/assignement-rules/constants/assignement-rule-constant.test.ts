import {
  assignementRuleStatusBadgeColors,
  assignementRuleStatusTranslationKeys,
  getAssignementRuleStatusOptions,
} from '@features/assignement-rules/constants/assignement-rule-constant'
import { describe, expect, it } from 'vitest'

describe('assignementRuleConstant', () => {
  it('maps ACTIVE and INACTIVE to correct translation keys and colors', () => {
    expect(assignementRuleStatusTranslationKeys.ACTIVE).toBe(
      'assignementRules.status.active'
    )
    expect(assignementRuleStatusTranslationKeys.INACTIVE).toBe(
      'assignementRules.status.inactive'
    )
    expect(assignementRuleStatusBadgeColors.ACTIVE).toContain(
      'border-emerald-200'
    )
    expect(assignementRuleStatusBadgeColors.INACTIVE).toContain(
      'border-slate-200'
    )
  })

  it('returns status options using translation function', () => {
    const mockT = ((key: string) => `translated:${key}`) as never
    const options = getAssignementRuleStatusOptions(mockT)
    expect(options).toEqual([
      {
        label: 'translated:assignementRules.status.active',
        value: 'ACTIVE',
      },
      {
        label: 'translated:assignementRules.status.inactive',
        value: 'INACTIVE',
      },
    ])
  })
})
