import { afterEach, describe, expect, it, vi } from 'vitest'

import { getSupportClaimRequestUrl } from './support-claim-request-url'

afterEach(() => vi.unstubAllEnvs())

describe('support claim request navigation', () => {
  it('opens the approved customer claim path on the configured customer application', () => {
    vi.stubEnv('VITE_IAP_APP_DOMAIN_URL', 'https://customer.example.test/')
    expect(getSupportClaimRequestUrl('claim-123')).toBe(
      'https://customer.example.test/myclaims/claim-123'
    )
  })

  it('retains the same-origin path when no cross-application URL is provided', () => {
    vi.stubEnv('VITE_IAP_APP_DOMAIN_URL', undefined)
    expect(getSupportClaimRequestUrl('claim-123')).toBe('/myclaims/claim-123')
  })

  it('encodes identifiers and resolves from the application origin', () => {
    vi.stubEnv('VITE_IAP_APP_DOMAIN_URL', 'https://customer.example.test/base/')
    expect(getSupportClaimRequestUrl('claim/id?next=other')).toBe(
      'https://customer.example.test/myclaims/claim%2Fid%3Fnext%3Dother'
    )
  })
})
