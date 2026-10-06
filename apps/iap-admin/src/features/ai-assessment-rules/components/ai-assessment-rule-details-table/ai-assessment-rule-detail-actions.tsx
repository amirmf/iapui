import type { AiAssessmentRuleDetail } from '@iap/api-types'
import { useTranslate } from '@shared/i18n/i18n'
import { TableActionButton, TableActions } from '@shared/tables'
import { IconEdit, IconTrash } from '@tabler/icons-react'

import { useAiAssessmentRuleDetailsTableStore } from '../../context/store/ai-assessment-rule-details-table-store'

interface AiAssessmentRuleDetailActionsProps {
  detail: AiAssessmentRuleDetail
  disabled: boolean
}

export function AiAssessmentRuleDetailActions({
  detail,
  disabled,
}: AiAssessmentRuleDetailActionsProps) {
  const { t } = useTranslate()
  const setOpen = useAiAssessmentRuleDetailsTableStore((state) => state.setOpen)
  const setCurrentDetail = useAiAssessmentRuleDetailsTableStore(
    (state) => state.setCurrentDetail
  )

  const openDialog = (type: 'delete' | 'edit') => {
    setCurrentDetail(detail)
    setOpen(type)
  }

  return (
    <TableActions>
      <TableActionButton
        disabled={disabled}
        icon={<IconEdit className='size-4' />}
        label={t('aiAssessmentRules.ruleDetails.actions.edit')}
        onClick={() => openDialog('edit')}
        tooltipText={t('aiAssessmentRules.ruleDetails.actions.edit')}
      />
      <TableActionButton
        disabled={disabled}
        icon={<IconTrash className='size-4' />}
        label={t('aiAssessmentRules.ruleDetails.actions.delete')}
        onClick={() => openDialog('delete')}
        tooltipText={t('aiAssessmentRules.ruleDetails.actions.delete')}
        variant='destructive'
      />
    </TableActions>
  )
}
