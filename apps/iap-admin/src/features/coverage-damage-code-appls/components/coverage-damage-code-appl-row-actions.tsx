import { useCallback } from 'react'

import { useCoverageDamageCodeApplStore } from '@features/coverage-damage-code-appls/context/store/coverage-damage-code-appl-store'
import type { CoverageDamageCodeApplFull } from '@iap/api-types'
import { useTranslate } from '@shared/i18n/i18n'
import { TableActionButton, TableActions } from '@shared/tables'
import type { Row } from '@tanstack/react-table'
import { Eye, Pencil } from 'lucide-react'

export function CoverageDamageCodeApplRowActions(props: {
  row: Row<CoverageDamageCodeApplFull>
}) {
  const { row } = props
  const { t } = useTranslate()
  const setCurrentRow = useCoverageDamageCodeApplStore(
    (state) => state.setCurrentRow
  )
  const setOpenDialog = useCoverageDamageCodeApplStore(
    (state) => state.setOpenDialog
  )
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
        label={t('coverageDamageCodeAppls.actions.view')}
        onClick={() => open('view')}
        tooltipText={t('coverageDamageCodeAppls.actions.view')}
      />
      <TableActionButton
        icon={<Pencil aria-hidden='true' className='size-4' />}
        label={t('coverageDamageCodeAppls.actions.edit')}
        onClick={() => open('edit')}
        tooltipText={t('coverageDamageCodeAppls.actions.edit')}
      />
    </TableActions>
  )
}
