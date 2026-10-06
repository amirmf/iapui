import { ConfirmDialog } from '@iap/dialogs'
import { useTranslate } from '@shared/i18n/i18n'

import { useAiAssessmentRuleAutomationLevelsTableStore } from '../../context/store/ai-assessment-rule-automation-levels-table-store'

interface AiAssessmentRuleAutomationLevelDeleteDialogProps {
  isPending: boolean
  onConfirm: () => void
}

export function AiAssessmentRuleAutomationLevelDeleteDialog({
  isPending,
  onConfirm,
}: AiAssessmentRuleAutomationLevelDeleteDialogProps) {
  const { t } = useTranslate()
  const open = useAiAssessmentRuleAutomationLevelsTableStore(
    (state) => state.open
  )
  const setOpen = useAiAssessmentRuleAutomationLevelsTableStore(
    (state) => state.setOpen
  )

  return (
    <ConfirmDialog
      confirmLabel={t('common.delete')}
      confirmVariant='destructive'
      description={t('aiAssessmentRules.automationLevels.delete.description')}
      isLoading={isPending}
      onConfirm={onConfirm}
      onOpenChange={(nextOpen) => !nextOpen && setOpen(null)}
      open={open === 'delete'}
      presentation='reference'
      title={t('aiAssessmentRules.automationLevels.delete.title')}
    />
  )
}
