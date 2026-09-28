import { useMemo } from 'react'

import type { ClaimRequest } from '@iap/api-types'
import { cn, formatDate, formatDateTime } from '@iap/ui'
import { TwoLineCell, TwoLineHeader } from '@shared/tables'
import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import {
  claimRequestAiStatusColors,
  claimRequestAiStatusTranslationKeys,
  claimRequestStatusColors,
  claimRequestStatusTranslationKeys,
} from '../constants/claim-request-status'
import {
  getClaimRequestDisplayStatus,
  getClaimRequestDisplayStatusColor,
  sentToBankStatus,
} from '../model/claim-request-display-status'
import { ClaimRequestRowActions } from './claim-request-row-actions'

const columnHelper = createColumnHelper<ClaimRequest>()
function formatNumber(value: number | null | undefined) {
  return value === null || value === undefined
    ? undefined
    : value.toLocaleString('en-US')
}

export function useClaimRequestColumns() {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor('extNationalCode', {
        cell: (context) => {
          const claimRequestId = context.row.original.id
          const cell = (
            <TwoLineCell
              primary={context.getValue()}
              secondary={context.row.original.extMainNationalCode}
            />
          )

          return claimRequestId ? (
            <Link
              className='w-32 truncate text-sm text-primary underline'
              params={{ claimRequestId }}
              to='/claim-requests/$claimRequestId/claim-request-management/'
            >
              {cell}
            </Link>
          ) : (
            cell
          )
        },
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('claimRequests.columns.extNationalCode')}
            secondary={t('claimRequests.columns.extMainNationalCode')}
          />
        ),
        meta: { className: 'max-w-40' },
      }),
      columnHelper.accessor('extDisplayName', {
        cell: (context) => (
          <TwoLineCell
            longText
            primary={context.getValue()}
            secondary={context.row.original.extCustomerName}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('claimRequests.columns.extDisplayName')}
            secondary={t('claimRequests.columns.extCustomerName')}
          />
        ),
        meta: { className: 'max-w-40' },
      }),
      columnHelper.accessor('businessKey', {
        cell: (context) => (
          <TwoLineCell
            primary={context.getValue()}
            secondary={
              context.row.original.ibanStatus === 'Y'
                ? t('claimRequests.ibanStatusValues.has')
                : context.row.original.ibanStatus === 'N'
                  ? t('claimRequests.ibanStatusValues.doesNotHave')
                  : context.row.original.ibanStatus
            }
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('claimRequests.columns.businessKey')}
          />
        ),
        meta: { className: 'max-w-40' },
      }),
      columnHelper.accessor(
        (row) => {
          if (row.docType?.docType) return row.docType.docType

          return (
            row.documents
              ?.map((document) => document.documentType)
              .filter(Boolean)
              .join(', ') ?? ''
          )
        },
        {
          cell: (context) => (
            <TwoLineCell
              longText
              primary={context.getValue()}
              secondary={context.row.original.extPlanCaption}
              primaryClassName='max-w-60'
              secondaryClassName='max-w-60 text-xs'
            />
          ),
          header: ({ column }) => (
            <TwoLineHeader
              column={column}
              primary={t('claimRequests.columns.docType')}
              secondary={t('claimRequests.columns.extPlanCaption')}
            />
          ),
          id: 'docType.id',
          meta: { className: 'max-w-40' },
        }
      ),
      columnHelper.accessor('amount', {
        cell: (context) => (
          <div className='flex min-w-0 flex-col gap-1 text-sm'>
            <span className='truncate font-medium'>
              {formatNumber(context.getValue()) ?? '–'}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              <span className='truncate'>
                {formatNumber(context.row.original.totalSumAmount) ?? '–'}
              </span>
              {context.row.original.baseClaimRequestId ? (
                <span className='rounded border border-red-300 bg-red-100 px-1 text-[10px] leading-4 text-red-700'>
                  {t('claimRequests.requestType.adjustment')}
                </span>
              ) : null}
            </div>
          </div>
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('claimRequests.columns.amount')}
            secondary={t('claimRequests.columns.totalSumAmount')}
          />
        ),
        meta: { className: 'max-w-30' },
      }),
      columnHelper.accessor('status', {
        cell: (context) => {
          const { aiStatus } = context.row.original
          const status = getClaimRequestDisplayStatus(context.row.original)
          const statusColor = getClaimRequestDisplayStatusColor(status)

          return (
            <div className='flex flex-col gap-1 text-sm'>
              {status && statusColor ? (
                <span
                  className={cn(
                    'w-fit rounded-md border px-2 py-0.5 text-xs',
                    claimRequestStatusColors[statusColor]
                  )}
                >
                  {status === sentToBankStatus
                    ? t('claimRequests.status.sentToBank')
                    : t(
                        claimRequestStatusTranslationKeys[statusColor] as never
                      )}
                </span>
              ) : (
                '–'
              )}
              {aiStatus ? (
                <span
                  className={cn(
                    'w-fit rounded-md border px-2 py-0.5 text-xs',
                    claimRequestAiStatusColors[aiStatus]
                  )}
                >
                  {t(claimRequestAiStatusTranslationKeys[aiStatus] as never)}
                </span>
              ) : null}
            </div>
          )
        },
        enableSorting: false,
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('claimRequests.columns.status')}
            secondary={t('claimRequests.columns.aiStatus')}
          />
        ),
        meta: { className: 'max-w-52' },
      }),
      columnHelper.accessor('submitDate', {
        cell: (context) => (
          <TwoLineCell
            primary={formatDate(context.getValue())}
            secondary={formatDateTime(context.row.original.createdAt)}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('claimRequests.columns.submitDate')}
            secondary={t('claimRequests.columns.createdAt')}
          />
        ),
        meta: { className: 'max-w-48' },
      }),
      columnHelper.accessor('latestAssignementDisplayName', {
        cell: (context) => (
          <TwoLineCell
            longTextPrimary
            primary={context.getValue()}
            secondary={formatDateTime(context.row.original.assessedAt)}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('claimRequests.columns.latestAssignementDisplayName')}
            secondary={t('claimRequests.columns.assessedAt')}
          />
        ),
        meta: { className: 'max-w-48' },
      }),
      columnHelper.accessor('extPolicyId', {
        cell: (context) => (
          <TwoLineCell
            primary={context.getValue()}
            secondary={context.row.original.extContractId}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('claimRequests.columns.extPolicyId')}
            secondary={t('claimRequests.columns.extContractId')}
          />
        ),
        meta: { className: 'max-w-40' },
      }),
      columnHelper.accessor('corePaidAmount', {
        cell: (context) => (
          <TwoLineCell
            primary={formatNumber(context.getValue())}
            secondary={
              context.row.original.ibanStatus === 'Y'
                ? t('claimRequests.ibanStatusValues.has')
                : context.row.original.ibanStatus === 'N'
                  ? t('claimRequests.ibanStatusValues.doesNotHave')
                  : context.row.original.ibanStatus
            }
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('claimRequests.columns.corePaidAmount')}
            secondary={t('claimRequests.columns.ibanStatus')}
          />
        ),
        meta: { className: 'max-w-40' },
      }),
      columnHelper.accessor('corePaidAmountPercent', {
        cell: (context) => (
          <TwoLineCell
            primary={
              context.getValue() === null || context.getValue() === undefined
                ? undefined
                : `${context.getValue()}%`
            }
            secondary={context.row.original.extPaymentDate}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('claimRequests.columns.corePaidAmountPercent')}
            secondary={t('claimRequests.columns.extPaymentDate')}
          />
        ),
        meta: { className: 'max-w-32' },
      }),
      columnHelper.accessor('extWorkUnitName', {
        cell: (context) => (
          <TwoLineCell
            longTextPrimary
            primary={context.getValue()}
            secondary={
              context.row.original.isReturn === 'Y'
                ? t('common.yes')
                : context.row.original.isReturn === 'N'
                  ? t('common.no')
                  : undefined
            }
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('claimRequests.columns.extWorkUnitName')}
            secondary={t('claimRequests.columns.isReturn')}
          />
        ),
        meta: { className: 'max-w-48' },
      }),
      columnHelper.display({
        cell: ({ row }) => <ClaimRequestRowActions row={row} />,
        enableSorting: false,
        id: 'actions',
        meta: { className: 'sticky left-0 bg-background' },
      }),
    ],
    [t]
  )
}
