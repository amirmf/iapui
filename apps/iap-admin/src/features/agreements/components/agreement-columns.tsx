import { useMemo } from 'react'

import {
  agreementStatusClasses,
  agreementStatusTranslationKeys,
} from '@features/agreements/constants/agreement-status-options'
import { useAgreementStore } from '@features/agreements/context/store/agreement-store'
import type { Agreement } from '@iap/api-types'
import { Badge, cn, formatDateTime } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { TwoLineCell, TwoLineHeader } from '@shared/tables'
import { createColumnHelper } from '@tanstack/react-table'

import { AgreementRowActions } from './agreement-row-actions'

const columnHelper = createColumnHelper<Agreement>()
export function useAgreementColumns() {
  const { t } = useTranslate()
  const setCurrentRow = useAgreementStore((state) => state.setCurrentRow)
  const setOpenDialog = useAgreementStore((state) => state.setOpenDialog)
  return useMemo(
    () => [
      columnHelper.accessor('extContractId', {
        cell: (context) => (
          <button
            className='text-primary underline'
            onClick={() => {
              setCurrentRow(context.row.original)
              setOpenDialog('view')
            }}
            type='button'
          >
            <TwoLineCell
              emptyValue='-'
              primary={context.getValue()}
              primaryClassName='font-mono text-xs'
              secondary={context.row.original.extPolicyId}
              secondaryClassName='font-mono text-xs'
            />
          </button>
        ),
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
            column={column}
            primary={t('agreements.columns.extContractId' as never)}
            secondary={t('agreements.columns.extPolicyId' as never)}
          />
        ),
      }),
      columnHelper.accessor('extLocation', {
        cell: (context) => (
          <TwoLineCell
            emptyValue='-'
            longTextPrimary
            primary={context.row.original.title}
            secondary={context.getValue() || null}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
            column={column}
            primary={t('agreements.columns.title' as never)}
            secondary={t('agreements.columns.extLocation' as never)}
          />
        ),
        meta: { className: 'max-w-70' },
      }),
      columnHelper.accessor('status', {
        cell: (context) => {
          const status = context.getValue()
          return (
            <div className='space-y-1'>
              <Badge
                className={cn(
                  'capitalize',
                  agreementStatusClasses[status ?? 'ACTIVE']
                )}
                variant='outline'
              >
                {status
                  ? t(agreementStatusTranslationKeys[status] as never)
                  : null}
              </Badge>
              <div className='font-mono text-xs text-muted-foreground'>
                {context.row.original.templateCode || '-'}
              </div>
            </div>
          )
        },
        enableSorting: false,
        filterFn: (row, id, value: string[]) =>
          value.includes(row.getValue(id)),
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
            column={column}
            primary={t('agreements.columns.status' as never)}
            secondary={t('agreements.columns.templateCode' as never)}
          />
        ),
      }),
      columnHelper.accessor('extPlanId', {
        cell: (context) => (
          <TwoLineCell
            emptyValue='-'
            primary={context.getValue()}
            primaryClassName='font-mono text-xs'
            secondary={context.row.original.overrideRatio}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
            column={column}
            primary={t('agreements.columns.extPlanId' as never)}
            secondary={t('agreements.columns.overrideRatio' as never)}
          />
        ),
      }),
      columnHelper.accessor('fromDate', {
        cell: (context) => (
          <TwoLineCell
            emptyValue='-'
            primary={formatDateTime(
              context.getValue() ? new Date(context.getValue()!) : null
            )}
            secondary={formatDateTime(
              context.row.original.thruDate
                ? new Date(context.row.original.thruDate)
                : null
            )}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
            column={column}
            primary={t('agreements.columns.fromDate' as never)}
            secondary={t('agreements.columns.thruDate' as never)}
          />
        ),
      }),
      columnHelper.display({
        id: 'actions',
        cell: (context) => <AgreementRowActions row={context.row} />,
        meta: { className: 'sticky left-0 bg-background' },
      }),
      ...(
        [
          'extPolicyId',
          'overrideRatio',
          'thruDate',
          'title',
          'templateCode',
        ] as const
      ).map((key) =>
        columnHelper.accessor(key, {
          cell: () => null,
          enableSorting: false,
          header: () => null,
          meta: { className: 'hidden' },
        })
      ),
    ],
    [setCurrentRow, setOpenDialog, t]
  )
}
