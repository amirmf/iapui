import type { TFunction } from 'i18next'
import { describe, expect, it } from 'vitest'

import {
  PRE_AUTH_STATUS_TRANSLATION_KEYS,
  getPreAuthStatusOptions,
  preAuthStatusBorderColors,
  preAuthStatusColors,
} from './pre-auth-status-constant'

describe('pre-auth-status-constant', () => {
  it('maps known pre-auth statuses to translation keys and styles', () => {
    expect(PRE_AUTH_STATUS_TRANSLATION_KEYS[101]).toBe(
      'myiap.preAuths.status.draft'
    )
    expect(PRE_AUTH_STATUS_TRANSLATION_KEYS[102]).toBe(
      'myiap.preAuths.status.approved'
    )
    expect(PRE_AUTH_STATUS_TRANSLATION_KEYS[103]).toBe(
      'myiap.preAuths.status.cancelled'
    )

    expect(preAuthStatusColors[101]).toContain('yellow')
    expect(preAuthStatusColors[102]).toContain('green')
    expect(preAuthStatusColors[103]).toContain('red')

    expect(preAuthStatusBorderColors[101]).toContain('border-yellow-400')
    expect(preAuthStatusBorderColors[102]).toContain('border-green-400')
    expect(preAuthStatusBorderColors[103]).toContain('border-red-400')
  })

  it('generates status options with translation helper', () => {
    const mockT = ((key: string) => `translated-${key}`) as unknown as TFunction
    const options = getPreAuthStatusOptions(mockT)

    expect(options).toEqual([
      { label: 'translated-myiap.preAuths.status.draft', value: 101 },
      { label: 'translated-myiap.preAuths.status.approved', value: 102 },
      { label: 'translated-myiap.preAuths.status.cancelled', value: 103 },
    ])
  })
})
