import { describe, expect, it } from 'vitest'

import {
  CLAIM_REQUEST_STATUS_TRANSLATION_KEYS,
  claimStatusColors,
  getClaimRequestStatusOptions,
} from './agent-claim-request-constant'

describe('agentClaimRequestConstant', () => {
  it('provides color mappings for all statuses', () => {
    expect(claimStatusColors.SUBMITTED).toContain('yellow')
    expect(claimStatusColors.APPROVED).toContain('green')
    expect(claimStatusColors.REJECTED).toContain('red')
    expect(claimStatusColors.RETURN).toContain('red')
  })

  it('provides translation keys for all statuses', () => {
    expect(CLAIM_REQUEST_STATUS_TRANSLATION_KEYS.SUBMITTED).toBe(
      'claimRequests.status.submitted'
    )
    expect(CLAIM_REQUEST_STATUS_TRANSLATION_KEYS.APPROVED).toBe(
      'claimRequests.status.approved'
    )
  })

  it('generates status options using translator', () => {
    const mockT = ((key: string) => `translated:${key}`) as never
    const options = getClaimRequestStatusOptions(mockT)
    expect(options).toHaveLength(
      Object.keys(CLAIM_REQUEST_STATUS_TRANSLATION_KEYS).length
    )
    expect(options[0]).toHaveProperty('label')
    expect(options[0]).toHaveProperty('value')
  })
})
