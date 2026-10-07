// @vitest-environment jsdom
import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Row } from '@tanstack/react-table'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useAgentClaimRequestStore } from '../context/claim-request-context'
import { AgentClaimRequestRowActions } from './agent-claim-request-row-actions'

vi.mock('../services/agent-claim-request-service', () => ({
  agentClaimRequestService: {
    refreshPolicyDetails: vi.fn(),
  },
}))

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>()
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  }
})

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('AgentClaimRequestRowActions', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    useAgentClaimRequestStore.getState().reset()
    vi.clearAllMocks()
  })

  afterEach(cleanup)

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  const mockRow = (status = 'IN_ASSESSMENT') =>
    ({
      original: {
        id: 'claim-1',
        status,
        extDisplayName: 'User',
      },
    }) as unknown as Row<never>

  it('renders view details and delete buttons', () => {
    render(<AgentClaimRequestRowActions row={mockRow()} />, { wrapper })

    expect(
      screen.getByRole('link', {
        name: /agent\.claimRequests\.actions\.viewDetails/,
      })
    ).toBeDefined()
    expect(
      screen.getByRole('button', {
        name: /agent\.claimRequests\.actions\.delete/,
      })
    ).toBeDefined()
  })

  it('shows completion of documents button only when status is RETURN', () => {
    const { rerender } = render(
      <AgentClaimRequestRowActions row={mockRow('IN_ASSESSMENT')} />,
      { wrapper }
    )
    expect(
      screen.queryByRole('link', {
        name: /agent\.claimRequests\.actions\.completionOfDocuments/,
      })
    ).toBeNull()

    rerender(<AgentClaimRequestRowActions row={mockRow('RETURN')} />)
    expect(
      screen.getByRole('link', {
        name: /agent\.claimRequests\.actions\.completionOfDocuments/,
      })
    ).toBeDefined()
  })

  it('sets store state to open delete dialog on delete click', () => {
    render(<AgentClaimRequestRowActions row={mockRow()} />, { wrapper })

    const deleteBtn = screen.getByRole('button', {
      name: /agent\.claimRequests\.actions\.delete/,
    })
    fireEvent.click(deleteBtn)

    expect(useAgentClaimRequestStore.getState().open).toBe('delete')
    expect(useAgentClaimRequestStore.getState().currentRow?.id).toBe('claim-1')
  })
})
