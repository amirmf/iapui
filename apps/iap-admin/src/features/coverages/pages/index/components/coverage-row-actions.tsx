import { useCallback } from 'react'

import { useCoverageStore } from '@features/coverages/model/coverage-store'
import type { Coverage } from '@iap/api-types'
import { useTranslate } from '@shared/i18n/i18n'
import { TableActionButton, TableActions } from '@shared/tables'
import type { Row } from '@tanstack/react-table'
import { Eye, Pencil } from 'lucide-react'

export function CoverageRowActions(props: { row: Row<Coverage> }) {
  const { row } = props
  const { t } = useTranslate()
  const setCurrentRow = useCoverageStore((state) => state.setCurrentRow)
  const setOpenDialog = useCoverageStore((state) => state.setOpenDialog)
  const open = useCallback(
    (dialog: 'edit' | 'view') => {
      setCurrentRow(row.original)
      setOpenDialog(dialog)
    },
    [row.original, setCurrentRow, setOpenDialog]
  )
  return (
    <TableActions>
      <TableActionButton
        icon={<Eye aria-hidden='true' className='size-4' />}
        label={t('coverages.dialog.viewDetails')}
        onClick={() => open('view')}
        tooltipText={t('coverages.dialog.viewDetails')}
      />
      <TableActionButton
        icon={<Pencil aria-hidden='true' className='size-4' />}
        label={t('coverages.dialog.edit')}
        onClick={() => open('edit')}
        tooltipText={t('coverages.dialog.edit')}
      />
    </TableActions>
  )
}
