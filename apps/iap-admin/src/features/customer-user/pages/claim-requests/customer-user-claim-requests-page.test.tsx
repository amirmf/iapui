import { claimRequestService } from '@features/claim-requests'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CustomerUserClaimRequestsPage } from './customer-user-claim-requests-page'

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
  useLocation: () => ({
    search: { quickStatus: 'ALL' },
  }),
  useRouter: () => ({
    navigate: vi.fn(),
  }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))

vi.mock('@features/claim-requests', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@features/claim-requests')>()
  return {
    ...actual,
    claimRequestService: {
      ...actual.claimRequestService,
      getPageLite: vi.fn().mockResolvedValue({
        content: [
          {
            id: 'cr-1',
            extNationalCode: '1234567890',
            extDisplayName: 'بیمه‌گذار تست',
            businessKey: 'BK-100',
            amount: 5000000,
            status: 'IN_ASSESSMENT',
          },
        ],
        totalElements: 1,
        totalPages: 1,
        pageNumber: 0,
        pageSize: 20,
      }),
    },
    ClaimRequestDataTableToolbar: ({ count }: { count?: number }) => (
      <div data-testid='claim-request-data-table-toolbar'>count-{count}</div>
    ),
    ClaimRequestExportExcelButton: () => (
      <button data-testid='excel-btn'>Export Excel</button>
    ),
  }
})

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <CustomerUserClaimRequestsPage />
    </QueryClientProvider>
  )
}

describe('CustomerUserClaimRequestsPage', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders title, header actions, toolbar, and data table', async () => {
    renderPage()

    expect(
      screen.getByRole('heading', {
        name: 'customerUser.claimRequests.title',
      })
    ).toBeDefined()

    expect(
      screen.getByRole('button', { name: 'claimRequests.refresh' })
    ).toBeDefined()

    expect(
      await screen.findByTestId('claim-request-data-table-toolbar')
    ).toBeDefined()
  })

  it('passes effectiveFilters with skipCurrentUserFilter to getPageLite', async () => {
    renderPage()

    await screen.findByTestId('claim-request-data-table-toolbar')

    expect(claimRequestService.getPageLite).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: expect.objectContaining({
          skipCurrentUserFilter: 'Y',
          sort: 'createdAt',
          direction: 'asc',
        }),
      })
    )
  })
})
