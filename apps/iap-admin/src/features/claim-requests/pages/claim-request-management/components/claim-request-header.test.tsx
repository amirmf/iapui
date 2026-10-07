import ClaimRequestAssignSection from '@features/claim-requests/pages/claim-request-management/components/claim-request-assign-section'
import ClaimRequestLastStatusSection from '@features/claim-requests/pages/claim-request-management/components/claim-request-last-status-section'
import { ClaimRequestManagementPending } from '@features/claim-requests/pages/claim-request-management/components/claim-request-management-pending'
import { ClaimRequestManagementQueryError } from '@features/claim-requests/pages/claim-request-management/components/claim-request-management-query-error'
import { ClaimRequestRegisteredByAgentSection } from '@features/claim-requests/pages/claim-request-management/components/claim-request-registered-by-agent-section'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { AxiosError } from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@shared/i18n/i18n', () => ({
  useTranslate: () => ({
    t: (key: string, options?: { userId?: string }) =>
      options?.userId ? `${key}:${options.userId}` : key,
    i18n: { language: 'fa' },
  }),
}))

afterEach(cleanup)

describe('claim management header source behavior', () => {
  it('shows source assignment fallbacks and hides empty agent attribution', () => {
    const { rerender } = render(
      <ClaimRequestAssignSection
        claimRequest={{
          assignedUserId: 'u',
          latestAssignementDisplayName: 'Fallback',
        }}
      />
    )
    expect(screen.getByText('Fallback')).toBeDefined()
    expect(screen.getByText('common.notAvailable')).toBeDefined()
    rerender(
      <ClaimRequestAssignSection
        claimRequest={{ assignedUserDisplayName: 'Invisible' }}
      />
    )
    expect(
      screen.getByText('<claimRequests.assignment.noAssign>')
    ).toBeDefined()
    expect(screen.queryByText('Invisible')).toBeNull()
    rerender(<ClaimRequestRegisteredByAgentSection claimRequest={{}} />)
    expect(
      screen.queryByText('claimRequests.assignment.registeredByAgent')
    ).toBeNull()
    rerender(
      <ClaimRequestRegisteredByAgentSection
        claimRequest={{
          registeredByAgentDisplayName: 'Agent',
          registeredByAgentUsername: 'agent',
        }}
      />
    )
    expect(screen.getByText('Agent (agent)')).toBeDefined()
  })

  it('disables an empty status history and applies paid-without-date presentation', () => {
    const { rerender } = render(
      <ClaimRequestLastStatusSection status='PAID' statusHistory={[]} />
    )
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(
      true
    )
    expect(screen.getByText('claimRequests.status.sentToBank')).toBeDefined()
    rerender(
      <ClaimRequestLastStatusSection
        status='PAID'
        extPaymentDate='2026-10-07'
        statusHistory={[]}
      />
    )
    expect(screen.getByText('claimRequests.status.paid')).toBeDefined()
  })

  it('uses latest parent status, descending history, and trimmed user attribution', () => {
    render(
      <ClaimRequestLastStatusSection
        status='PAID'
        statusHistory={[
          {
            status: 'SUBMITTED',
            timestamp: '2026-10-01T10:00:00Z',
            notes: 'Old',
          },
          {
            status: 'APPROVED',
            timestamp: '2026-10-02T10:00:00Z',
            userIdDisplayName: ' User ',
            userIdUsername: ' login ',
            notes: 'New',
          },
        ]}
      />
    )
    fireEvent.click(screen.getByRole('button'))
    const items = screen.getAllByRole('listitem')
    expect(items[0].textContent).toContain('New')
    expect(items[0].textContent).toContain('claimRequests.status.sentToBank')
    expect(items[0].textContent).toContain('User (login)')
    expect(items[1].textContent).toContain('Old')
  })

  it('announces loading and maps source query error categories', () => {
    const { rerender } = render(<ClaimRequestManagementPending />)
    expect(screen.getByRole('status').textContent).toBe('common.loading')
    for (const [status, key] of [
      [404, 'notFound'],
      [500, 'serverError'],
      [403, 'generic'],
    ] as const) {
      const error = new AxiosError('failure')
      error.response = { status } as AxiosError['response']
      rerender(<ClaimRequestManagementQueryError error={error} />)
      expect(screen.getByText(`common.errorStatus.${key}`)).toBeDefined()
    }
  })
})
