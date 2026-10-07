// @vitest-environment jsdom
import type { ReactNode } from 'react'

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AgentClaimRequestHeaderActions } from './agent-claim-request-header-actions'

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

vi.mock(
  '@features/claim-requests/pages/index/components/claim-request-export-excel-button',
  () => ({
    ClaimRequestExportExcelButton: () => <button>Export Excel</button>,
  })
)

describe('AgentClaimRequestHeaderActions', () => {
  afterEach(cleanup)

  it('renders create link, excel export, and refresh button', () => {
    const onRefetch = vi.fn()
    render(
      <AgentClaimRequestHeaderActions
        isLoading={false}
        onRefetch={onRefetch}
        filters={{}}
      />
    )

    const link = screen.getByRole('link', {
      name: 'agent.claimRequests.create.title',
    })
    expect(link.getAttribute('href')).toBe('/agent/claim-requests/create/')
    expect(screen.getByText('Export Excel')).toBeDefined()
    expect(
      screen.getByRole('button', { name: /agent\.claimRequests\.refresh/ })
    ).toBeDefined()
  })

  it('disables buttons when loading', () => {
    render(
      <AgentClaimRequestHeaderActions
        isLoading={true}
        onRefetch={vi.fn()}
        filters={{}}
      />
    )

    const refreshBtn = screen.getByRole('button', {
      name: /agent\.claimRequests\.refresh/,
    }) as HTMLButtonElement
    expect(refreshBtn.disabled).toBe(true)
  })
})
