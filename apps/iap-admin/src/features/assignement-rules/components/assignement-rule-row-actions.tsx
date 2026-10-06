import type { AssignementRule } from '@iap/api-types'
import { TableActionButton, TableActions } from '@shared/tables'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import type { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { useAssignementRule } from '../context/assignement-rule-context'

export function AssignementRuleRowActions({
  row,
}: {
  row: Row<AssignementRule>
}) {
  const { t } = useTranslation()
  const setCurrentRow = useAssignementRule((state) => state.setCurrentRow)
  const setOpen = useAssignementRule((state) => state.setOpen)

  return (
    <TableActions>
      <TableActionButton
        icon={<IconEdit className='h-4 w-4' />}
        label={t('assignementRules.actions.edit')}
        onClick={() => {
          setCurrentRow(row.original)
          setOpen('edit')
        }}
        tooltipText={t('assignementRules.actions.edit')}
      />
      <TableActionButton
        icon={<IconTrash className='h-4 w-4' />}
        label={t('assignementRules.actions.delete')}
        onClick={() => {
          setCurrentRow(row.original)
          setOpen('delete')
        }}
        tooltipText={t('assignementRules.actions.delete')}
        variant='destructive'
      />
    </TableActions>
  )
}
