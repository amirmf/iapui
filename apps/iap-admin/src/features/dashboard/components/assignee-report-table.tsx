import { useMemo } from 'react'

import {
  type DashboardFilterValues,
  toDashboardReportFilters,
} from '@features/dashboard/route-adapters/report-filters'
import type {
  AssigneeStatusCountReport,
  AssigneeStatusSumReport,
} from '@iap/api-types'
import { PivotTable, type PivotValueField } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { dashboardService } from '../services/dashboard-service'
import { DashboardFilters as DashboardFiltersForm } from './dashboard-filters'
import { DashboardReportHeader } from './dashboard-report-header'

type ReportKind = 'count' | 'countSummary' | 'sum'

const reportQueries = {
  count: dashboardService.reportCountByAssignee,
  countSummary: dashboardService.reportCountByAssigneeSummary,
  sum: dashboardService.reportSumByAssignee,
}

function toPivotRows(
  data: Array<AssigneeStatusCountReport | AssigneeStatusSumReport>,
  translateStatus: (status: string) => string
) {
  return data.map((item) => ({
    amount: 'amount' in item ? (item.amount ?? 0) : 0,
    assignedUserDisplayName: item.assignedUserDisplayName ?? '–',
    count: 'count' in item ? (item.count ?? 0) : 0,
    statusLabel: item.status ? translateStatus(item.status) : '–',
    totalSumAmount: 'totalSumAmount' in item ? (item.totalSumAmount ?? 0) : 0,
  }))
}

export function AssigneeReportTable(props: {
  filters: DashboardFilterValues
  kind: ReportKind
  onFiltersChange: (
    updater: (previous: DashboardFilterValues) => DashboardFilterValues
  ) => void
}) {
  const { filters, kind, onFiltersChange } = props
  const { t } = useTranslation()
  const reportFilters = useMemo(
    () => toDashboardReportFilters(filters),
    [filters]
  )
  const query = useQuery({
    queryFn: ({ signal }) =>
      reportQueries[kind]({ filters: reportFilters, signal }),
    queryKey: ['dashboard', kind, reportFilters],
    staleTime: 10 * 60 * 1000,
  })
  const data = useMemo(
    () =>
      toPivotRows(query.data ?? [], (status) =>
        t(`dashboard.reports.statuses.${status}` as never)
      ),
    [query.data, t]
  )
  const valueFields = useMemo<
    readonly PivotValueField<(typeof data)[number]>[]
  >(
    () =>
      kind === 'sum'
        ? [
            { field: 'amount', label: t('dashboard.reports.columns.amount') },
            {
              field: 'totalSumAmount',
              label: t('dashboard.reports.columns.totalSumAmount'),
            },
          ]
        : [{ field: 'count', label: t('dashboard.reports.columns.count') }],
    [kind, t]
  )

  return (
    <>
      <DashboardReportHeader
        isFetching={query.isFetching}
        onRefresh={() => void query.refetch()}
      />
      <DashboardFiltersForm onChange={onFiltersChange} values={filters} />
      <PivotTable
        columnField='statusLabel'
        csvLabel={t('dashboard.download')}
        data={data}
        exportFileName={`report-${kind}`}
        isLoading={query.isLoading}
        labels={{
          empty: t('common.noRecords'),
          loading: t('common.loading'),
          total: t('common.total'),
        }}
        pdfLabel={t('dashboard.download')}
        rowField='assignedUserDisplayName'
        rowHeaderLabel={t('dashboard.reports.columns.assignedUserDisplayName')}
        valueFields={valueFields}
      />
    </>
  )
}
