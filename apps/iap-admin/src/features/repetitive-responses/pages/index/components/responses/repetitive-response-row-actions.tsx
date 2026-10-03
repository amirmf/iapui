import { useRepetitiveResponse } from '@features/repetitive-responses/model/repetitive-response-store'
import type { RepetitiveResponse } from '@iap/api-types'
import { TableActionButton, TableActions } from '@shared/tables'
import type { Row } from '@tanstack/react-table'
import { Eye, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function RepetitiveResponseRowActions(props: {
  row: Row<RepetitiveResponse>
}) {
  const { row } = props
  const { t } = useTranslation()
  const { setCurrentRow, setOpen } = useRepetitiveResponse()
  const open = (dialog: 'edit' | 'view') => {
    setCurrentRow(row.original)
    setOpen(dialog)
  }
  return (
    <TableActions>
      <TableActionButton
        icon={<Eye aria-hidden='true' className='size-4' />}
        label={t('repetitiveResponses.dialog.viewDetails')}
        onClick={() => open('view')}
      />
      <TableActionButton
        icon={<Pencil aria-hidden='true' className='size-4' />}
        label={t('repetitiveResponses.dialog.edit')}
        onClick={() => open('edit')}
      />
    </TableActions>
  )
}
