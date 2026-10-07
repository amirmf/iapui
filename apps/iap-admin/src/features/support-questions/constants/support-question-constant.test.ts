import { describe, expect, it } from 'vitest'

import {
  SUPPORT_REQUIRED_PARAM_INPUT_DISPLAY_VALUES,
  getPartyRoleOptions,
  getSupportRequiredParamInputDisplayOptions,
} from './support-question-constant'

describe('support-question-constant', () => {
  const fakeT = (key: string) => `translated:${key}`

  it('provides all 3 input display options with correct translations', () => {
    const options = getSupportRequiredParamInputDisplayOptions(fakeT as never)
    expect(options).toHaveLength(3)
    expect(options.map((o) => o.value)).toEqual(
      SUPPORT_REQUIRED_PARAM_INPUT_DISPLAY_VALUES
    )
    expect(options[0].label).toBe(
      'translated:supportQuestions.inputDisplay.TEXT'
    )
    expect(options[1].label).toBe(
      'translated:supportQuestions.inputDisplay.LIST'
    )
    expect(options[2].label).toBe(
      'translated:supportQuestions.inputDisplay.NOINPUT'
    )
  })

  it('provides party role options with correct translations', () => {
    const options = getPartyRoleOptions(fakeT as never)
    expect(options.length).toBeGreaterThan(0)
    expect(options[0].label).toBe('translated:parties.role.publicUser')
  })
})
