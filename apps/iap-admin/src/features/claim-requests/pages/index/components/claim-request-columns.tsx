import { useMemo } from 'react'

import { useClaimRequestIds } from '@features/claim-requests/context/store/claim-request-ids-store'
import {
  getClaimRequestDisplayStatus,
  getClaimRequestDisplayStatusColor,
  sentToBankStatus,
} from '@features/claim-requests/model/claim-request-display-status'
import {
  CLAIM_REQUEST_AI_STATUS_TRANSLATION_KEYS,
  CLAIM_REQUEST_STATUS_TRANSLATION_KEYS,
  aiStatusColors,
  claimStatusColors,
} from '@features/claim-requests/model/claim-request-status'
import { ClaimRequestRowActions } from '@features/claim-requests/pages/index/components/claim-request-row-actions'
import { ClaimRequestSpecialDiseaseBadges } from '@features/claim-requests/pages/index/components/claim-request-special-disease-badges'
import type { ClaimRequest } from '@iap/api-types'
import { Badge, cn, formatDate, formatDateTime } from '@iap/ui'
import { TwoLineCell, TwoLineHeader } from '@shared/tables'
import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

const columnHelper = createColumnHelper<ClaimRequest>()
function formatNumber(value: number | null | undefined) {
  return value === null || value === undefined
    ? undefined
    : value.toLocaleString('en-US')
}

export function useClaimRequestColumns() {
  const { t, i18n } = useTranslation()
  const language = i18n.language
  const setRemoveId = useClaimRequestIds((state) => state.setRemoveId)

  return useMemo(
    () => [
      columnHelper.accessor('extNationalCode', {
        cell: (context) => {
          const claimRequestId = context.row.original.id || ''
          const cell = (
            <TwoLineCell
              presentation='reference'
              emptyValue='-'
              primary={context.getValue()}
              secondary={context.row.original.extMainNationalCode}
            />
          )

          return (
            <Link
              className='w-32 truncate text-sm text-primary underline'
              onClick={() => setRemoveId(claimRequestId)}
              params={{ claimRequestId }}
              to='/claim-requests/$claimRequestId/claim-request-management/'
            >
              {cell}
            </Link>
          )
        },
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
            column={column}
            primary={t('claimRequests.columns.extNationalCode')}
            secondary={t('claimRequests.columns.extMainNationalCode')}
          />
        ),
        meta: { className: 'max-w-40' },
      }),
      columnHelper.accessor('extDisplayName', {
        cell: (context) => (
          <div className='flex min-w-0 flex-col gap-1'>
            <TwoLineCell
              presentation='reference'
              emptyValue='-'
              longText
              primary={context.getValue()}
              secondary={context.row.original.extCustomerName}
            />
            <ClaimRequestSpecialDiseaseBadges
              diseases={context.row.original.specialDiseases}
            />
          </div>
        ),
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
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
            presentation='reference'
            emptyValue='-'
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
            presentation='reference'
            column={column}
            primary={t('claimRequests.columns.businessKey')}
          />
        ),
        meta: { className: 'max-w-40' },
      }),
      columnHelper.accessor(
        (row) => {
          if (row.docType) return row.docType.docType

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
              presentation='reference'
              emptyValue='-'
              longText
              primary={context.getValue()}
              secondary={context.row.original.extPlanCaption}
              primaryClassName='max-w-60'
              secondaryClassName='max-w-60 text-xs'
            />
          ),
          header: ({ column }) => (
            <TwoLineHeader
              presentation='reference'
              column={column}
              primary={t('claimRequests.columns.docType')}
              secondary={t('claimRequests.columns.extPlanCaption')}
            />
          ),
          id: 'docType.id',
          meta: { className: 'max-w-40' },
        }
      ),
      columnHelper.accessor((row) => formatNumber(row.amount) ?? '-', {
        id: 'amount',
        cell: (context) => (
          <div className='flex min-w-0 flex-col gap-1 text-sm'>
            <span className='truncate font-medium'>
              {context.getValue() ?? '-'}
            </span>
            <div className='flex items-center gap-1 text-xs font-normal text-muted-foreground'>
              <span className='truncate'>
                {formatNumber(context.row.original.totalSumAmount) ?? '-'}
              </span>
              {context.row.original.baseClaimRequestId ? (
                <Badge
                  presentation='reference'
                  className='border-red-300 bg-red-100 px-1 text-[10px] leading-4 text-red-700'
                  variant='outline'
                >
                  {t('claimRequests.requestType.adjustment')}
                </Badge>
              ) : null}
            </div>
          </div>
        ),
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
            column={column}
            primary={t('claimRequests.columns.amount')}
            secondary={t('claimRequests.columns.totalSumAmount')}
          />
        ),
        meta: { className: 'max-w-30' },
      }),
      columnHelper.accessor('status', {
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        cell: (context) => {
          const { aiStatus } = context.row.original
          const status = getClaimRequestDisplayStatus(context.row.original)
          const statusColor = getClaimRequestDisplayStatusColor(status)

          return (
            <div className='flex flex-col gap-1 text-sm'>
              <Badge
                presentation='reference'
                className={cn(
                  'w-fit capitalize',
                  statusColor ? claimStatusColors[statusColor] : undefined
                )}
                variant='outline'
              >
                {status === sentToBankStatus
                  ? t('claimRequests.status.sentToBank')
                  : statusColor
                    ? t(
                        CLAIM_REQUEST_STATUS_TRANSLATION_KEYS[
                          statusColor
                        ] as never
                      )
                    : status?.replace('_', ' ')}
              </Badge>
              {aiStatus ? (
                <Badge
                  presentation='reference'
                  className={cn('w-fit capitalize', aiStatusColors[aiStatus])}
                  variant='outline'
                >
                  {t(
                    CLAIM_REQUEST_AI_STATUS_TRANSLATION_KEYS[aiStatus] as never
                  )}
                </Badge>
              ) : (
                <div className='text-sm text-muted-foreground'>-</div>
              )}
            </div>
          )
        },
        enableSorting: false,
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
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
            presentation='reference'
            emptyValue='-'
            primary={formatDate(context.getValue(), undefined, {
              language,
              normalizeTimezone: false,
              invalidDate: 'throw',
            })}
            secondary={formatDateTime(
              context.row.original.createdAt,
              undefined,
              { language, normalizeTimezone: false, invalidDate: 'throw' }
            )}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
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
            presentation='reference'
            emptyValue='-'
            longTextPrimary
            primary={context.getValue()}
            secondary={formatDateTime(
              context.row.original.assessedAt,
              undefined,
              { language, normalizeTimezone: false, invalidDate: 'throw' }
            )}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
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
            presentation='reference'
            emptyValue='-'
            primary={context.getValue()}
            secondary={context.row.original.extContractId}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
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
            presentation='reference'
            emptyValue='-'
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
            presentation='reference'
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
            presentation='reference'
            emptyValue='-'
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
            presentation='reference'
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
            presentation='reference'
            emptyValue='-'
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
            presentation='reference'
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
    [t, language, setRemoveId]
  )
}
