import { useMemo } from 'react'

import { DashboardPivotTableToolbar } from '@features/dashboard/components/dashboard-pivot-table-toolbar'
import { DashboardReportTableHeader } from '@features/dashboard/components/dashboard-report-table-header'
import { dashboardService } from '@features/dashboard/services/dashboard-service'
import {
  type StatusDistributionPivotData,
  getDistributionReportFilters,
  toStatusDistributionPivotData,
} from '@features/dashboard/utils/report-distribution-by-status'
import type { DashboardFilters } from '@iap/api-types'
import { PivotTable, type PivotValueField } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

export interface ReportDistributionByStatusTableProps {
  filters: DashboardFilters
}

export function ReportDistributionByStatusTable(
  props: ReportDistributionByStatusTableProps
) {
  const { filters } = props
  const { t } = useTranslation()

  const finalFilters = useMemo(
    () => getDistributionReportFilters(filters),
    [filters]
  )

  const { data, isFetching, isLoading, refetch } = useQuery({
    gcTime: 10 * 60 * 1000,
    queryFn: ({ signal }) =>
      dashboardService.reportDistributionByStatus({
        filters: finalFilters,
        signal,
      }),
    queryKey: ['dashboard-report-distribution-by-status', finalFilters],
    staleTime: 10 * 60 * 1000,
  })

  const pivotData = useMemo(
    () => toStatusDistributionPivotData(data ?? [], t),
    [data, t]
  )

  const valueFields = useMemo<
    readonly PivotValueField<StatusDistributionPivotData>[]
  >(
    () => [
      { field: 'count', label: t('dashboard.reports.columns.count') },
      { field: 'amount', label: t('dashboard.reports.columns.amount') },
      {
        field: 'totalSumAmount',
        label: t('dashboard.reports.columns.totalSumAmount'),
      },
    ],
    [t]
  )

  return (
    <>
      <DashboardReportTableHeader
        isLoading={isLoading || isFetching}
        onRefetch={refetch}
      />
      <DashboardPivotTableToolbar />
      <PivotTable
        columnField='distributionLabel'
        data={pivotData}
        exportFileName='report-distribution-by-status'
        isLoading={isLoading || isFetching}
        rowField='statusLabel'
        rowHeaderLabel={t('dashboard.reports.columns.status')}
        valueFields={valueFields}
      />
    </>
  )
}

export default ReportDistributionByStatusTable
