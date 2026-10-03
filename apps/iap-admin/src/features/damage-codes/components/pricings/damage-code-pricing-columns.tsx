import { useMemo } from 'react'

import { DamageCodePricingRowActions } from '@features/damage-codes/components/pricings/damage-code-pricing-row-actions'
import {
  damageCodePriceTypeColors,
  damageCodePriceTypeTranslationKeys,
} from '@features/damage-codes/constants/damage-code-options'
import type { DamageCodePricing, PriceType } from '@iap/api-types'
import { Badge, LongText, cn, formatDateTime } from '@iap/ui'
import { DataTableColumnHeader } from '@shared/tables'
import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

const columnHelper = createColumnHelper<DamageCodePricing>()

export function useDamageCodePricingColumns() {
  const { t } = useTranslation()
  return useMemo(
    () => [
      columnHelper.accessor((row) => row.damageCode?.code ?? '', {
        id: 'damageCode.code',
        cell: (context) => (
          <span className='w-28 font-mono text-sm font-semibold'>
            {context.getValue() || t('common.notAvailable')}
          </span>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('damageCodePricings.columns.damageCode')}
          />
        ),
        filterFn: (row, id, value) =>
          String(row.getValue(id) ?? '')
            .toLowerCase()
            .includes(String(value ?? '').toLowerCase()),
      }),
      columnHelper.accessor((row) => row.damageCode?.title ?? '', {
        id: 'damageCode.title',
        cell: (context) => (
          <LongText className='max-w-60'>
            {context.getValue() || t('common.notAvailable')}
          </LongText>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('damageCodePricings.columns.damageCodeTitle')}
          />
        ),
        filterFn: (row, id, value) =>
          String(row.getValue(id) ?? '')
            .toLowerCase()
            .includes(String(value ?? '').toLowerCase()),
      }),
      columnHelper.accessor('priceType', {
        cell: (context) => {
          const value = context.getValue() as PriceType
          return (
            <Badge
              className={cn('capitalize', damageCodePriceTypeColors[value])}
              variant='outline'
            >
              {t(damageCodePriceTypeTranslationKeys[value] as never)}
            </Badge>
          )
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('damageCodePricings.columns.priceType')}
          />
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      }),
      columnHelper.accessor('amount', {
        cell: (context) => <span>{context.getValue().toLocaleString()}</span>,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('damageCodePricings.columns.amount')}
          />
        ),
      }),
      columnHelper.accessor('thruDate', {
        cell: (context) => (
          <span className='w-32 text-sm'>
            {formatDateTime(context.getValue())}
          </span>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('damageCodePricings.columns.thruDate')}
          />
        ),
      }),
      columnHelper.display({
        id: 'actions',
        meta: { className: 'sticky left-0 bg-background' },
        cell: (context) => <DamageCodePricingRowActions row={context.row} />,
      }),
    ],
    [t]
  )
}
