import { usePersonSpecialDiseaseStore } from '@features/person-special-diseases/context/store/person-special-disease-store'
import type { PersonSpecialDisease } from '@iap/api-types'
import { TableActionButton, TableActions } from '@shared/tables'
import type { Row } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type PersonSpecialDiseaseRowActionsProps = { row: Row<PersonSpecialDisease> }

export function PersonSpecialDiseaseRowActions(
  props: PersonSpecialDiseaseRowActionsProps
) {
  const { row } = props
  const { t } = useTranslation()
  const setCurrentRow = usePersonSpecialDiseaseStore(
    (state) => state.setCurrentRow
  )
  const setOpenDialog = usePersonSpecialDiseaseStore(
    (state) => state.setOpenDialog
  )
  const entity = row.original

  const openDialog = (dialog: 'delete' | 'edit') => {
    setCurrentRow(entity)
    setOpenDialog(dialog)
  }

  return (
    <TableActions>
      <TableActionButton
        icon={<Pencil aria-hidden='true' className='size-4' />}
        label={t('personSpecialDiseases.actions.edit')}
        onClick={() => openDialog('edit')}
      />
      <TableActionButton
        icon={<Trash2 aria-hidden='true' className='size-4' />}
        label={t('personSpecialDiseases.actions.delete')}
        onClick={() => openDialog('delete')}
        variant='destructive'
      />
    </TableActions>
  )
}
