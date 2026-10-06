import { useMemo } from 'react'

import { AgreementCoverageApplRowActions } from '@features/agreements/components/agreement-coverage-appls/agreement-coverage-appl-row-actions'
import type { AgreementCoverageApplFull } from '@iap/api-types'
import { LongText, cn } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { DataTableColumnHeader } from '@shared/tables'
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<AgreementCoverageApplFull>()

export function useAgreementCoverageApplColumns() {
  const { t } = useTranslate()
  return useMemo(
    () => [
      columnHelper.accessor((row) => row.damageCode?.title ?? null, {
        id: 'damageCode.title',
        cell: (context) => (
          <LongText className='max-w-48'>{context.getValue() ?? '-'}</LongText>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('agreementCoverageAppls.columns.damageTitle' as never)}
          />
        ),
      }),
      columnHelper.accessor((row) => row.damageCode?.code ?? null, {
        id: 'damageCode.code',
        cell: (context) => (
          <div className='w-32 font-mono text-xs'>
            {context.getValue() ?? '-'}
          </div>
        ),
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('agreementCoverageAppls.columns.damageCode' as never)}
          />
        ),
      }),
      columnHelper.accessor((row) => row.coverageDetail?.title ?? null, {
        id: 'coverageDetail.title',
        cell: (context) => (
          <LongText className='max-w-48'>{context.getValue() ?? '-'}</LongText>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('agreementCoverageAppls.columns.coverageTitle' as never)}
          />
        ),
      }),
      columnHelper.accessor((row) => row.coverageGroup?.title ?? null, {
        id: 'coverageGroup.title',
        cell: (context) => (
          <LongText className='max-w-48'>{context.getValue() ?? '-'}</LongText>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t(
              'agreementCoverageAppls.columns.coverageGroupTitle' as never
            )}
          />
        ),
      }),
      columnHelper.accessor((row) => row.agreement?.extPolicyId ?? null, {
        id: 'agreement.extPolicyId',
        cell: (context) => (
          <div className='w-32 font-mono text-xs'>
            {context.getValue() ?? '-'}
          </div>
        ),
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('agreementCoverageAppls.columns.extPolicyId' as never)}
          />
        ),
      }),
      columnHelper.accessor((row) => row.agreement?.title ?? null, {
        id: 'agreement.title',
        cell: (context) => (
          <LongText className='max-w-48'>{context.getValue() ?? '-'}</LongText>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('agreementCoverageAppls.columns.agreementTitle' as never)}
          />
        ),
      }),
      ...(
        [
          'overrideRatio',
          'franchisePercentage',
          'coverageAmount',
          'amountPerCase',
        ] as const
      ).map((key) =>
        columnHelper.accessor(key, {
          cell: (context) => (
            <div className={cn(key === 'overrideRatio' ? 'w-24' : 'w-28')}>
              {context.getValue() ?? '-'}
            </div>
          ),
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t(`agreementCoverageAppls.columns.${key}` as never)}
            />
          ),
        })
      ),
      columnHelper.display({
        id: 'actions',
        enableSorting: false,
        cell: (context) => (
          <AgreementCoverageApplRowActions row={context.row} />
        ),
        meta: { className: 'sticky left-0 bg-background' },
      }),
    ],
    [t]
  )
}
