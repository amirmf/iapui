import {
  NATIONALITY_TYPE_TRANSLATION_KEYS,
  getNationalityTypeOptions,
} from '@features/agent-users/constants/agent-user-constant'
import reference from '@features/agent-users/test/fixtures/agent-user-translations.reference.json'
import fa from '@shared/i18n/locales/fa/common.json'
import { describe, expect, it } from 'vitest'

describe('agent user signup reference translations', () => {
  it('preserves every reference Persian value and the breadcrumb', () => {
    expect(fa.agent.users).toEqual(reference.users)
    expect(fa.breadcrumb.agentUserSignup).toBe(reference.breadcrumb)
  })

  it('uses signup keys in the exact reference tab order', () => {
    expect(Object.entries(NATIONALITY_TYPE_TRANSLATION_KEYS)).toEqual([
      ['IR', 'agent.users.nationality.ir'],
      ['FOREIGN', 'agent.users.nationality.foreign'],
    ])
    expect(getNationalityTypeOptions((key) => key)).toEqual([
      { value: 'IR', label: 'agent.users.nationality.ir' },
      { value: 'FOREIGN', label: 'agent.users.nationality.foreign' },
    ])
  })

  it('resolves labels with the current translator on each invocation', () => {
    expect(getNationalityTypeOptions(() => 'first')[0]?.label).toBe('first')
    expect(getNationalityTypeOptions(() => 'second')[0]?.label).toBe('second')
  })
})
