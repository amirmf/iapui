import type { AiAssessmentRule } from '@iap/api-types'
import { useTranslate } from '@shared/i18n/i18n'
import { TableActionButton, TableActions } from '@shared/tables'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import type { Row } from '@tanstack/react-table'

import { useAiAssessmentRule } from '../context/store/ai-assessment-rule-store'

interface AiAssessmentRuleRowActionsProps {
  row: Row<AiAssessmentRule>
}

export function AiAssessmentRuleRowActions({
  row,
}: AiAssessmentRuleRowActionsProps) {
  const { t } = useTranslate()
  const setCurrentRow = useAiAssessmentRule((state) => state.setCurrentRow)
  const setOpen = useAiAssessmentRule((state) => state.setOpen)

  return (
    <TableActions>
      <TableActionButton
        icon={<IconEdit className='size-4' />}
        label={t('aiAssessmentRules.actions.edit')}
        onClick={() => {
          setCurrentRow(row.original)
          setOpen('edit')
        }}
        tooltipText={t('aiAssessmentRules.actions.edit')}
      />
      <TableActionButton
        icon={<IconTrash className='size-4' />}
        label={t('aiAssessmentRules.actions.delete')}
        onClick={() => {
          setCurrentRow(row.original)
          setOpen('delete')
        }}
        tooltipText={t('aiAssessmentRules.actions.delete')}
        variant='destructive'
      />
    </TableActions>
  )
}
