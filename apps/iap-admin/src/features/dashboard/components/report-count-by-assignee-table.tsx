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

export interface ReportCountByAssigneeTableProps {
  filters: DashboardFilters
}

interface PivotData extends Record<string, unknown> {
  assignedUserDisplayName: string
  assignedUserUsername: string
  count: number
  status?: ClaimRequestStatus | null
  statusLabel: string
}

export function ReportCountByAssigneeTable(
  props: ReportCountByAssigneeTableProps
) {
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
      dashboardService.reportCountByAssignee({ filters: finalFilters, signal }),
    queryKey: ['dashboard-report-count-by-assignee', finalFilters],
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
          assignedUserDisplayName: item.assignedUserDisplayName ?? '-',
          assignedUserUsername: item.assignedUserUsername ?? '-',
          count: item.count ?? 0,
          statusLabel: statusTranslationKey
            ? t(statusTranslationKey as never)
            : '-',
        }
      }),
    [data, t]
  )

  const valueFields = useMemo<readonly PivotValueField<PivotData>[]>(
    () => [{ field: 'count', label: 'count' }],
    []
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
        exportFileName='report-count-by-assignee'
        isLoading={isLoading || isFetching}
        rowField='assignedUserDisplayName'
        rowHeaderLabel={t('dashboard.reports.columns.assignedUserDisplayName')}
        valueFields={valueFields}
      />
    </>
  )
}

export default ReportCountByAssigneeTable
