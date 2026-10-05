import { useMemo } from 'react'

import type { AgreementWithoutMainAssessmentUser } from '@iap/api-types'
import { SimpleDataTable, TwoLineCell } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { dashboardService } from '../services/dashboard-service'
import { DashboardReportHeader } from './dashboard-report-header'

const columnHelper = createColumnHelper<AgreementWithoutMainAssessmentUser>()

export function AgreementsReportTable() {
  const { t } = useTranslation()
  const query = useQuery({
    queryFn: ({ signal }) =>
      dashboardService.findAgreementsWithoutMainAssessmentUser(signal),
    queryKey: ['dashboard', 'agreements-without-main-assessment-user'],
    staleTime: 10 * 60 * 1000,
  })
  const columns = useMemo(
    () => [
      columnHelper.accessor('extContractId', {
        cell: (context) => (
          <TwoLineCell
            primary={context.row.original.extContractId}
            primaryClassName='font-mono text-xs'
            secondary={context.row.original.extPolicyId}
            secondaryClassName='font-mono text-xs'
          />
        ),
        header: t('dashboard.reports.columns.extContractId'),
      }),
      columnHelper.accessor('title', {
        cell: (context) => (
          <TwoLineCell
            primary={context.row.original.title}
            secondary={context.row.original.extLocation}
          />
        ),
        header: t('dashboard.reports.columns.title'),
      }),
      columnHelper.accessor('code', {
        cell: (context) => (
          <span className='font-mono text-xs'>{context.getValue() ?? '–'}</span>
        ),
        header: t('dashboard.reports.columns.code'),
      }),
      columnHelper.accessor('status', {
        cell: (context) =>
          context.getValue()
            ? t(
                `dashboard.reports.agreementStatuses.${context.getValue()}` as never
              )
            : '–',
        header: t('dashboard.reports.columns.status'),
      }),
      columnHelper.accessor('fromDate', {
        cell: (context) => (
          <TwoLineCell
            primary={context.row.original.fromDate}
            secondary={context.row.original.thruDate}
          />
        ),
        header: t('dashboard.reports.columns.fromDate'),
      }),
    ],
    [t]
  )
  const table = useReactTable({
    columns,
    data: query.data ?? [],
    getCoreRowModel: getCoreRowModel(),
    getRowId: (agreement, index) => agreement.id ?? String(index),
  })

  return (
    <>
      <DashboardReportHeader
        isFetching={query.isFetching}
        onRefresh={() => void query.refetch()}
      />
      <SimpleDataTable
        isLoading={query.isLoading}
        labels={{
          empty: t(
            'dashboard.reports.empty.agreementsWithoutMainAssessmentUser'
          ),
          loading: t('common.loading'),
        }}
        table={table}
      />
    </>
  )
}
