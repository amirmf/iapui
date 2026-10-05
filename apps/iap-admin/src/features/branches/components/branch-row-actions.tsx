import { useBranchStore } from '@features/branches/context/store/branch-store'
import type { Branch } from '@iap/api-types'
import { TableActionButton, TableActions } from '@shared/tables'
import type { Row } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function BranchRowActions(props: { row: Row<Branch> }) {
  const { row } = props
  const { t } = useTranslation()
  const setCurrentRow = useBranchStore((state) => state.setCurrentRow)
  const setOpenDialog = useBranchStore((state) => state.setOpenDialog)

  return (
    <TableActions>
      <TableActionButton
        icon={<Pencil aria-hidden='true' className='size-4' />}
        label={t('branches.actions.edit')}
        onClick={() => {
          setCurrentRow(row.original)
          setOpenDialog('edit')
        }}
        tooltipText={t('branches.actions.edit')}
      />
      <TableActionButton
        icon={<Trash2 aria-hidden='true' className='size-4' />}
        label={t('branches.actions.delete')}
        onClick={() => {
          setCurrentRow(row.original)
          setOpenDialog('delete')
        }}
        tooltipText={t('branches.actions.delete')}
        variant='destructive'
      />
    </TableActions>
  )
}
