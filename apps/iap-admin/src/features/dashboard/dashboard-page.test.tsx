import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DashboardPage } from './components/dashboard-page'
import { useShowReport } from './context/store/report-show-report-store'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({
    navigate: vi.fn(),
    state: { location: { search: {} } },
  }),
}))

vi.mock('./components/report-count-by-assignee-summary-table', () => ({
  ReportCountByAssigneeSummaryTable: () => (
    <div data-testid='report-count-by-assignee-summary-table' />
  ),
}))
vi.mock('./components/report-count-by-assignee-table', () => ({
  ReportCountByAssigneeTable: () => (
    <div data-testid='report-count-by-assignee-table' />
  ),
}))
vi.mock('./components/report-sum-by-assignee-table', () => ({
  ReportSumByAssigneeTable: () => (
    <div data-testid='report-sum-by-assignee-table' />
  ),
}))
vi.mock('./components/report-distribution-by-status-table', () => ({
  ReportDistributionByStatusTable: () => (
    <div data-testid='report-distribution-by-status-table' />
  ),
}))
vi.mock(
  './components/report-agreements-without-main-assessment-user-table',
  () => ({
    ReportAgreementsWithoutMainAssessmentUserTable: () => (
      <div data-testid='report-agreements-without-main-assessment-user-table' />
    ),
  })
)

describe('DashboardPage', () => {
  beforeEach(() => {
    useShowReport.setState({ isShowReport: false })
  })

  it('renders initial state with show report button, then displays tabs on click', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    )

    expect(screen.getByRole('heading', { level: 1 })).toBeDefined()
    const showButton = screen.getByRole('button', {
      name: 'dashboard.reports.actions.showReport',
    })
    expect(showButton).toBeDefined()

    fireEvent.click(showButton)
    expect(useShowReport.getState().isShowReport).toBe(true)

    rerender(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    )

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
    expect(
      screen.getByRole('tab', {
        name: 'dashboard.reports.tabs.agreementsWithoutMainAssessmentUser',
      })
    ).toBeDefined()
  })
})
