import { useMemo } from 'react'

import {
  coverageDamageCodeApplStatusBadgeColors,
  coverageDamageCodeApplStatusTranslationKeys,
} from '@features/coverage-damage-code-appls/constants/coverage-damage-code-appl-constant'
import { CoverageDamageCodeApplRowActions } from '@features/coverage-damage-code-appls/ui/coverage-damage-code-appl-row-actions'
import type { CoverageDamageCodeApplFull } from '@iap/api-types'
import { Badge, LongText, cn } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { TwoLineHeader } from '@shared/tables'
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<CoverageDamageCodeApplFull>()

export function useCoverageDamageCodeApplColumns() {
  const { t } = useTranslate()
  return useMemo(
    () => [
      columnHelper.accessor((row) => row.coverageDetail?.code ?? null, {
        id: 'coverageDetail.code',
        cell: (context) => (
          <span className='w-32 font-mono text-xs'>
            {context.getValue() ?? '-'}
          </span>
        ),
        enableSorting: false,
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('coverageDamageCodeAppls.columns.coverageCode')}
          />
        ),
      }),
      columnHelper.accessor((row) => row.coverageDetail?.title ?? null, {
        id: 'coverageDetail.title',
        cell: (context) => (
          <LongText className='max-w-48'>{context.getValue() ?? '-'}</LongText>
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('coverageDamageCodeAppls.columns.coverageTitle')}
          />
        ),
      }),
      columnHelper.accessor((row) => row.damageCode?.code ?? null, {
        id: 'damageCode.code',
        cell: (context) => (
          <span className='w-32 font-mono text-xs'>
            {context.getValue() ?? '-'}
          </span>
        ),
        enableSorting: false,
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('coverageDamageCodeAppls.columns.damageCode')}
          />
        ),
      }),
      columnHelper.accessor((row) => row.damageCode?.title ?? null, {
        id: 'damageCode.title',
        cell: (context) => (
          <LongText className='max-w-48'>{context.getValue() ?? '-'}</LongText>
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('coverageDamageCodeAppls.columns.damageTitle')}
          />
        ),
      }),
      columnHelper.accessor('priority', {
        cell: (context) => context.getValue() ?? '-',
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('coverageDamageCodeAppls.columns.priority')}
          />
        ),
      }),
      columnHelper.accessor('status', {
        cell: (context) => {
          const status = context.getValue()
          if (!status) return '-'

          const colorClass =
            coverageDamageCodeApplStatusBadgeColors[status] ??
            coverageDamageCodeApplStatusBadgeColors.ACTIVE
          const translationKey =
            coverageDamageCodeApplStatusTranslationKeys[status] ??
            coverageDamageCodeApplStatusTranslationKeys.ACTIVE

          return (
            <Badge className={cn('capitalize', colorClass)} variant='outline'>
              {t(translationKey as never)}
            </Badge>
          )
        },
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('coverageDamageCodeAppls.columns.status')}
          />
        ),
      }),
      columnHelper.accessor('ratio', {
        cell: (context) => context.getValue() ?? '-',
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('coverageDamageCodeAppls.columns.ratio')}
          />
        ),
      }),
      columnHelper.display({
        cell: (context) => (
          <CoverageDamageCodeApplRowActions row={context.row} />
        ),
        id: 'actions',
        meta: { className: 'sticky left-0 bg-background' },
      }),
    ],
    [t]
  )
}
