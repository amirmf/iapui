import { useMemo } from 'react'

import {
  damageCodeStatusColors,
  damageCodeStatusTranslationKeys,
} from '@features/damage-codes/constants/damage-code-options'
import { DamageCodeRowActions } from '@features/damage-codes/pages/index/components/damage-code-row-actions'
import type { DamageCode, DamageCodeStatus } from '@iap/api-types'
import { Badge, LongText, cn, formatDateTime } from '@iap/ui'
import { DataTableColumnHeader } from '@shared/tables'
import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

const columnHelper = createColumnHelper<DamageCode>()

export function useDamageCodeColumns() {
  const { t } = useTranslation()
  return useMemo(
    () => [
      columnHelper.accessor('code', {
        cell: (context) => (
          <span className='w-32 font-mono text-xs'>{context.getValue()}</span>
        ),
        enableHiding: false,
        meta: {
          className: cn(
            'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
            'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
            'sticky left-6 md:table-cell'
          ),
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('damageCodes.columns.code')}
          />
        ),
      }),
      columnHelper.accessor('title', {
        cell: (context) => (
          <LongText className='max-w-48 font-medium'>
            {context.getValue()}
          </LongText>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('damageCodes.columns.title')}
          />
        ),
      }),
      columnHelper.accessor('extId', {
        cell: (context) => (
          <span className='w-32'>{context.getValue() ?? '-'}</span>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('damageCodes.columns.extId')}
          />
        ),
      }),
      columnHelper.accessor('codeType', {
        cell: (context) => (
          <span className='w-32'>{context.getValue() ?? '-'}</span>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('damageCodes.columns.codeType')}
          />
        ),
      }),
      columnHelper.accessor('description', {
        cell: (context) => (
          <LongText className='max-w-64'>{context.getValue() ?? '-'}</LongText>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('damageCodes.columns.description')}
          />
        ),
      }),
      columnHelper.accessor('status', {
        cell: (context) => {
          const status = context.getValue()
          if (!status) return <span>{t('common.notAvailable')}</span>
          return (
            <Badge
              className={cn(
                'capitalize',
                damageCodeStatusColors[status as DamageCodeStatus]
              )}
              variant='outline'
            >
              {t(damageCodeStatusTranslationKeys[status as DamageCodeStatus])}
            </Badge>
          )
        },
        enableSorting: false,
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('damageCodes.columns.status')}
          />
        ),
      }),
      columnHelper.accessor('thruDate', {
        cell: (context) => (
          <span className='w-24 text-sm'>
            {formatDateTime(context.getValue())}
          </span>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('damageCodes.columns.thruDate')}
          />
        ),
      }),
      columnHelper.display({
        cell: (context) => <DamageCodeRowActions row={context.row} />,
        id: 'actions',
        meta: { className: 'sticky left-0 bg-background' },
      }),
    ],
    [t]
  )
}
