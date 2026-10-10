import { useCallback, useState } from 'react'

import {
  ReportCountByAssigneeSummaryTable,
  ReportCountByAssigneeTable,
  ReportDistributionByStatusTable,
  ReportSumByAssigneeTable,
} from '@features/dashboard'
import type { DashboardFilters } from '@iap/api-types'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@iap/ui'
import { useLocation, useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function CustomerUserDashboardPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const location = useLocation()
  const search = (location.search ?? {}) as Record<string, unknown>
  const filters = search as DashboardFilters
  const [isReportVisible, setIsReportVisible] = useState(false)

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

  if (!isReportVisible) {
    return (
      <section>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t('dashboard.title')}
          </h1>
        </div>
        <div className='flex items-center justify-center'>
          <Button onClick={() => setIsReportVisible(true)}>
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
        <TabsList className='grid h-auto w-full grid-cols-1 gap-2 md:grid-cols-5'>
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
      </Tabs>
    </section>
  )
}

export default CustomerUserDashboardPage
