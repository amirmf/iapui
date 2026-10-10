import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CustomerUserDashboardPage } from './components/customer-user-dashboard-page'

const navigateMock = vi.fn()

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({
    search: { reportTab: 'reportCountByAssigneeSummary' },
  }),
  useRouter: () => ({
    navigate: navigateMock,
    state: { location: { search: {} } },
  }),
}))

vi.mock('@features/dashboard', () => ({
  ReportCountByAssigneeSummaryTable: () => (
    <div data-testid='report-count-by-assignee-summary-table' />
  ),
  ReportCountByAssigneeTable: () => (
    <div data-testid='report-count-by-assignee-table' />
  ),
  ReportDistributionByStatusTable: () => (
    <div data-testid='report-distribution-by-status-table' />
  ),
  ReportSumByAssigneeTable: () => (
    <div data-testid='report-sum-by-assignee-table' />
  ),
}))

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <CustomerUserDashboardPage />
    </QueryClientProvider>
  )
}

describe('CustomerUserDashboardPage', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders initial state with title and show report button', () => {
    renderPage()

    expect(screen.getByRole('heading', { level: 1 })).toBeDefined()
    expect(
      screen.getByRole('button', {
        name: 'dashboard.reports.actions.showReport',
      })
    ).toBeDefined()
  })

  it('clicking show report reveals the 4 customer user report tabs', () => {
    renderPage()

    const showButton = screen.getByRole('button', {
      name: 'dashboard.reports.actions.showReport',
    })
    fireEvent.click(showButton)

    expect(
      screen.getByRole('tab', {
        name: 'dashboard.reports.tabs.reportCountByAssigneeSummary',
      })
    ).toBeDefined()
    expect(
      screen.getByRole('tab', {
        name: 'dashboard.reports.tabs.reportCountByAssignee',
      })
    ).toBeDefined()
    expect(
      screen.getByRole('tab', {
        name: 'dashboard.reports.tabs.reportSumByAssignee',
      })
    ).toBeDefined()
    expect(
      screen.getByRole('tab', {
        name: 'dashboard.reports.tabs.reportDistributionByStatus',
      })
    ).toBeDefined()

    // Parity check: Customer user dashboard must not render agreementsWithoutMainAssessmentUser
    expect(
      screen.queryByRole('tab', {
        name: 'dashboard.reports.tabs.agreementsWithoutMainAssessmentUser',
      })
    ).toBeNull()
  })

  it('renders table content for active tab', () => {
    renderPage()

    const showButton = screen.getByRole('button', {
      name: 'dashboard.reports.actions.showReport',
    })
    fireEvent.click(showButton)

    expect(
      screen.getByTestId('report-count-by-assignee-summary-table')
    ).toBeDefined()
  })

  it('navigates with reportTab when clicking another tab', async () => {
    const user = userEvent.setup()
    renderPage()

    const showButton = screen.getByRole('button', {
      name: 'dashboard.reports.actions.showReport',
    })
    await user.click(showButton)

    const assigneeTab = screen.getByRole('tab', {
      name: 'dashboard.reports.tabs.reportCountByAssignee',
    })
    await user.click(assigneeTab)

    expect(navigateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        replace: true,
        to: './',
      })
    )
  })
})
