import MyClaimRequestDetailIResult from '@features/my-claims/pages/detail/components/my-claim-request-detailI-result'
import type { ClaimRequest } from '@iap/api-types'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({ claim: {} as ClaimRequest }))
vi.mock('@features/my-claims/queries/my-claim-request-query', () => ({
  useMyClaimRequestQuery: () => ({ data: state.claim }),
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('@iap/support', () => ({
  SupportFeatureButton: (props: { featureKey: string }) => (
    <div>{props.featureKey}</div>
  ),
}))
vi.mock(
  '@features/my-claims/pages/detail/components/my-claim-request-objection-form',
  () => ({
    MyClaimRequestObjectionForm: (props: { isCompleteDoc: boolean }) => (
      <div>{props.isCompleteDoc ? 'complete-doc-form' : 'objection-form'}</div>
    ),
  })
)
vi.mock('@features/my-claims/pages/detail/components/objection-chat', () => ({
  default: () => <div>chat</div>,
}))
afterEach(cleanup)
describe('MyClaimRequestDetailIResult source branches', () => {
  it.each(['RETURN', 'REJECTED', 'IN_ASSESSMENT', 'PAID'] as const)(
    'matches Support and submit branches for %s',
    (status) => {
      state.claim = { id: 'claim-1', status }
      render(<MyClaimRequestDetailIResult />)
      expect(Boolean(screen.queryByText('assessment-result'))).toBe(
        status === 'RETURN' || status === 'REJECTED'
      )
      expect(Boolean(screen.queryByText('objection-form'))).toBe(
        status === 'RETURN'
      )
      expect(Boolean(screen.queryByText('complete-doc-form'))).toBe(
        status === 'IN_ASSESSMENT'
      )
    }
  )
  it('hides completion form once assessment is assigned', () => {
    state.claim = {
      id: 'claim-1',
      status: 'IN_ASSESSMENT',
      assignedUserUsername: 'assessor',
    }
    render(<MyClaimRequestDetailIResult />)
    expect(screen.queryByText('complete-doc-form')).toBeNull()
  })
  it('shows source reason separator without mutating cached objection order', () => {
    const objections = [
      { id: 'later', createdAt: '2026-10-10' },
      { id: 'earlier', createdAt: '2026-10-01' },
    ]
    state.claim = {
      id: 'claim-1',
      resultReasons: ['first', 'second'],
      objections,
    }
    render(<MyClaimRequestDetailIResult />)
    expect(screen.getByText('first, second')).toBeTruthy()
    expect(screen.getByText('chat')).toBeTruthy()
    expect(objections[0].id).toBe('later')
  })
})
