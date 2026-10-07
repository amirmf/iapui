import { describe, expect, it } from 'vitest'

import {
  CLAIM_REQUEST_STATUS_TRANSLATION_KEYS,
  claimStatusBorderColors,
  claimStatusColors,
  getClaimRequestStatusOptions,
} from './agent-claim-request-constant'

describe('agent-claim-request-constant', () => {
  it('maps expected color tokens for representative statuses', () => {
    expect(claimStatusColors.SUBMITTED).toContain('border-yellow-200')
    expect(claimStatusColors.APPROVED).toContain('border-green-200')
    expect(claimStatusColors.REJECTED).toContain('border-red-200')
  })

  it('maps expected border color tokens for representative statuses', () => {
    expect(claimStatusBorderColors.SUBMITTED).toContain('border-yellow-400')
    expect(claimStatusBorderColors.APPROVED).toContain('border-green-400')
    expect(claimStatusBorderColors.REJECTED).toContain('border-red-400')
  })

  it('builds translated status options with current translation keys', () => {
    const options = getClaimRequestStatusOptions((key) => `translated:${key}`)
    expect(options).toHaveLength(
      Object.keys(CLAIM_REQUEST_STATUS_TRANSLATION_KEYS).length
    )
    expect(options).toContainEqual({
      label:
        'translated:' + CLAIM_REQUEST_STATUS_TRANSLATION_KEYS.IN_ASSESSMENT,
      value: 'IN_ASSESSMENT',
    })
  })
})
