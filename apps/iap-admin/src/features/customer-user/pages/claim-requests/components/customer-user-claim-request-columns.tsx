import {
  CLAIM_REQUEST_AI_STATUS_TRANSLATION_KEYS,
  CLAIM_REQUEST_STATUS_TRANSLATION_KEYS,
  aiStatusColors,
  claimStatusColors,
} from '@features/customer-user/model/customer-user-claim-constant'
import { customerUserClaimRoutes } from '@features/customer-user/pages/claim-requests/utils/customer-user-claim-routes'
import type {
  ClaimRequest,
  ClaimRequestAiStatus,
  ClaimRequestStatus,
} from '@iap/api-types'
import { Badge, cn, formatDate, formatDateTime } from '@iap/ui'
import { TwoLineCell, TwoLineHeader } from '@shared/tables'
import { Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

export function useCustomerUserClaimRequestColumns(): ColumnDef<ClaimRequest>[] {
  const { t } = useTranslation()

  return [
    {
      accessorKey: 'extNationalCode',
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('claimRequests.columns.extNationalCode')}
          secondary={t('claimRequests.columns.extMainNationalCode')}
        />
      ),
      cell: ({ row }) => {
        const id = row.original.id
        const content = (
          <TwoLineCell
            primary={row.original.extNationalCode ?? null}
            secondary={row.original.extMainNationalCode ?? null}
          />
        )

        return id ? (
          <Link
            to={customerUserClaimRoutes.management(id)}
            className='w-32 truncate text-sm text-primary underline'
          >
            {content}
          </Link>
        ) : (
          content
        )
      },
      meta: { className: 'max-w-40' },
    },
    {
      accessorKey: 'extDisplayName',
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('claimRequests.columns.extDisplayName')}
          secondary={t('claimRequests.columns.extCustomerName')}
        />
      ),
      cell: ({ row }) => (
        <TwoLineCell
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
          column={column}
          primary={t('claimRequests.columns.businessKey')}
          secondary={t('claimRequests.columns.extPolicyId')}
        />
      ),
      cell: ({ row }) => (
        <TwoLineCell
          primary={row.original.businessKey ?? null}
          secondary={row.original.extPolicyId ?? null}
        />
      ),
      meta: { className: 'max-w-40' },
    },
    {
      id: 'docType.id',
      accessorFn: (row) =>
        row.docType?.docType ??
        row.documents
          ?.flatMap((document) => document?.documentType ?? [])
          .filter(Boolean)
          .join(', ') ??
        '',
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('claimRequests.columns.docType')}
          secondary={t('claimRequests.columns.extPlanCaption')}
        />
      ),
      cell: ({ row }) => (
        <TwoLineCell
          primary={(row.getValue('docType.id') as string) || null}
          secondary={row.original.extPlanCaption ?? null}
          primaryClassName='max-w-60'
          secondaryClassName='max-w-60 text-xs'
          longText
        />
      ),
      meta: { className: 'max-w-40' },
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('claimRequests.columns.amount')}
          secondary={t('claimRequests.columns.totalSumAmount')}
        />
      ),
      cell: ({ row }) => (
        <TwoLineCell
          primary={row.original.amount?.toLocaleString('en-US') ?? null}
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
          column={column}
          primary={t('claimRequests.columns.status')}
          secondary={t('claimRequests.columns.aiStatus')}
        />
      ),
      cell: ({ row }) => {
        const status = row.original.status as ClaimRequestStatus
        const aiStatus = row.original.aiStatus as ClaimRequestAiStatus | null
        const statusKey = CLAIM_REQUEST_STATUS_TRANSLATION_KEYS[status]
        const aiStatusKey = aiStatus
          ? CLAIM_REQUEST_AI_STATUS_TRANSLATION_KEYS[aiStatus]
          : undefined

        return (
          <div className='flex flex-col gap-1 text-sm'>
            <Badge
              presentation='reference'
              variant='outline'
              className={cn('w-fit capitalize', claimStatusColors[status])}
            >
              {statusKey ? t(statusKey as never) : status?.replace(/_/g, ' ')}
            </Badge>
            {aiStatus ? (
              <Badge
                presentation='reference'
                variant='outline'
                className={cn('w-fit capitalize', aiStatusColors[aiStatus])}
              >
                {aiStatusKey
                  ? t(aiStatusKey as never)
                  : aiStatus.replace(/_/g, ' ')}
              </Badge>
            ) : (
              <span className='text-muted-foreground'>-</span>
            )}
          </div>
        )
      },
      enableSorting: false,
      meta: { className: 'max-w-52' },
    },
    {
      accessorKey: 'submitDate',
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('claimRequests.columns.submitDate')}
          secondary={t('claimRequests.columns.createdAt')}
        />
      ),
      cell: ({ row }) => (
        <TwoLineCell
          primary={formatDate(row.original.submitDate)}
          secondary={formatDateTime(row.original.createdAt)}
        />
      ),
      meta: { className: 'max-w-48' },
    },
    {
      accessorKey: 'latestAssignementDisplayName',
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('claimRequests.columns.latestAssignementDisplayName')}
          secondary={t('claimRequests.columns.assessedAt')}
        />
      ),
      cell: ({ row }) => (
        <TwoLineCell
          primary={row.original.latestAssignementDisplayName ?? null}
          secondary={formatDateTime(row.original.assessedAt)}
          longTextPrimary
        />
      ),
      meta: { className: 'max-w-48' },
    },
    {
      accessorKey: 'extPolicyId',
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('claimRequests.columns.extPolicyId')}
          secondary={t('claimRequests.columns.extContractId')}
        />
      ),
      cell: ({ row }) => (
        <TwoLineCell
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
          column={column}
          primary={t('claimRequests.columns.extWorkUnitName')}
          secondary={t('claimRequests.columns.isReturn')}
        />
      ),
      cell: ({ row }) => (
        <TwoLineCell
          primary={row.original.extWorkUnitName ?? null}
          secondary={
            row.original.isReturn === 'Y'
              ? t('common.yes')
              : row.original.isReturn === 'N'
                ? t('common.no')
                : null
          }
          longTextPrimary
        />
      ),
      meta: { className: 'max-w-48' },
    },
  ]
}

export default useCustomerUserClaimRequestColumns
