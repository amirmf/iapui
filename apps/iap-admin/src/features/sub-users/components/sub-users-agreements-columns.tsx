import type { Agreement } from '@iap/api-types'
import { formatDateTime } from '@shared/lib/format-date'
import { TwoLineCell, TwoLineHeader } from '@shared/tables'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

export const useSubUsersAgreementsColumns = (): ColumnDef<Agreement>[] => {
  const { t } = useTranslation()

  return [
    {
      accessorKey: 'extContractId',
      cell: ({ row }) => (
        <TwoLineCell
          primary={row.getValue('extContractId')}
          primaryClassName='text-xs'
          secondary={row.original.extPolicyId}
          secondaryClassName='text-xs'
        />
      ),
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('agreements.columns.extContractId')}
          secondary={t('agreements.columns.extPolicyId')}
        />
      ),
    },
    {
      accessorKey: 'extLocation',
      cell: ({ row }) => (
        <TwoLineCell
          longTextPrimary
          primary={row.original.title}
          secondary={row.getValue('extLocation') || null}
        />
      ),
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('agreements.columns.title')}
          secondary={t('agreements.columns.extLocation')}
        />
      ),
      meta: { className: 'max-w-70' },
    },
    {
      accessorKey: 'fromDate',
      cell: ({ row }) => {
        const fromDate = row.getValue('fromDate') as string | null | undefined
        const thruDate = row.original.thruDate

        return (
          <TwoLineCell
            primary={formatDateTime(fromDate)}
            secondary={formatDateTime(thruDate)}
          />
        )
      },
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('agreements.columns.fromDate')}
          secondary={t('agreements.columns.thruDate')}
        />
      ),
    },
  ]
}
