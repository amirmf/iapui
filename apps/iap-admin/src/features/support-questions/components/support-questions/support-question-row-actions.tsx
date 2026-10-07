import { type SupportQuestion } from '@iap/api-types'
import { TableActionButton, TableActions } from '@shared/tables'
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react'
import { type Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { useSupportQuestion } from '../../context'

export function SupportQuestionRowActions({
  row,
}: {
  row: Row<SupportQuestion>
}) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useSupportQuestion()
  const supportQuestion = row.original

  const openDialog = (dialog: 'view' | 'edit' | 'delete') => {
    setCurrentRow(supportQuestion)
    setOpen(dialog)
  }

  return (
    <TableActions>
      <TableActionButton
        icon={<IconEye className='h-4 w-4' />}
        label={t('supportQuestions.actions.viewDetails')}
        onClick={() => openDialog('view')}
        tooltipText={t('supportQuestions.actions.viewDetails')}
      />
      <TableActionButton
        icon={<IconEdit className='h-4 w-4' />}
        label={t('supportQuestions.actions.edit')}
        onClick={() => openDialog('edit')}
        tooltipText={t('supportQuestions.actions.edit')}
      />
      <TableActionButton
        icon={<IconTrash className='h-4 w-4 text-destructive' />}
        label={t('supportQuestions.actions.delete')}
        onClick={() => openDialog('delete')}
        tooltipText={t('supportQuestions.actions.delete')}
      />
    </TableActions>
  )
}
