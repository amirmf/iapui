import type { AiAssessmentRuleAutomationLevelItem } from '@iap/api-types'
import { useTranslate } from '@shared/i18n/i18n'
import { TableActionButton, TableActions } from '@shared/tables'
import { IconEdit, IconTrash } from '@tabler/icons-react'

import { useAiAssessmentRuleAutomationLevelsTableStore } from '../../context/store/ai-assessment-rule-automation-levels-table-store'

interface AiAssessmentRuleAutomationLevelActionsProps {
  automationLevel: AiAssessmentRuleAutomationLevelItem
  disabled: boolean
}

export function AiAssessmentRuleAutomationLevelActions({
  automationLevel,
  disabled,
}: AiAssessmentRuleAutomationLevelActionsProps) {
  const { t } = useTranslate()
  const setOpen = useAiAssessmentRuleAutomationLevelsTableStore(
    (state) => state.setOpen
  )
  const setCurrentAutomationLevel =
    useAiAssessmentRuleAutomationLevelsTableStore(
      (state) => state.setCurrentAutomationLevel
    )

  const openDialog = (type: 'delete' | 'edit') => {
    setCurrentAutomationLevel(automationLevel)
    setOpen(type)
  }

  return (
    <TableActions>
      <TableActionButton
        disabled={disabled}
        icon={<IconEdit className='size-4' />}
        label={t('aiAssessmentRules.automationLevels.actions.edit')}
        onClick={() => openDialog('edit')}
        tooltipText={t('aiAssessmentRules.automationLevels.actions.edit')}
      />
      <TableActionButton
        disabled={disabled}
        icon={<IconTrash className='size-4' />}
        label={t('aiAssessmentRules.automationLevels.actions.delete')}
        onClick={() => openDialog('delete')}
        tooltipText={t('aiAssessmentRules.automationLevels.actions.delete')}
        variant='destructive'
      />
    </TableActions>
  )
}
