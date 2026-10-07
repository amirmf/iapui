import { type SupportPage } from '@iap/api-types'
import { TableActionButton, TableActions } from '@shared/tables'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { type Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { useSupportPage } from '../../context'

export function SupportPageRowActions({ row }: { row: Row<SupportPage> }) {
  const { t } = useTranslation()
  const setOpen = useSupportPage((state) => state.setOpen)
  const setCurrentRow = useSupportPage((state) => state.setCurrentRow)

  const openDialog = (dialog: 'edit' | 'delete') => {
    setCurrentRow(row.original)
    setOpen(dialog)
  }

  return (
    <TableActions>
      <TableActionButton
        icon={<IconEdit className='h-4 w-4' />}
        label={t('supportPages.actions.edit' as never)}
        tooltipText={t('supportPages.actions.edit' as never)}
        onClick={() => openDialog('edit')}
      />
      <TableActionButton
        icon={<IconTrash className='h-4 w-4 text-destructive' />}
        label={t('supportPages.actions.delete' as never)}
        tooltipText={t('supportPages.actions.delete' as never)}
        onClick={() => openDialog('delete')}
      />
    </TableActions>
  )
}
