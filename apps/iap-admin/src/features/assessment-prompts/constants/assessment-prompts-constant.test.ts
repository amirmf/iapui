import { describe, expect, it } from 'vitest'

import {
  ASSESSMENT_PROMPT_RULE_STATE_TRANSLATION_KEYS,
  ASSESSMENT_PROMPT_STATUS_TRANSLATION_KEYS,
  getAssessmentPromptPlaceTypeOptions,
} from './assessment-prompts-constant'

describe('assessment prompt enum presentation', () => {
  it('preserves every reference enum translation key', () => {
    expect(ASSESSMENT_PROMPT_RULE_STATE_TRANSLATION_KEYS).toEqual({
      CALCULATION: 'assessmentPrompts.ruleState.calculation',
      DISPLAY: 'assessmentPrompts.ruleState.display',
      PRELIMINARY: 'assessmentPrompts.ruleState.preliminary',
      SECONDARY: 'assessmentPrompts.ruleState.secondary',
    })
    expect(ASSESSMENT_PROMPT_STATUS_TRANSLATION_KEYS).toEqual({
      ACTIVE: 'assessmentPrompts.status.active',
      INACTIVE: 'assessmentPrompts.status.inactive',
      PENDING: 'assessmentPrompts.status.pending',
      SUSPENDED: 'assessmentPrompts.status.suspended',
    })
  })

  it('creates the source-backed place-type selector options', () => {
    expect(
      getAssessmentPromptPlaceTypeOptions(
        ((key: string) => `fa:${key}`) as never
      )
    ).toEqual([
      {
        label: 'fa:assessmentPrompts.placeType.hospital',
        value: 'HOSPITAL',
      },
      {
        label: 'fa:assessmentPrompts.placeType.clinic',
        value: 'CLINIC',
      },
      {
        label: 'fa:assessmentPrompts.placeType.surgeryCenter',
        value: 'SURGERY_CENTER',
      },
    ])
  })
})
