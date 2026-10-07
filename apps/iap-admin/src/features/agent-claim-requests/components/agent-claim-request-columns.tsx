import type { ClaimRequest, ClaimRequestStatus } from '@iap/api-types'
import { Badge, cn, formatDate, formatDateTime } from '@iap/ui'
import { TwoLineCell, TwoLineHeader } from '@shared/tables'
import { Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import {
  CLAIM_REQUEST_STATUS_TRANSLATION_KEYS,
  claimStatusColors,
} from '../constants/agent-claim-request-constant'
import AgentClaimRequestRowActions from './agent-claim-request-row-actions'

export const useAgentClaimRequestColumns = (): ColumnDef<ClaimRequest>[] => {
  const { t } = useTranslation()

  return [
    {
      accessorKey: 'extNationalCode',
      header: ({ column }) => (
        <TwoLineHeader
          presentation='reference'
          column={column}
          primary={t('agent.claimRequests.columns.extNationalCode')}
          secondary={t('agent.claimRequests.columns.extMainNationalCode')}
        />
      ),
      cell: ({ row }) => {
        const claimRequestId = row.original.id || ''

        return (
          <Link
            to='/agent/claim-requests/$claimRequestId/claim-request-management/'
            params={{ claimRequestId }}
            className='w-32 truncate text-sm text-primary underline'
          >
            <TwoLineCell
              presentation='reference'
              primary={row.original.extNationalCode ?? null}
              secondary={row.original.extMainNationalCode ?? null}
            />
          </Link>
        )
      },
      meta: { className: 'max-w-40' },
    },
    {
      accessorKey: 'extDisplayName',
      header: ({ column }) => (
        <TwoLineHeader
          presentation='reference'
          column={column}
          primary={t('agent.claimRequests.columns.extDisplayName')}
          secondary={t('agent.claimRequests.columns.extCustomerName')}
        />
      ),
      cell: ({ row }) => (
        <TwoLineCell
          presentation='reference'
          primary={row.original.extDisplayName ?? null}
          secondary={row.original.extCustomerName ?? null}
          longText
        />
      ),
      meta: { className: 'max-w-40' },
    },
    {
      accessorKey: 'businessKey',
      header: ({ column }) => (
        <TwoLineHeader
          presentation='reference'
          column={column}
          primary={t('agent.claimRequests.columns.businessKey')}
          secondary={t('agent.claimRequests.columns.extPolicyId')}
        />
      ),
      cell: ({ row }) => (
        <TwoLineCell
          presentation='reference'
          primary={row.original.businessKey ?? null}
          secondary={row.original.extPolicyId ?? null}
        />
      ),
      meta: { className: 'max-w-40' },
    },
    {
      id: 'docType.id',
      accessorFn: (row) => row.docType?.docType ?? '',
      header: ({ column }) => (
        <TwoLineHeader
          presentation='reference'
          column={column}
          primary={t('agent.claimRequests.columns.docType')}
          secondary={t('agent.claimRequests.columns.extPlanCaption')}
        />
      ),
      cell: ({ row }) => (
        <TwoLineCell
          presentation='reference'
          primary={(row.getValue('docType.id') as string) || null}
          secondary={row.original.extPlanCaption ?? null}
          longText
          primaryClassName='max-w-60'
          secondaryClassName='max-w-60 text-xs'
        />
      ),
      meta: { className: 'max-w-40' },
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <TwoLineHeader
          presentation='reference'
          column={column}
          primary={t('agent.claimRequests.columns.amount')}
          secondary={t('agent.claimRequests.columns.totalSumAmount')}
        />
      ),
      accessorFn: (row) => row.amount?.toLocaleString('en-US') ?? '-',
      cell: ({ row }) => (
        <TwoLineCell
          presentation='reference'
          primary={row.getValue('amount') as string}
          secondary={
            row.original.totalSumAmount?.toLocaleString('en-US') ?? null
          }
        />
      ),
      meta: { className: 'max-w-30' },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <TwoLineHeader
          presentation='reference'
          column={column}
          primary={t('agent.claimRequests.columns.status')}
          secondary={t('agent.claimRequests.columns.completionOfDocuments')}
        />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as ClaimRequestStatus
        const showCompletionDocumentsBadge = status === 'RETURN'
        const statusColorClass = claimStatusColors[status]
        const statusTranslationKey =
          CLAIM_REQUEST_STATUS_TRANSLATION_KEYS[status]

        return (
          <div className='flex flex-col gap-1 text-sm'>
            <Badge
              presentation='reference'
              variant='outline'
              className={cn('w-fit capitalize', statusColorClass)}
            >
              {statusTranslationKey
                ? t(statusTranslationKey as never)
                : status?.replace('_', ' ')}
            </Badge>
            {showCompletionDocumentsBadge ? (
              <Badge
                presentation='reference'
                variant='outline'
                className={cn('w-fit capitalize', claimStatusColors.SUBMITTED)}
              >
                {t('agent.claimRequests.actions.completionOfDocuments')}
              </Badge>
            ) : (
              <div className='text-sm text-muted-foreground'>-</div>
            )}
          </div>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      enableSorting: false,
      meta: { className: 'max-w-52' },
    },
    {
      accessorKey: 'submitDate',
      header: ({ column }) => (
        <TwoLineHeader
          presentation='reference'
          column={column}
          primary={t('agent.claimRequests.columns.submitDate')}
          secondary={t('agent.claimRequests.columns.createdAt')}
        />
      ),
      cell: ({ row }) => (
        <TwoLineCell
          presentation='reference'
          primary={formatDate(row.original.submitDate)}
          secondary={formatDateTime(row.original.createdAt)}
        />
      ),
      meta: { className: 'max-w-48' },
    },
    {
      accessorKey: 'extPolicyId',
      header: ({ column }) => (
        <TwoLineHeader
          presentation='reference'
          column={column}
          primary={t('agent.claimRequests.columns.extPolicyId')}
          secondary={t('agent.claimRequests.columns.extContractId')}
        />
      ),
      cell: ({ row }) => (
        <TwoLineCell
          presentation='reference'
          primary={row.original.extPolicyId ?? null}
          secondary={row.original.extContractId ?? null}
        />
      ),
      meta: { className: 'max-w-40' },
    },
    {
      accessorKey: 'extWorkUnitName',
      header: ({ column }) => (
        <TwoLineHeader
          presentation='reference'
          column={column}
          primary={t('agent.claimRequests.columns.extWorkUnitName')}
          secondary={t('agent.claimRequests.columns.extWorkUnitCode')}
        />
      ),
      cell: ({ row }) => (
        <TwoLineCell
          presentation='reference'
          primary={row.original.extWorkUnitName ?? null}
          longTextPrimary
          secondary={row.original.extWorkUnitCode ?? null}
        />
      ),
      meta: { className: 'max-w-48' },
    },
    {
      accessorKey: 'extWorkUnitProvinceName',
      header: ({ column }) => (
        <TwoLineHeader
          presentation='reference'
          column={column}
          primary={t('agent.claimRequests.columns.extWorkUnitProvinceName')}
          secondary={t('agent.claimRequests.columns.extWorkUnitCityName')}
        />
      ),
      cell: ({ row }) => (
        <TwoLineCell
          presentation='reference'
          primary={row.original.extWorkUnitProvinceName ?? null}
          secondary={row.original.extWorkUnitCityName ?? null}
        />
      ),
      meta: { className: 'max-w-48' },
    },
    {
      id: 'actions',
      cell: ({ row }) => <AgentClaimRequestRowActions row={row} />,
      enableSorting: false,
      meta: { className: 'sticky left-0 bg-background' },
    },
    {
      accessorKey: 'extContractId',
      header: () => null,
      cell: () => null,
      enableSorting: false,
      meta: { className: 'hidden' },
    },
    {
      accessorKey: 'extMainNationalCode',
      header: () => null,
      cell: () => null,
      enableSorting: false,
      meta: { className: 'hidden' },
    },
    {
      accessorKey: 'extCustomerName',
      header: () => null,
      cell: () => null,
      enableSorting: false,
      meta: { className: 'hidden' },
    },
    {
      accessorKey: 'extCustomerCompanyCode',
      header: () => null,
      cell: () => null,
      enableSorting: false,
      meta: { className: 'hidden' },
    },
    {
      accessorKey: 'extCustomerNationalCode',
      header: () => null,
      cell: () => null,
      enableSorting: false,
      meta: { className: 'hidden' },
    },
    {
      accessorKey: 'extCustomerCityName',
      header: () => null,
      cell: () => null,
      enableSorting: false,
      meta: { className: 'hidden' },
    },
    {
      accessorKey: 'extWorkUnitCode',
      header: () => null,
      cell: () => null,
      enableSorting: false,
      meta: { className: 'hidden' },
    },
    {
      accessorKey: 'extWorkUnitCityName',
      header: () => null,
      cell: () => null,
      enableSorting: false,
      meta: { className: 'hidden' },
    },
    {
      accessorKey: 'extPlanCaption',
      header: () => null,
      cell: () => null,
      enableSorting: false,
      meta: { className: 'hidden' },
    },
    {
      accessorKey: 'totalSumAmount',
      header: () => null,
      cell: () => null,
      enableSorting: false,
      meta: { className: 'hidden' },
    },
    {
      accessorKey: 'createdAt',
      header: () => null,
      cell: () => null,
      enableSorting: false,
      meta: { className: 'hidden' },
    },
    {
      accessorKey: 'aiStatus',
      header: () => null,
      cell: () => null,
      enableSorting: false,
      meta: { className: 'hidden' },
    },
  ]
}

export default useAgentClaimRequestColumns
