import { useMemo } from 'react'

import { DashboardReportTableHeader } from '@features/dashboard/components/dashboard-report-table-header'
import { dashboardService } from '@features/dashboard/services/dashboard-service'
import type { AgreementWithoutMainAssessmentUser } from '@iap/api-types'
import { formatDateTime } from '@iap/ui'
import {
  DataTableColumnHeader,
  SimpleDataTable,
  TwoLineCell,
  TwoLineHeader,
} from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

export function ReportAgreementsWithoutMainAssessmentUserTable() {
  const { t } = useTranslation()
  const { data, isFetching, isLoading, refetch } = useQuery({
    gcTime: 10 * 60 * 1000,
    queryFn: ({ signal }) =>
      dashboardService.findAgreementsWithoutMainAssessmentUser({ signal }),
    queryKey: ['dashboard-agreements-without-main-assessment-user'],
    staleTime: 10 * 60 * 1000,
  })

  const columns = useMemo<ColumnDef<AgreementWithoutMainAssessmentUser>[]>(
    () => [
      {
        accessorKey: 'extContractId',
        cell: ({ row }) => (
          <TwoLineCell
            primary={row.original.extContractId}
            primaryClassName='font-mono text-xs'
            secondary={row.original.extPolicyId}
            secondaryClassName='font-mono text-xs'
          />
        ),
        enableSorting: false,
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('agreements.columns.extContractId')}
            secondary={t('agreements.columns.extPolicyId')}
          />
        ),
      },
      {
        accessorKey: 'title',
        cell: ({ row }) => (
          <TwoLineCell
            longTextPrimary
            primary={row.original.title}
            secondary={row.original.extLocation}
          />
        ),
        enableSorting: false,
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('agreements.columns.title')}
            secondary={t('agreements.columns.extLocation')}
          />
        ),
        meta: { className: 'max-w-70' },
      },
      {
        accessorKey: 'code',
        cell: ({ row }) => (
          <span className='font-mono text-xs'>{row.original.code ?? '-'}</span>
        ),
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('agreements.columns.code')}
          />
        ),
      },
      {
        accessorKey: 'status',
        cell: ({ row }) => {
          const { status, templateCode } = row.original

          return (
            <TwoLineCell
              primary={
                status
                  ? t(`agreements.status.${status.toLowerCase()}` as never)
                  : null
              }
              secondary={templateCode}
            />
          )
        },
        enableSorting: false,
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('agreements.columns.status')}
            secondary={t('agreements.columns.templateCode')}
          />
        ),
      },
      {
        accessorKey: 'fromDate',
        cell: ({ row }) => (
          <TwoLineCell
            primary={formatDateTime(row.original.fromDate)}
            secondary={formatDateTime(row.original.thruDate)}
          />
        ),
        enableSorting: false,
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('agreements.columns.fromDate')}
            secondary={t('agreements.columns.thruDate')}
          />
        ),
      },
    ],
    [t]
  )

  const table = useReactTable({
    columns,
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
    getRowId: (agreement, index) => agreement.id ?? String(index),
  })

  return (
    <>
      <DashboardReportTableHeader isLoading={isFetching} onRefetch={refetch} />
      <SimpleDataTable
        emptyStateText={t(
          'dashboard.reports.empty.agreementsWithoutMainAssessmentUser'
        )}
        isLoading={isLoading}
        loadingText={t('common.loading')}
        table={table}
        tableWrapperClassName='w-full min-w-0 max-w-full overflow-x-auto rounded-md border'
      />
    </>
  )
}

export default ReportAgreementsWithoutMainAssessmentUserTable
