import { useMemo } from 'react'

import {
  coverageStatusBadgeColors,
  coverageStatusTranslationKeys,
  coverageTypeBadgeColors,
  coverageTypeTranslationKeys,
} from '@features/coverages/constants/coverage-constant'
import { CoverageRowActions } from '@features/coverages/pages/index/components/coverage-row-actions'
import type { Coverage } from '@iap/api-types'
import { Badge, LongText, cn, formatDateTime } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { TwoLineHeader } from '@shared/tables'
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<Coverage>()

export function useCoverageColumns() {
  const { t } = useTranslate()
  return useMemo(
    () => [
      columnHelper.accessor('code', {
        cell: (context) => (
          <div className='w-32 font-mono text-xs'>{context.getValue()}</div>
        ),
        enableHiding: false,
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('coverages.columns.code')}
          />
        ),
        meta: {
          className: cn(
            'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
            'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
            'sticky left-6 md:table-cell'
          ),
        },
      }),
      columnHelper.accessor('title', {
        cell: (context) => (
          <LongText className='max-w-48 font-medium'>
            {context.getValue()}
          </LongText>
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('coverages.columns.title')}
          />
        ),
      }),
      columnHelper.accessor('extId', {
        cell: (context) => (
          <div className='w-32'>{context.getValue() ?? '-'}</div>
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('coverages.columns.extId')}
          />
        ),
      }),
      columnHelper.accessor('typeIndicator', {
        cell: (context) => (
          <div className='w-32'>{context.getValue() ?? '-'}</div>
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('coverages.columns.typeIndicator')}
          />
        ),
      }),
      columnHelper.accessor((row) => row.rootCoverage?.title ?? null, {
        id: 'rootCoverageTitle',
        cell: (context) => (
          <LongText className='max-w-48'>{context.getValue() ?? '-'}</LongText>
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('coverages.columns.rootCoverage')}
          />
        ),
      }),
      columnHelper.accessor('coverageType', {
        cell: (context) => {
          const value = context.getValue() ?? 'GROUP'
          return (
            <Badge
              className={cn('capitalize', coverageTypeBadgeColors[value])}
              variant='outline'
            >
              {t(coverageTypeTranslationKeys[value] as never)}
            </Badge>
          )
        },
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('coverages.columns.type')}
          />
        ),
        enableSorting: false,
        filterFn: (row, id, value: unknown[]) =>
          value.includes(row.getValue(id)),
      }),
      columnHelper.accessor('maximumCoverage', {
        cell: (context) => (
          <div className='w-32'>{context.getValue() ?? '-'}</div>
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('coverages.columns.maxCoverage')}
          />
        ),
      }),
      columnHelper.accessor('status', {
        cell: (context) => {
          const value = context.getValue() ?? 'ACTIVE'
          return (
            <Badge
              className={cn('capitalize', coverageStatusBadgeColors[value])}
              variant='outline'
            >
              {t(coverageStatusTranslationKeys[value] as never)}
            </Badge>
          )
        },
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('coverages.columns.status')}
          />
        ),
        enableSorting: false,
        filterFn: (row, id, value: unknown[]) =>
          value.includes(row.getValue(id)),
      }),
      columnHelper.accessor('thruDate', {
        cell: (context) => (
          <div className='w-40 text-sm'>
            {formatDateTime(context.getValue())}
          </div>
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('coverages.columns.thruDate')}
          />
        ),
      }),
      columnHelper.display({
        cell: (context) => <CoverageRowActions row={context.row} />,
        id: 'actions',
        meta: { className: 'sticky left-0 bg-background' },
      }),
    ],
    [t]
  )
}
