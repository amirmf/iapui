import { useCallback } from 'react'

import { useShowReport } from '@features/dashboard/context/store/report-show-report-store'
import type { DashboardFilters } from '@iap/api-types'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@iap/ui'
import { useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { ReportAgreementsWithoutMainAssessmentUserTable } from './report-agreements-without-main-assessment-user-table'
import { ReportCountByAssigneeSummaryTable } from './report-count-by-assignee-summary-table'
import { ReportCountByAssigneeTable } from './report-count-by-assignee-table'
import { ReportDistributionByStatusTable } from './report-distribution-by-status-table'
import { ReportSumByAssigneeTable } from './report-sum-by-assignee-table'

export function DashboardPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const search = (router.state.location.search ?? {}) as Record<string, unknown>
  const filters = search as DashboardFilters
  const isShowReport = useShowReport((state) => state.isShowReport)
  const toggleShowReport = useShowReport((state) => state.toggleShowReport)

  const onValueChange = useCallback(
    (value: string) => {
      void router.navigate({
        replace: true,
        search: (query) => {
          const searchQuery = {
            ...(query as Record<string, unknown>),
          }
          searchQuery['reportTab'] = value
          return searchQuery as never
        },
        to: './',
      })
    },
    [router]
  )

  if (!isShowReport) {
    return (
      <section>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t('dashboard.title')}
          </h1>
        </div>
        <div className='flex items-center justify-center'>
          <Button onClick={toggleShowReport}>
            {t('dashboard.reports.actions.showReport')}
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>
          {t('dashboard.title')}
        </h1>
      </div>

      <Tabs
        className='w-full'
        defaultValue='reportCountByAssigneeSummary'
        dir='rtl'
        onValueChange={onValueChange}
        value={(filters['reportTab'] as string) || undefined}
      >
        <TabsList className='grid h-auto w-full grid-cols-1 gap-2 lg:grid-cols-5'>
          <TabsTrigger
            className='transition-colors duration-300 ease-in-out data-[state=active]:bg-primary-500 data-[state=active]:text-muted dark:data-[state=active]:bg-background'
            value='reportCountByAssigneeSummary'
          >
            {t('dashboard.reports.tabs.reportCountByAssigneeSummary')}
          </TabsTrigger>
          <TabsTrigger
            className='transition-colors duration-300 ease-in-out data-[state=active]:bg-primary-500 data-[state=active]:text-muted dark:data-[state=active]:bg-background'
            value='reportCountByAssignee'
          >
            {t('dashboard.reports.tabs.reportCountByAssignee')}
          </TabsTrigger>
          <TabsTrigger
            className='transition-colors duration-300 ease-in-out data-[state=active]:bg-primary-500 data-[state=active]:text-muted dark:data-[state=active]:bg-background'
            value='reportSumByAssignee'
          >
            {t('dashboard.reports.tabs.reportSumByAssignee')}
          </TabsTrigger>
          <TabsTrigger
            className='transition-colors duration-300 ease-in-out data-[state=active]:bg-primary-500 data-[state=active]:text-muted dark:data-[state=active]:bg-background'
            value='reportDistributionByStatus'
          >
            {t('dashboard.reports.tabs.reportDistributionByStatus')}
          </TabsTrigger>
          <TabsTrigger
            className='transition-colors duration-300 ease-in-out data-[state=active]:bg-primary-500 data-[state=active]:text-muted dark:data-[state=active]:bg-background'
            value='agreementsWithoutMainAssessmentUser'
          >
            {t('dashboard.reports.tabs.agreementsWithoutMainAssessmentUser')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value='reportCountByAssignee'>
          <ReportCountByAssigneeTable filters={filters} />
        </TabsContent>

        <TabsContent value='reportCountByAssigneeSummary'>
          <ReportCountByAssigneeSummaryTable filters={filters} />
        </TabsContent>

        <TabsContent value='reportSumByAssignee'>
          <ReportSumByAssigneeTable filters={filters} />
        </TabsContent>

        <TabsContent value='reportDistributionByStatus'>
          <ReportDistributionByStatusTable filters={filters} />
        </TabsContent>

        <TabsContent value='agreementsWithoutMainAssessmentUser'>
          <ReportAgreementsWithoutMainAssessmentUserTable />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default DashboardPage
