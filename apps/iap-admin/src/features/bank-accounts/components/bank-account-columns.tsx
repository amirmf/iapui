import { useMemo } from 'react'

import { BankAccountRowActions } from '@features/bank-accounts/components/bank-account-row-actions'
import type { BankAccount } from '@iap/api-types'
import { Badge, formatDateTime } from '@iap/ui'
import { DataTableColumnHeader } from '@shared/tables'
import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

const columnHelper = createColumnHelper<BankAccount>()

export function useBankAccountColumns() {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor('bankAccountNumber', {
        cell: (context) => (
          <span className='font-medium'>{context.getValue() || '-'}</span>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('bankAccounts.columns.bankAccountNumber')}
          />
        ),
      }),
      columnHelper.accessor('phoneNumber', {
        cell: (context) => context.getValue() || '-',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('bankAccounts.columns.phoneNumber')}
          />
        ),
      }),
      columnHelper.accessor('bankAccountType', {
        cell: (context) => (
          <Badge variant='outline'>
            {t(`bankAccounts.types.${context.getValue()}`)}
          </Badge>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('bankAccounts.columns.bankAccountType')}
          />
        ),
      }),
      columnHelper.accessor('isValid', {
        cell: (context) => {
          const value = context.getValue()
          return value ? (
            <Badge variant={value === 'Y' ? 'default' : 'destructive'}>
              {t(value === 'Y' ? 'common.yes' : 'common.no')}
            </Badge>
          ) : (
            '-'
          )
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('bankAccounts.columns.isValid')}
          />
        ),
      }),
      columnHelper.accessor('createdAt', {
        cell: (context) => formatDateTime(context.getValue()),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('bankAccounts.columns.createdAt')}
          />
        ),
      }),
      columnHelper.display({
        cell: (context) => <BankAccountRowActions row={context.row} />,
        id: 'actions',
        enableHiding: false,
        enableSorting: false,
        meta: { className: 'sticky left-0 w-12 max-w-12 bg-background' },
      }),
    ],
    [t]
  )
}
