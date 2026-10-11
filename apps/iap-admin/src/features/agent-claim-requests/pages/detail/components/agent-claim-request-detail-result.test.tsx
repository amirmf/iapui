// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import AgentClaimRequestDetailResult from './agent-claim-request-detail-result'

const state = vi.hoisted(() => ({ data: {} as Record<string, unknown> }))
vi.mock(
  '@features/agent-claim-requests/pages/detail/queries/use-get-agent-claim-request-by-id',
  () => ({ default: () => ({ data: state.data }) })
)
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('@features/claim-requests', () => ({
  ObjectionChat: (props: {
    objections: { id: string }[]
    presentation?: string
  }) => (
    <div data-testid='chat' data-presentation={props.presentation}>
      {props.objections.map((item) => item.id).join(',')}
    </div>
  ),
}))
vi.mock(
  '@features/agent-claim-requests/pages/detail/components/agent-claim-request-objection-form',
  () => ({
    AgentClaimRequestObjectionForm: (props: { isCompleteDoc: boolean }) => (
      <div data-testid='form'>{String(props.isCompleteDoc)}</div>
    ),
  })
)
afterEach(cleanup)
describe('AgentClaimRequestDetailResult', () => {
  it.each([
    ['RETURN', undefined, 'claim', false],
    ['IN_ASSESSMENT', undefined, 'claim', true],
    ['IN_ASSESSMENT', '', 'claim', true],
    ['IN_ASSESSMENT', 'expert', 'claim', null],
    ['APPROVED', undefined, 'claim', null],
    ['RETURN', undefined, undefined, null],
  ])(
    'preserves form eligibility for %s / %s / %s',
    (status, assignedUserUsername, id, expected) => {
      state.data = { status, assignedUserUsername, id }
      render(<AgentClaimRequestDetailResult />)
      if (expected === null) expect(screen.queryByTestId('form')).toBeNull()
      else expect(screen.getByTestId('form').textContent).toBe(String(expected))
    }
  )
  it('renders reasons and oldest-first chat without changing cached data', () => {
    const objections = Object.freeze([
      { id: 'new', createdAt: '2026-02-01' },
      { id: 'old', createdAt: '2026-01-01' },
    ])
    state.data = { resultReasons: ['reason one', 'reason two'], objections }
    render(<AgentClaimRequestDetailResult />)
    expect(screen.getByText('reason one, reason two')).toBeDefined()
    expect(screen.getByTestId('chat').textContent).toBe('old,new')
    expect(screen.getByTestId('chat').getAttribute('data-presentation')).toBe(
      'reference'
    )
    expect(objections[0].id).toBe('new')
  })
  it('omits empty reasons and conversation', () => {
    state.data = { resultReasons: [], objections: [] }
    render(<AgentClaimRequestDetailResult />)
    expect(
      screen.queryByText('agent.claimRequests.detail.rejectionReasons')
    ).toBeNull()
    expect(screen.queryByTestId('chat')).toBeNull()
  })
})
