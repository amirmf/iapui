import {
  MEDICAL_CENTER_INVOICE_STATE_COLORS,
  MEDICAL_CENTER_INVOICE_STATE_TRANSLATION_KEYS,
} from '@features/medical-center/constants/medical-center-constant'
import { useMedicalCenterInvoiceDialog } from '@features/medical-center/context/store/medical-center-invoice-dialog-store'
import type { MedicalCenterInvoice } from '@iap/api-types'
import { formatDateTime } from '@iap/ui'
import { Badge } from '@iap/ui'
import { DataTableColumnHeader } from '@shared/tables'
import { TableActionButton } from '@shared/tables'
import { TableActions } from '@shared/tables'
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

export function useMedicalCenterInvoiceColumns(): ColumnDef<MedicalCenterInvoice>[] {
  const { t, i18n } = useTranslation()
  const openDialog = useMedicalCenterInvoiceDialog((state) => state.openDialog)

  return [
    {
      accessorKey: 'documentNumber',
      header: ({ column }) => (
        <DataTableColumnHeader
          presentation='reference'
          column={column}
          title={t('medicalCenter.columns.documentNumber')}
        />
      ),
      cell: ({ row }) => row.original.documentNumber || '-',
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <DataTableColumnHeader
          presentation='reference'
          column={column}
          title={t('medicalCenter.columns.date')}
        />
      ),
      cell: ({ row }) => row.original.date || '-',
    },
    {
      accessorKey: 'totalAmount',
      header: ({ column }) => (
        <DataTableColumnHeader
          presentation='reference'
          column={column}
          title={t('medicalCenter.columns.totalAmount')}
        />
      ),
      cell: ({ row }) => row.original.totalAmount?.toLocaleString() ?? '-',
    },
    {
      accessorKey: 'state',
      header: ({ column }) => (
        <DataTableColumnHeader
          presentation='reference'
          column={column}
          title={t('medicalCenter.columns.state')}
        />
      ),
      cell: ({ row }) =>
        row.original.state ? (
          <Badge
            presentation='reference'
            className={MEDICAL_CENTER_INVOICE_STATE_COLORS[row.original.state]}
            variant='outline'
          >
            {t(
              MEDICAL_CENTER_INVOICE_STATE_TRANSLATION_KEYS[row.original.state]
            )}
          </Badge>
        ) : (
          '-'
        ),
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader
          presentation='reference'
          column={column}
          title={t('medicalCenter.columns.createdAt')}
        />
      ),
      cell: ({ row }) =>
        row.original.createdAt
          ? formatDateTime(row.original.createdAt, undefined, {
              language: i18n.language,
              normalizeTimezone: false,
              invalidDate: 'throw',
            })
          : '-',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <TableActions presentation='reference'>
          <TableActionButton
            presentation='reference'
            icon={<IconEye className='size-4' />}
            label={t('medicalCenter.actions.view')}
            onClick={() => openDialog('view', row.original)}
            disabled={!row.original.id}
          />
          <TableActionButton
            presentation='reference'
            icon={<IconEdit className='size-4' />}
            label={t('medicalCenter.actions.edit')}
            onClick={() => openDialog('edit', row.original)}
            disabled={!row.original.id}
          />
          <TableActionButton
            presentation='reference'
            icon={<IconTrash className='size-4' />}
            label={t('medicalCenter.actions.delete')}
            variant='destructive'
            onClick={() => openDialog('delete', row.original)}
            disabled={!row.original.id}
          />
        </TableActions>
      ),
      enableSorting: false,
      meta: { className: 'sticky left-0 bg-background w-28' },
    },
  ]
}
