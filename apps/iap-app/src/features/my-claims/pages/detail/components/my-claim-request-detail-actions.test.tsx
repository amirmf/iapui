import { MyClaimRequestDetailActions } from '@features/my-claims/pages/detail/components/my-claim-request-detail-actions'
import type { ClaimRequest, ClaimRequestStatus } from '@iap/api-types'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({ claim: {} as ClaimRequest }))
vi.mock('@features/my-claims/queries/my-claim-request-query', () => ({
  useMyClaimRequestQuery: () => ({ data: state.claim }),
}))
vi.mock(
  '@features/my-claims/pages/detail/components/my-claim-request-detail-delete-action',
  () => ({
    MyClaimRequestDetailDeleteAction: () => <button>delete claim</button>,
  })
)
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
})

it.each<ClaimRequestStatus>([
  'RETURN',
  'REJECTED',
  'IN_ASSESSMENT',
  'DEDICATED_TO_USER',
  'DELEGATED',
])('permits deletion for reference status %s', (status) => {
  state.claim = { status }
  render(<MyClaimRequestDetailActions />)
  expect(screen.getByRole('button', { name: 'delete claim' })).toBeTruthy()
})

it('hides unavailable actions and links an adjustment to the configured admin origin', () => {
  vi.stubEnv('VITE_IAP_ADMIN_DOMAIN_URL', 'https://admin.example.test/')
  state.claim = { baseClaimRequestId: 'base/id' }
  render(<MyClaimRequestDetailActions />)
  expect(screen.queryByRole('button', { name: 'delete claim' })).toBeNull()
  const link = screen.getByRole('link')
  expect(link.getAttribute('href')).toBe(
    'https://admin.example.test/claim-requests/base%2Fid/claim-request-management'
  )
  expect(link.getAttribute('target')).toBe('_blank')
  cleanup()
  state.claim = {}
  render(<MyClaimRequestDetailActions />)
  expect(screen.queryByRole('link')).toBeNull()
})
