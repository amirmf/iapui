// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AgentClaimRequestForm } from './agent-claim-request-form'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('../../../services/agent-claim-request-service', () => ({
  default: {
    inquiry: vi.fn().mockResolvedValue({
      selectedUser: {
        userId: 'u1',
        username: '0123456789',
        displayName: 'Ahmad Reza',
      },
      policies: [{ id: 10, planId: 1, title: 'Sample Policy' }],
    }),
    getSubInsuredPeople: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({ id: 'c1' }),
  },
}))

vi.mock('@modules/files', () => ({
  FileUploader: () => <div data-testid='file-uploader'>File Uploader</div>,
}))

vi.mock('@modules/doc-types', () => ({
  useDocTypesData: () => ({
    data: [
      { id: '1', docType: 'Lab', docTypeCode: 'LAB', documentGuide: 'Guide' },
    ],
    isLoading: false,
  }),
}))

vi.mock('@iap/support', () => ({
  SupportFeatureButton: () => <span>Help</span>,
}))

vi.mock('@iap/ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@iap/ui')>()
  return {
    ...actual,
    DatePicker: () => <input data-testid='date-picker' />,
    SearchableSelect: (props: { placeholder?: string }) => (
      <div data-testid='searchable-select'>{props.placeholder}</div>
    ),
  }
})

describe('AgentClaimRequestForm', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    vi.clearAllMocks()
  })

  afterEach(cleanup)

  it('renders all form fields and submit button', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AgentClaimRequestForm />
      </QueryClientProvider>
    )

    expect(
      screen.getByText('agent.claimRequests.create.fields.inquiryNationalCode')
    ).toBeDefined()
    expect(
      screen.getByText('claimRequests.dialog.fields.insurancePolicy')
    ).toBeDefined()
    expect(
      screen.getByText('claimRequests.dialog.fields.subInsuredPerson')
    ).toBeDefined()
    expect(
      screen.getByText('claimRequests.dialog.fields.submitDate')
    ).toBeDefined()
    expect(
      screen.getByText('myiap.createClaimPage.submitDateAlertTitle')
    ).toBeDefined()
    expect(
      screen.getByText('claimRequests.dialog.fields.attachments')
    ).toBeDefined()
    expect(screen.getByTestId('file-uploader')).toBeDefined()
    expect(
      screen.getByRole('button', { name: 'claimRequests.create' })
    ).toBeDefined()
  })
})
