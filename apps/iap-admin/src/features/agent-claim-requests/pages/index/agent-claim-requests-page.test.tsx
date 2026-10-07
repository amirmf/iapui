// @vitest-environment jsdom
import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { agentClaimRequestService } from '../../services/agent-claim-request-service'
import { AgentClaimRequestsPage } from './agent-claim-requests-page'

const mockPageService = vi.hoisted(() => ({
  getPage: vi.fn(),
  delete: vi.fn(),
  exportPageLiteExcel: vi.fn(),
}))

vi.mock('../../services/agent-claim-request-service', () => ({
  agentClaimRequestService: mockPageService,
  default: mockPageService,
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
  useLocation: () => ({ search: {} }),
  useRouter: () => ({ navigate: vi.fn() }),
}))

vi.mock('@features/claim-requests', () => ({
  ClaimRequestDataTableToolbar: () => <div data-testid='claim-toolbar' />,
  ClaimRequestExportExcelButton: () => <button>Export</button>,
  applyClaimRequestQuickStatusFilter: vi.fn(),
}))

describe('AgentClaimRequestsPage', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    vi.clearAllMocks()
    vi.mocked(agentClaimRequestService.getPage).mockResolvedValue({
      content: [],
      totalPages: 0,
      totalElements: 0,
    })
  })

  afterEach(cleanup)

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it('renders page title, toolbar, and data table', async () => {
    render(<AgentClaimRequestsPage />, { wrapper })

    expect(screen.getByText('agent.claimRequests.title')).toBeDefined()
    expect(screen.getByTestId('claim-toolbar')).toBeDefined()
  })
})
