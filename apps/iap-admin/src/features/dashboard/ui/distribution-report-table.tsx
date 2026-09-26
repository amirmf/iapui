import { useMemo } from 'react'

import type { StatusDistributionReport } from '@iap/api-types'
import { PivotTable, type PivotValueField } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  type DashboardFilterValues,
  toDashboardReportFilters,
} from '../model/report-filters'
import { dashboardService } from '../services/dashboard-service'
import { DashboardFilters as DashboardFiltersForm } from './dashboard-filters'
import { DashboardReportHeader } from './dashboard-report-header'

function toPivotRows(
  data: StatusDistributionReport[],
  translateStatus: (status: string) => string,
  distributionLabel: string
) {
  return data.map((item) => ({
    amount: item.amount ?? 0,
    count: item.count ?? 0,
    distributionLabel,
    statusLabel: item.status ? translateStatus(item.status) : '–',
    totalSumAmount: item.totalSumAmount ?? 0,
  }))
}

export function DistributionReportTable(props: {
  filters: DashboardFilterValues
  onFiltersChange: (
    updater: (previous: DashboardFilterValues) => DashboardFilterValues
  ) => void
}) {
  const { filters, onFiltersChange } = props
  const { t } = useTranslation()
  const reportFilters = useMemo(
    () => toDashboardReportFilters(filters),
    [filters]
  )
  const query = useQuery({
    queryFn: ({ signal }) =>
      dashboardService.reportDistributionByStatus({
        filters: reportFilters,
        signal,
      }),
    queryKey: ['dashboard', 'distribution-by-status', reportFilters],
    staleTime: 10 * 60 * 1000,
  })
  const data = useMemo(
    () =>
      toPivotRows(
        query.data ?? [],
        (status) => t(`dashboard.reports.statuses.${status}` as never),
        t('dashboard.reports.columns.distribution')
      ),
    [query.data, t]
  )
  const valueFields = useMemo<
    readonly PivotValueField<(typeof data)[number]>[]
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
      <DashboardReportHeader
        isFetching={query.isFetching}
        onRefresh={() => void query.refetch()}
      />
      <DashboardFiltersForm onChange={onFiltersChange} values={filters} />
      <PivotTable
        columnField='distributionLabel'
        csvLabel={t('dashboard.download')}
        data={data}
        exportFileName='report-distribution-by-status'
        isLoading={query.isLoading}
        labels={{
          empty: t('common.noRecords'),
          loading: t('common.loading'),
          total: t('common.total'),
        }}
        pdfLabel={t('dashboard.download')}
        rowField='statusLabel'
        rowHeaderLabel={t('dashboard.reports.columns.status')}
        valueFields={valueFields}
      />
    </>
  )
}
