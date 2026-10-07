import { type SupportFeature } from '@iap/api-types'
import { TableActionButton, TableActions } from '@shared/tables'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { type Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { useSupportFeature } from '../../context'

export function SupportFeatureRowActions({
  row,
}: {
  row: Row<SupportFeature>
}) {
  const { t } = useTranslation()
  const setOpen = useSupportFeature((state) => state.setOpen)
  const setCurrentRow = useSupportFeature((state) => state.setCurrentRow)

  const openDialog = (dialog: 'edit' | 'delete') => {
    setCurrentRow(row.original)
    setOpen(dialog)
  }

  return (
    <TableActions>
      <TableActionButton
        icon={<IconEdit className='h-4 w-4' />}
        label={t('supportFeatures.actions.edit' as never)}
        tooltipText={t('supportFeatures.actions.edit' as never)}
        onClick={() => openDialog('edit')}
      />
      <TableActionButton
        icon={<IconTrash className='h-4 w-4 text-destructive' />}
        label={t('supportFeatures.actions.delete' as never)}
        tooltipText={t('supportFeatures.actions.delete' as never)}
        onClick={() => openDialog('delete')}
      />
    </TableActions>
  )
}
