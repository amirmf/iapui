// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AgentClaimRequestsDetailPage } from './agent-claim-requests-detail-page'
import { agentClaimRequestDetailQueryOptions } from './queries/use-get-agent-claim-request-by-id'

const state = vi.hoisted(() => ({
  query: {} as Record<string, unknown>,
  getById: vi.fn(),
}))
vi.mock(
  '@features/agent-claim-requests/pages/detail/queries/use-get-agent-claim-request-by-id',
  async (original) => ({
    ...(await original<
      typeof import('./queries/use-get-agent-claim-request-by-id')
    >()),
    default: () => state.query,
  })
)
vi.mock(
  '@features/agent-claim-requests/services/agent-claim-request-service',
  () => ({ agentClaimRequestService: { getById: state.getById } })
)
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock(
  '@features/agent-claim-requests/pages/detail/components/agent-claim-request-detail-info-list',
  () => ({ default: () => <div data-testid='information' /> })
)
vi.mock(
  '@features/agent-claim-requests/pages/detail/components/agent-claim-request-detail-result',
  () => ({ default: () => <div data-testid='result' /> })
)
vi.mock('@modules/files', () => ({
  FileViewer: () => <div data-testid='attachments' />,
}))
afterEach(cleanup)

describe('AgentClaimRequestsDetailPage', () => {
  it('renders source loading and no detail content while loading', () => {
    state.query = { isLoading: true }
    render(<AgentClaimRequestsDetailPage />)
    expect(screen.getByText('common.loading')).toBeDefined()
    expect(screen.queryByTestId('information')).toBeNull()
  })
  it('renders server error and retained content together', () => {
    state.query = {
      isError: true,
      error: new Error('server message'),
      data: { attachments: [{}] },
    }
    render(<AgentClaimRequestsDetailPage />)
    expect(screen.getByRole('alert').textContent).toContain('server message')
    expect(screen.getByTestId('attachments')).toBeDefined()
    const card = screen.getByTestId('information').parentElement
    expect(
      [...card!.children].map(
        (child) =>
          child.getAttribute('data-testid') ??
          child.firstElementChild?.getAttribute('data-testid')
      )
    ).toEqual(['information', 'result', 'attachments'])
  })
  it('uses fallback for canceled errors and renders no card without data', () => {
    state.query = { isError: true, error: new Error('canceled') }
    render(<AgentClaimRequestsDetailPage />)
    expect(screen.getByRole('alert').textContent).toContain(
      'errors.general.description'
    )
    expect(screen.queryByTestId('information')).toBeNull()
  })
  it('omits viewer for null or empty attachments', () => {
    state.query = { data: { attachments: null } }
    render(<AgentClaimRequestsDetailPage />)
    expect(screen.getByTestId('information')).toBeDefined()
    expect(screen.queryByTestId('attachments')).toBeNull()
  })
  it('preserves query identity, lifetime, missing-id guard and cancellation', async () => {
    const options = agentClaimRequestDetailQueryOptions('claim-1')
    expect(options.queryKey).toEqual(['agentClaimRequest', 'claim-1'])
    expect(options.staleTime).toBe(5000)
    expect(options.gcTime).toBe(5000)
    expect(agentClaimRequestDetailQueryOptions('').enabled).toBe(false)
    const controller = new AbortController()
    const queryFn = options.queryFn as (context: {
      signal: AbortSignal
    }) => Promise<unknown>
    await queryFn({ signal: controller.signal })
    expect(state.getById).toHaveBeenCalledWith('claim-1', {
      signal: controller.signal,
    })
  })
})
