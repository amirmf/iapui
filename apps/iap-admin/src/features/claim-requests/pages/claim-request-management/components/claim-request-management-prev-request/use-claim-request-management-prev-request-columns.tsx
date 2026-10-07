import { useMemo } from 'react'

import {
  CLAIM_REQUEST_STATUS_TRANSLATION_KEYS,
  claimStatusColors,
} from '@features/claim-requests/constants/claim-request-status'
import ClaimRequestManagementPrevRequestRowActions from '@features/claim-requests/pages/claim-request-management/components/claim-request-management-prev-request/claim-request-management-prev-request-row-actions'
import {
  type ClaimRequestHistory,
  type ClaimRequestStatus,
} from '@iap/api-types'
import { cn } from '@iap/ui'
import { Badge } from '@iap/ui'
import { LongText } from '@iap/ui'
import { formatDate, formatDateTime } from '@shared/lib/format-date'
import { DataTableColumnHeader } from '@shared/tables'
import { TwoLineCell, TwoLineHeader } from '@shared/tables'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

function useClaimRequestManagementPrevRequestColumns() {
  const { t } = useTranslation()
  return useMemo<ColumnDef<ClaimRequestHistory>[]>(
    () => [
      {
        accessorKey: 'extDisplayName',
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
            column={column}
            primary={t('claimRequests.columns.extDisplayName')}
            secondary={t('claimRequests.columns.businessKey')}
          />
        ),
        cell: ({ row }) => (
          <TwoLineCell
            presentation='reference'
            primary={row.original.extDisplayName}
            secondary={row.original.businessKey}
            longTextPrimary={true}
          />
        ),
        meta: { className: 'max-w-40' },
      },
      {
        accessorKey: 'docType',
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
            column={column}
            primary={t('claimRequests.columns.docType')}
            secondary={t('claimRequests.columns.damageCodes')}
          />
        ),
        cell: ({ row }) => {
          const assessmentItems = row.original.assessmentItems || []

          return (
            <div className=''>
              <LongText>{row.original.docType?.docType || '-'}</LongText>
              {!assessmentItems.length
                ? '-'
                : assessmentItems.map((item, index) => {
                    const title = item.damageCodeTitle || '-'
                    const code = item.damageCode || '-'
                    const amount = item.amount?.toLocaleString('en-US') || '-'
                    const text = `${title} (${code}) - ${amount}`

                    return (
                      <LongText
                        className='mt-1 text-muted-foreground'
                        key={`${item.damageCodeId || code}-${index}`}
                      >
                        {text}
                      </LongText>
                    )
                  })}
            </div>
          )
        },
        meta: {
          className: 'max-w-80',
        },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader
            presentation='reference'
            column={column}
            title={t('claimRequests.columns.status')}
          />
        ),
        cell: ({ row }) => {
          const status = row.original.status
          if (!status) {
            return '-'
          }

          const statusTranslationKey =
            CLAIM_REQUEST_STATUS_TRANSLATION_KEYS[status as ClaimRequestStatus]

          return (
            <Badge
              presentation='reference'
              variant='outline'
              className={cn(
                claimStatusColors[status as ClaimRequestStatus],
                'w-fit rounded-full capitalize'
              )}
            >
              {statusTranslationKey ? t(statusTranslationKey) : status}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'submitDate',
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
            column={column}
            primary={t('claimRequests.columns.submitDate')}
            secondary={t('claimRequests.columns.createdAt')}
          />
        ),
        cell: ({ row }) => (
          <TwoLineCell
            presentation='reference'
            primary={formatDate(row.original.submitDate)}
            secondary={formatDateTime(row.original.createdAt)}
          />
        ),
      },
      {
        accessorKey: 'amount',
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
            column={column}
            primary={t('claimRequests.columns.amount')}
            secondary={t('claimRequests.columns.totalSumAmount')}
          />
        ),
        accessorFn: (row) => row.amount?.toLocaleString('en-US') ?? '-',
        cell: ({ row }) => (
          <div className='flex min-w-0 flex-col gap-1 text-sm'>
            <div className='truncate font-medium'>
              {(row.getValue('amount') as string) ?? '-'}
            </div>
            <div className='flex items-center gap-1 text-xs font-normal text-muted-foreground'>
              <span className='truncate'>
                {row.original.totalSumAmount?.toLocaleString('en-US') ?? '-'}
              </span>
              {row.original.baseClaimRequestId ? (
                <Badge
                  presentation='reference'
                  variant='outline'
                  className='border-red-300 bg-red-100 px-1 text-[10px] leading-4 text-red-700'
                >
                  {t('claimRequests.requestType.adjustment')}
                </Badge>
              ) : null}
            </div>
          </div>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <ClaimRequestManagementPrevRequestRowActions row={row} />
        ),
        enableSorting: false,
        meta: { className: 'sticky left-0 bg-background max-w-20 w-20' },
      },
    ],
    [t]
  )
}

export default useClaimRequestManagementPrevRequestColumns
