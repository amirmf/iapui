import { OutpatientDocAcceptanceRowActions } from '@features/outpatient-doc-acceptances/components/outpatient-doc-acceptance-row-actions'
import {
  OUTPATIENT_DOC_ACCEPTANCE_STATUS_TRANSLATION_KEYS,
  OUTPATIENT_DOC_ACCEPTANCE_WS_STATUS_TRANSLATION_KEYS,
  outpatientDocAcceptanceStatusColors,
  outpatientDocAcceptanceWsStatusColors,
} from '@features/outpatient-doc-acceptances/constants/outpatient-doc-acceptance-status'
import { useOutpatientDocAcceptance } from '@features/outpatient-doc-acceptances/context/store/outpatient-doc-acceptance-store'
import type { OutpatientDocAcceptanceStatus } from '@iap/api-types'
import type { OutpatientDocAcceptance } from '@iap/api-types'
import { cn } from '@iap/ui'
import { formatDateTime } from '@iap/ui'
import { Badge } from '@iap/ui'
import { Button } from '@iap/ui'
import { DataTableColumnHeader } from '@shared/tables'
import { TwoLineCell, TwoLineHeader } from '@shared/tables'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

export const useOutpatientDocAcceptanceColumns =
  (): ColumnDef<OutpatientDocAcceptance>[] => {
    const { t } = useTranslation()
    const { openDialog } = useOutpatientDocAcceptance()

    return [
      {
        accessorKey: 'exId',
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('outpatientDocAcceptances.columns.exId')}
            secondary={t('outpatientDocAcceptances.columns.letterNo')}
          />
        ),
        cell: ({ row }) => (
          <TwoLineCell
            primary={row.original.exId ?? null}
            secondary={row.original.letterNo ?? null}
          />
        ),
        meta: { className: 'max-w-40' },
      },
      {
        accessorKey: 'deliveryDate',
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('outpatientDocAcceptances.columns.deliveryDate')}
            secondary={t('outpatientDocAcceptances.columns.updatedAt')}
          />
        ),
        cell: ({ row }) => (
          <TwoLineCell
            primary={row.original.deliveryDate}
            secondary={formatDateTime(row.original.updatedAt)}
          />
        ),
        meta: { className: 'max-w-48' },
      },
      {
        accessorKey: 'totalAmount',
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('outpatientDocAcceptances.columns.totalAmount')}
            secondary={t('outpatientDocAcceptances.columns.claimCount')}
          />
        ),
        cell: ({ row }) => (
          <TwoLineCell
            primary={row.original.totalAmount?.toLocaleString('en-US') ?? null}
            secondary={row.original.claimCount ?? null}
          />
        ),
        meta: { className: 'max-w-36' },
      },
      {
        accessorKey: 'policyId',
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('outpatientDocAcceptances.columns.policyId')}
          />
        ),
        cell: ({ row }) => row.original.policyId ?? '-',
        meta: { className: 'max-w-32' },
      },
      {
        id: 'inqueryStatusTitle',
        accessorFn: (row) =>
          row.inqueryStatusTitle ?? row.outpatientClaim?.inqueryStatusTitle,
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('outpatientDocAcceptances.columns.inqueryStatusTitle')}
            secondary={t('outpatientDocAcceptances.columns.inqueryStatusId')}
          />
        ),
        cell: ({ row }) => (
          <TwoLineCell
            primary={row.getValue('inqueryStatusTitle')}
            secondary={
              row.original.inqueryStatusId ??
              row.original.outpatientClaim?.inqueryStatusId ??
              null
            }
            longTextPrimary
          />
        ),
        meta: { className: 'max-w-48' },
      },
      {
        accessorKey: 'opUnitId',
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('outpatientDocAcceptances.columns.opUnitId')}
            secondary={t('outpatientDocAcceptances.columns.extLocationId')}
          />
        ),
        cell: ({ row }) => (
          <TwoLineCell
            primary={row.original.opUnitId ?? null}
            secondary={row.original.extLocationId ?? null}
          />
        ),
        meta: { className: 'max-w-40' },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('outpatientDocAcceptances.columns.status')}
            secondary={t('outpatientDocAcceptances.columns.wsStatus')}
          />
        ),
        cell: ({ row }) => {
          const status = row.getValue(
            'status'
          ) as OutpatientDocAcceptanceStatus | null
          const wsStatus = row.original.wsStatus ?? null
          const statusColorClass =
            status && outpatientDocAcceptanceStatusColors[status]
          const wsStatusColorClass =
            wsStatus && outpatientDocAcceptanceWsStatusColors[wsStatus]
          const statusTranslationKey =
            status && OUTPATIENT_DOC_ACCEPTANCE_STATUS_TRANSLATION_KEYS[status]
          const wsStatusTranslationKey =
            wsStatus &&
            OUTPATIENT_DOC_ACCEPTANCE_WS_STATUS_TRANSLATION_KEYS[wsStatus]

          return (
            <div className='flex flex-col gap-1 text-sm'>
              <Badge
                variant='outline'
                className={cn('w-fit capitalize', statusColorClass)}
              >
                {statusTranslationKey
                  ? t(statusTranslationKey)
                  : status?.replace('_', ' ') || '-'}
              </Badge>
              {wsStatus ? (
                <Badge
                  variant='outline'
                  className={cn('w-fit capitalize', wsStatusColorClass)}
                >
                  {wsStatusTranslationKey
                    ? t(wsStatusTranslationKey)
                    : wsStatus.replace('_', ' ')}
                </Badge>
              ) : (
                <div className='text-sm text-muted-foreground'>-</div>
              )}
            </div>
          )
        },
        meta: { className: 'max-w-52' },
      },
      {
        id: 'terminate',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('outpatientDocAcceptances.actions.terminate')}
          />
        ),
        cell: ({ row }) => (
          <Button
            size='sm'
            variant='outline'
            onClick={() => openDialog('terminate', row.original)}
          >
            {t('outpatientDocAcceptances.actions.terminate')}
          </Button>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => <OutpatientDocAcceptanceRowActions row={row} />,
        meta: { className: 'sticky left-0 bg-background w-12 max-w-12' },
      },
    ]
  }
