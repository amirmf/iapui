// @vitest-environment jsdom
import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { agentClaimRequestManagementQueryOptions } from '../queries/use-agent-claim-request-management-data'
import { AgentClaimRequestManagement } from './agent-claim-request-management'

const mockAgentClaimRequestService = vi.hoisted(() => ({
  getById: vi.fn(),
  getPage: vi.fn(),
  delete: vi.fn(),
  exportPageLiteExcel: vi.fn(),
  refreshPolicyDetails: vi.fn(),
  submitObjection: vi.fn(),
  getSubInsuredPeople: vi.fn(),
  inquiry: vi.fn(),
}))

vi.mock('../services/agent-claim-request-service', () => ({
  agentClaimRequestService: mockAgentClaimRequestService,
  default: mockAgentClaimRequestService,
}))

vi.mock('@tanstack/react-router', () => ({
  useParams: () => ({ claimRequestId: 'claim-123' }),
  useLocation: () => ({
    pathname: '/agent/claim-requests/claim-123/claim-request-management/',
  }),
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))

vi.mock('@shared/i18n/i18n', () => ({
  useTranslate: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@features/claim-requests', () => ({
  ClaimRequestLastStatusSection: ({ status }: { status?: string }) => (
    <div data-testid='last-status-section'>{status}</div>
  ),
  ClaimRequestAssignSection: () => <div data-testid='assign-section' />,
  ClaimRequestInfoList: ({
    viewDetailsAdjustmentLink,
  }: {
    viewDetailsAdjustmentLink: string
  }) => (
    <div
      data-testid='info-list'
      data-adjustment-link={viewDetailsAdjustmentLink}
    />
  ),
  ClaimRequestAssessmentItemsSection: () => (
    <div data-testid='assessment-items-section' />
  ),
  ClaimRequestDoctorResponses: () => <div data-testid='doctor-responses' />,
  ClaimRequestDuplicatedSection: () => <div data-testid='duplicated-section' />,
  ClaimRequestManagementError: () => (
    <div data-testid='management-error-section' />
  ),
  ClaimRequestObjectionSection: () => <div data-testid='objection-section' />,
  ClaimRequestAttachmentsSection: () => (
    <div data-testid='attachments-section' />
  ),
  ClaimRequestManagementPrevRequest: () => (
    <div data-testid='prev-request-section' />
  ),
  ClaimRequestDocumentsSection: () => <div data-testid='documents-section' />,
  ClaimRequestManagementPanelPending: () => (
    <div data-testid='management-pending' />
  ),
  ClaimRequestManagementQueryError: () => (
    <div data-testid='management-error' />
  ),
}))

describe('AgentClaimRequestManagement', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    vi.clearAllMocks()
  })

  afterEach(cleanup)

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it('agentClaimRequestManagementQueryOptions produces exact query key and lifecycle contract', async () => {
    const signal = new AbortController().signal
    const options = agentClaimRequestManagementQueryOptions('claim-456')

    expect(options.queryKey).toEqual(['agentClaimRequest', 'claim-456'])
    expect(options.staleTime).toBe(10000)
    expect(options.gcTime).toBe(10000)
    expect(options.refetchOnWindowFocus).toBe(true)

    mockAgentClaimRequestService.getById.mockResolvedValueOnce({
      id: 'claim-456',
      status: 'SUBMITTED',
    })

    await (
      options.queryFn as (context: { signal: AbortSignal }) => Promise<unknown>
    )({ signal })

    expect(mockAgentClaimRequestService.getById).toHaveBeenCalledWith(
      'claim-456',
      { signal }
    )
  })

  it('renders pending state while loading', () => {
    mockAgentClaimRequestService.getById.mockImplementation(
      () => new Promise(() => {})
    )

    render(<AgentClaimRequestManagement />, { wrapper })

    expect(screen.getByTestId('management-pending')).toBeDefined()
  })

  it('renders error component on query failure', async () => {
    mockAgentClaimRequestService.getById.mockRejectedValue(
      new Error('API error')
    )

    render(<AgentClaimRequestManagement />, { wrapper })

    expect(await screen.findByTestId('management-error')).toBeDefined()
  })

  it('renders all sections and passes agent adjustment link on success', async () => {
    mockAgentClaimRequestService.getById.mockResolvedValue({
      id: 'claim-123',
      status: 'IN_REVIEW',
      statusHistory: [],
      assignmentHistory: [],
      createdBy: 'user-789',
      documents: [],
      attachments: [],
    })

    render(<AgentClaimRequestManagement />, { wrapper })

    expect(await screen.findByTestId('last-status-section')).toBeDefined()
    expect(screen.getByTestId('assign-section')).toBeDefined()

    const infoList = screen.getByTestId('info-list')
    expect(infoList.getAttribute('data-adjustment-link')).toBe(
      '/agent/claim-requests/$claimRequestId/claim-request-management/'
    )

    expect(screen.getByTestId('assessment-items-section')).toBeDefined()
    expect(screen.getByTestId('doctor-responses')).toBeDefined()
    expect(screen.getByTestId('duplicated-section')).toBeDefined()
    expect(screen.getByTestId('management-error-section')).toBeDefined()
    expect(screen.getByTestId('objection-section')).toBeDefined()
    expect(screen.getByTestId('attachments-section')).toBeDefined()
    expect(screen.getByTestId('prev-request-section')).toBeDefined()
    expect(screen.getByTestId('documents-section')).toBeDefined()
  })
})
