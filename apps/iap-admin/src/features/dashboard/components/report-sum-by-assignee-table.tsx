import { useMemo } from 'react'

import { CLAIM_REQUEST_STATUS_TRANSLATION_KEYS } from '@features/claim-requests'
import { DashboardPivotTableToolbar } from '@features/dashboard/components/dashboard-pivot-table-toolbar'
import { DashboardReportTableHeader } from '@features/dashboard/components/dashboard-report-table-header'
import { dashboardService } from '@features/dashboard/services/dashboard-service'
import type { ClaimRequestStatus, DashboardFilters } from '@iap/api-types'
import { PivotTable, type PivotValueField } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { useTranslation } from 'react-i18next'

export interface ReportSumByAssigneeTableProps {
  filters: DashboardFilters
}

interface PivotData extends Record<string, unknown> {
  amount: number
  assignedUserDisplayName: string
  assignedUserUsername: string
  status?: ClaimRequestStatus | null
  statusLabel: string
  totalSumAmount: number
}

export function ReportSumByAssigneeTable(props: ReportSumByAssigneeTableProps) {
  const { filters } = props
  const { t } = useTranslation()

  const finalFilters = useMemo(
    () =>
      produce(filters, (draft) => {
        if (draft['reportTab']) {
          delete draft['reportTab']
        }
      }),
    [filters]
  )

  const { data, isFetching, isLoading, refetch } = useQuery({
    gcTime: 10 * 60 * 1000,
    queryFn: ({ signal }) =>
      dashboardService.reportSumByAssignee({ filters: finalFilters, signal }),
    queryKey: ['dashboard-report-sum-by-assignee', finalFilters],
    staleTime: 10 * 60 * 1000,
  })

  const pivotData = useMemo<PivotData[]>(
    () =>
      (data ?? []).map((item) => {
        const status = item.status
        const statusTranslationKey =
          status && CLAIM_REQUEST_STATUS_TRANSLATION_KEYS[status]

        return {
          ...item,
          amount: item.amount ?? 0,
          assignedUserDisplayName: item.assignedUserDisplayName ?? '-',
          assignedUserUsername: item.assignedUserUsername ?? '-',
          statusLabel: statusTranslationKey
            ? t(statusTranslationKey as never)
            : '-',
          totalSumAmount: item.totalSumAmount ?? 0,
        }
      }),
    [data, t]
  )

  const valueFields = useMemo<readonly PivotValueField<PivotData>[]>(
    () => [
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
        columnField='statusLabel'
        data={pivotData}
        exportFileName='report-sum-by-assignee'
        isLoading={isLoading || isFetching}
        rowField='assignedUserDisplayName'
        rowHeaderLabel={t('dashboard.reports.columns.assignedUserDisplayName')}
        valueFields={valueFields}
      />
    </>
  )
}

export default ReportSumByAssigneeTable
