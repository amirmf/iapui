import { useAssessmentPrompt } from '@features/assessment-prompts/context/store/assessment-prompt-store'
import type { AssessmentPrompt } from '@iap/api-types'
import { useTranslate } from '@shared/i18n/i18n'
import { TableActionButton, TableActions } from '@shared/tables'
import { IconEdit, IconEye } from '@tabler/icons-react'
import type { Row } from '@tanstack/react-table'

export function AssessmentPromptRowActions(props: {
  row: Row<AssessmentPrompt>
}) {
  const { row } = props
  const { t } = useTranslate()
  const setCurrentRow = useAssessmentPrompt((state) => state.setCurrentRow)
  const setOpen = useAssessmentPrompt((state) => state.setOpen)
  const open = (dialog: 'view' | 'edit') => {
    setCurrentRow(row.original)
    setOpen(dialog)
  }
  return (
    <TableActions presentation='reference'>
      <TableActionButton
        presentation='reference'
        className='hover:bg-gray-200'
        icon={<IconEye aria-hidden='true' className='h-4 w-4' />}
        label={t('assessmentPrompts.actions.viewDetails')}
        onClick={() => open('view')}
      />
      <TableActionButton
        presentation='reference'
        className='hover:bg-gray-200'
        icon={<IconEdit aria-hidden='true' className='h-4 w-4' />}
        label={t('assessmentPrompts.actions.edit')}
        onClick={() => open('edit')}
      />
    </TableActions>
  )
}
