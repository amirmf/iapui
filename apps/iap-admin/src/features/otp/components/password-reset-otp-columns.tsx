import type { PasswordResetOtpList } from '@iap/api-types'
import { formatDateTime } from '@iap/ui'
import { DataTableColumnHeader } from '@shared/tables'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

export function usePasswordResetOtpColumns(): ColumnDef<PasswordResetOtpList>[] {
  const { t } = useTranslation()

  return [
    {
      accessorKey: 'username',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('otp.columns.username')}
        />
      ),
    },
    {
      accessorKey: 'phoneNumber',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('otp.columns.phoneNumber')}
        />
      ),
    },
    {
      accessorKey: 'nationalCode',
      cell: ({ row }) => row.original.nationalCode ?? '-',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('otp.columns.nationalCode')}
        />
      ),
    },
    {
      accessorKey: 'otpCreatedAt',
      cell: ({ row }) => formatDateTime(row.original.otpCreatedAt),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('otp.columns.otpCreatedAt')}
        />
      ),
    },
    {
      accessorKey: 'expiresAt',
      cell: ({ row }) => formatDateTime(row.original.expiresAt),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('otp.columns.expiresAt')}
        />
      ),
    },
    {
      accessorKey: 'otpHash',
      cell: ({ row }) => row.original.otpHash ?? '-',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('otp.columns.otpHash')}
        />
      ),
    },
  ]
}
