import { useCallback, useState } from 'react'

import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@iap/ui'
import { useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import {
  type DashboardFilterValues,
  toDashboardFilters,
} from '../model/report-filters'
import { type ReportTab, isReportTab } from '../model/report-tabs'
import { AgreementsReportTable } from './agreements-report-table'
import { AssigneeReportTable } from './assignee-report-table'
import { DistributionReportTable } from './distribution-report-table'

export function DashboardPage() {
  const { t } = useTranslation()
  const [showReports, setShowReports] = useState(false)
  const router = useRouter()
  const search = router.state.location.search as Record<string, unknown>
  const filters = toDashboardFilters(search)
  const reportTab =
    typeof search.reportTab === 'string' && isReportTab(search.reportTab)
      ? search.reportTab
      : 'reportCountByAssigneeSummary'
  const setFilters = useCallback(
    (updater: (previous: DashboardFilterValues) => DashboardFilterValues) => {
      router.navigate({
        replace: true,
        search: (previous) => updater(toDashboardFilters(previous)) as never,
        to: './',
      })
    },
    [router]
  )
  const setReportTab = useCallback(
    (value: string) => {
      if (!isReportTab(value)) return

      setFilters((previous) => ({ ...previous, reportTab: value }))
    },
    [setFilters]
  )

  if (!showReports) {
    return (
      <section>
        <h1 className='mb-6 text-2xl font-bold tracking-tight'>
          {t('dashboard.title')}
        </h1>
        <div className='flex justify-center'>
          <Button onClick={() => setShowReports(true)}>
            {t('dashboard.reports.actions.showReport')}
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section>
      <h1 className='mb-6 text-2xl font-bold tracking-tight'>
        {t('dashboard.title')}
      </h1>
      <DashboardReports
        filters={filters}
        onFiltersChange={setFilters}
        reportTab={reportTab}
        setReportTab={setReportTab}
      />
    </section>
  )
}

function DashboardReports(props: {
  filters: DashboardFilterValues
  onFiltersChange: (
    updater: (previous: DashboardFilterValues) => DashboardFilterValues
  ) => void
  reportTab: ReportTab
  setReportTab: (value: string) => void
}) {
  const { filters, onFiltersChange, reportTab, setReportTab } = props
  const { t } = useTranslation()

  return (
    <Tabs
      className='w-full'
      dir='rtl'
      onValueChange={setReportTab}
      value={reportTab}
    >
      <TabsList className='grid h-auto w-full grid-cols-1 gap-2 md:grid-cols-5'>
        <TabsTrigger value='reportCountByAssigneeSummary'>
          {t('dashboard.reports.tabs.reportCountByAssigneeSummary')}
        </TabsTrigger>
        <TabsTrigger value='reportCountByAssignee'>
          {t('dashboard.reports.tabs.reportCountByAssignee')}
        </TabsTrigger>
        <TabsTrigger value='reportSumByAssignee'>
          {t('dashboard.reports.tabs.reportSumByAssignee')}
        </TabsTrigger>
        <TabsTrigger value='reportDistributionByStatus'>
          {t('dashboard.reports.tabs.reportDistributionByStatus')}
        </TabsTrigger>
        <TabsTrigger value='agreementsWithoutMainAssessmentUser'>
          {t('dashboard.reports.tabs.agreementsWithoutMainAssessmentUser')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value='reportCountByAssigneeSummary'>
        <AssigneeReportTable
          filters={filters}
          kind='countSummary'
          onFiltersChange={onFiltersChange}
        />
      </TabsContent>
      <TabsContent value='reportCountByAssignee'>
        <AssigneeReportTable
          filters={filters}
          kind='count'
          onFiltersChange={onFiltersChange}
        />
      </TabsContent>
      <TabsContent value='reportSumByAssignee'>
        <AssigneeReportTable
          filters={filters}
          kind='sum'
          onFiltersChange={onFiltersChange}
        />
      </TabsContent>
      <TabsContent value='reportDistributionByStatus'>
        <DistributionReportTable
          filters={filters}
          onFiltersChange={onFiltersChange}
        />
      </TabsContent>
      <TabsContent value='agreementsWithoutMainAssessmentUser'>
        <AgreementsReportTable />
      </TabsContent>
    </Tabs>
  )
}
