import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CustomerUserClaimRequestManagementPage } from './customer-user-claim-request-management-page'

const mockUseParams = vi.fn().mockReturnValue({ claimRequestId: 'claim-123' })
vi.mock('@tanstack/react-router', () => ({
  useParams: () => mockUseParams(),
}))

const mockUseCustomerUserClaimRequest = vi.fn()
vi.mock(
  '@features/customer-user/hooks/use-customer-user-claim-request',
  () => ({
    useCustomerUserClaimRequest: (id: string) =>
      mockUseCustomerUserClaimRequest(id),
  })
)

vi.mock('@features/claim-requests', () => ({
  ClaimRequestManagementPanelPending: () => (
    <div data-testid='pending-view'>Pending</div>
  ),
  ClaimRequestManagementQueryError: ({ error }: { error?: unknown }) => (
    <div data-testid='error-view'>Error: {String(error)}</div>
  ),
  ClaimRequestLastStatusSection: () => (
    <div data-testid='last-status-section'>LastStatus</div>
  ),
  ClaimRequestAssignSection: () => (
    <div data-testid='assign-section'>AssignSection</div>
  ),
  ClaimRequestInfoList: ({
    viewDetailsAdjustmentLink,
  }: {
    viewDetailsAdjustmentLink?: string
  }) => (
    <div
      data-testid='info-list-section'
      data-adjustment-link={viewDetailsAdjustmentLink}
    >
      InfoList
    </div>
  ),
  ClaimRequestAssessmentItemsSection: () => (
    <div data-testid='assessment-items-section'>AssessmentItems</div>
  ),
  ClaimRequestDoctorResponses: () => (
    <div data-testid='doctor-responses-section'>DoctorResponses</div>
  ),
  ClaimRequestDuplicatedSection: () => (
    <div data-testid='duplicated-section'>DuplicatedSection</div>
  ),
  ClaimRequestManagementError: () => (
    <div data-testid='management-error-section'>ManagementError</div>
  ),
  ClaimRequestObjectionSection: () => (
    <div data-testid='objection-section'>ObjectionSection</div>
  ),
  ClaimRequestAttachmentsSection: () => (
    <div data-testid='attachments-section'>AttachmentsSection</div>
  ),
  ClaimRequestManagementPrevRequest: () => (
    <div data-testid='prev-request-section'>PrevRequest</div>
  ),
  ClaimRequestDocumentsSection: () => (
    <div data-testid='documents-section'>DocumentsSection</div>
  ),
}))

describe('CustomerUserClaimRequestManagementPage', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders pending state when data is loading', () => {
    mockUseCustomerUserClaimRequest.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    })

    render(<CustomerUserClaimRequestManagementPage />)
    expect(screen.getByTestId('pending-view')).toBeDefined()
  })

  it('renders error state when query fails or data is missing', () => {
    mockUseCustomerUserClaimRequest.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Network error'),
      refetch: vi.fn(),
    })

    render(<CustomerUserClaimRequestManagementPage />)
    expect(screen.getByTestId('error-view')).toBeDefined()
  })

  it('renders all sections and passes expected props on success', () => {
    const mockClaimRequest = {
      id: 'claim-123',
      businessKey: 'BK-123',
      status: 'IN_ASSESSMENT',
      createdBy: 'user-456',
      documents: [{ id: 'doc-1' }],
      attachments: [{ id: 'att-1' }],
      statusHistory: [],
      assignmentHistory: [],
    }

    mockUseCustomerUserClaimRequest.mockReturnValue({
      data: mockClaimRequest,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })

    render(<CustomerUserClaimRequestManagementPage />)

    expect(screen.getByTestId('last-status-section')).toBeDefined()
    expect(screen.getByTestId('assign-section')).toBeDefined()

    const infoList = screen.getByTestId('info-list-section')
    expect(infoList).toBeDefined()
    expect(infoList.getAttribute('data-adjustment-link')).toBe(
      '/agent/claim-requests/$claimRequestId/claim-request-management'
    )

    expect(screen.getByTestId('assessment-items-section')).toBeDefined()
    expect(screen.getByTestId('doctor-responses-section')).toBeDefined()
    expect(screen.getByTestId('duplicated-section')).toBeDefined()
    expect(screen.getByTestId('management-error-section')).toBeDefined()
    expect(screen.getByTestId('objection-section')).toBeDefined()
    expect(screen.getByTestId('attachments-section')).toBeDefined()
    expect(screen.getByTestId('prev-request-section')).toBeDefined()
    expect(screen.getByTestId('documents-section')).toBeDefined()
  })

  it('does not render prev-request section when createdBy is missing', () => {
    const mockClaimRequest = {
      id: 'claim-123',
      businessKey: 'BK-123',
      status: 'IN_ASSESSMENT',
      createdBy: undefined,
      documents: [],
      attachments: [],
    }

    mockUseCustomerUserClaimRequest.mockReturnValue({
      data: mockClaimRequest,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })

    render(<CustomerUserClaimRequestManagementPage />)
    expect(screen.queryByTestId('prev-request-section')).toBeNull()
  })
})
