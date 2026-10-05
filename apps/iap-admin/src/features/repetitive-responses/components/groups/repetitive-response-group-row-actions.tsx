import { useRepetitiveResponseGroup } from '@features/repetitive-responses/context/store/repetitive-response-store'
import type { RepetitiveResponseGroup } from '@iap/api-types'
import { TableActionButton, TableActions } from '@shared/tables'
import type { Row } from '@tanstack/react-table'
import { Eye, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type Props = {
  row: Row<RepetitiveResponseGroup>
}

export function RepetitiveResponseGroupRowActions({ row }: Props) {
  const { t } = useTranslation()
  const { setCurrentRow, setOpen } = useRepetitiveResponseGroup()
  const group = row.original
  const viewDetailsLabel = t('repetitiveResponseGroups.dialog.viewDetails')
  const editLabel = t('repetitiveResponseGroups.dialog.edit')

  return (
    <TableActions>
      <TableActionButton
        icon={<Eye aria-hidden='true' className='size-4' />}
        label={viewDetailsLabel}
        onClick={() => {
          setCurrentRow(group)
          setOpen('view')
        }}
        tooltipText={viewDetailsLabel}
      />
      <TableActionButton
        icon={<Pencil aria-hidden='true' className='size-4' />}
        label={editLabel}
        onClick={() => {
          setCurrentRow(group)
          setOpen('edit')
        }}
        tooltipText={editLabel}
      />
    </TableActions>
  )
}
