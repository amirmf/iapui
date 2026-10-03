import { useMemo } from 'react'

import type {
  OutpatientDocAcceptance,
  OutpatientDocAcceptanceStatus,
} from '@iap/api-types'
import { Badge, cn, formatDateTime } from '@iap/ui'
import { TwoLineCell, TwoLineHeader } from '@shared/tables'
import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { outpatientDocAcceptanceStatusColors } from '../constants/outpatient-doc-acceptance-status'
import { ClaimReportRowActions } from './claim-report-row-actions'

const columnHelper = createColumnHelper<OutpatientDocAcceptance>()

function renderStatusBadge(
  status: OutpatientDocAcceptanceStatus | null | undefined,
  statusLabel?: string
) {
  const statusColorClass = status && outpatientDocAcceptanceStatusColors[status]

  return (
    <Badge
      className={cn('w-fit capitalize', statusColorClass)}
      variant='outline'
    >
      {statusLabel ?? (status?.replace('_', ' ') || '-')}
    </Badge>
  )
}

export function useClaimReportColumns() {
  const { t } = useTranslation()
  const statusLabels = useMemo<Record<OutpatientDocAcceptanceStatus, string>>(
    () => ({
      DELETED: t('outpatientDocAcceptances.status.DELETED'),
      FAILED: t('outpatientDocAcceptances.status.FAILED'),
      REJECT: t('outpatientDocAcceptances.status.REJECT'),
      SENT_TO_SERVER: t('outpatientDocAcceptances.status.SENT_TO_SERVER'),
      SUBMIT: t('outpatientDocAcceptances.status.SUBMIT'),
      SUCCESS: t('outpatientDocAcceptances.status.SUCCESS'),
    }),
    [t]
  )

  return useMemo(
    () => [
      columnHelper.accessor('exId', {
        cell: (context) => (
          <TwoLineCell
            primary={context.getValue()}
            secondary={context.row.original.outpatientClaim?.exId}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('claimReports.columns.exId')}
            secondary={t('claimReports.columns.outpatientClaim.claimNo')}
          />
        ),
      }),
      columnHelper.accessor('policyId', {
        cell: (context) => (
          <TwoLineCell
            primary={context.getValue()}
            secondary={context.row.original.outpatientClaim?.claimNo}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('claimReports.columns.policyId')}
            secondary={t('claimReports.columns.outpatientClaim.claimNo')}
          />
        ),
      }),
      columnHelper.accessor('totalAmount', {
        cell: (context) => (
          <TwoLineCell
            primary={context.getValue()?.toLocaleString('en-US')}
            secondary={context.row.original.claimCount}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('claimReports.columns.totalAmount')}
            secondary={t('claimReports.columns.claimCount')}
          />
        ),
      }),
      columnHelper.accessor(
        (row) =>
          row.inqueryStatusTitle ?? row.outpatientClaim?.inqueryStatusTitle,
        {
          cell: (context) => (
            <TwoLineCell
              longTextPrimary
              primary={context.getValue()}
              secondary={context.row.original.extLocationId}
            />
          ),
          header: ({ column }) => (
            <TwoLineHeader
              column={column}
              primary={t(
                'claimReports.columns.outpatientClaim.inqueryStatusTitle'
              )}
              secondary={t('claimReports.columns.extLocationId')}
            />
          ),
          id: 'inqueryStatusTitle',
        }
      ),
      columnHelper.accessor('status', {
        cell: (context) => {
          const status = context.getValue()

          return (
            <div className='flex flex-col gap-1 text-sm'>
              {renderStatusBadge(
                status,
                status ? statusLabels[status] : undefined
              )}
            </div>
          )
        },
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('claimReports.columns.status')}
          />
        ),
        meta: { className: 'max-w-52' },
      }),
      columnHelper.accessor('deliveryDate', {
        cell: (context) => (
          <TwoLineCell
            primary={context.getValue()}
            secondary={formatDateTime(context.row.original.updatedAt)}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('claimReports.columns.deliveryDate')}
            secondary={t('claimReports.columns.updatedAt')}
          />
        ),
      }),
      columnHelper.display({
        cell: (context) => (
          <ClaimReportRowActions
            extId={context.row.original.exId}
            outpatientDocAcceptanceId={context.row.original.id}
          />
        ),
        id: 'actions',
        enableSorting: false,
        meta: { className: 'sticky left-0 bg-background w-30 max-w-30' },
      }),
    ],
    [statusLabels, t]
  )
}
