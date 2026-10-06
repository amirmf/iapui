import { ConfirmDialog } from '@iap/dialogs'
import { useTranslate } from '@shared/i18n/i18n'

import { useAiAssessmentRuleDetailsTableStore } from '../../context/store/ai-assessment-rule-details-table-store'

interface AiAssessmentRuleDetailDeleteDialogProps {
  isPending: boolean
  onConfirm: () => void
}

export function AiAssessmentRuleDetailDeleteDialog({
  isPending,
  onConfirm,
}: AiAssessmentRuleDetailDeleteDialogProps) {
  const { t } = useTranslate()
  const open = useAiAssessmentRuleDetailsTableStore((state) => state.open)
  const setOpen = useAiAssessmentRuleDetailsTableStore((state) => state.setOpen)

  return (
    <ConfirmDialog
      confirmLabel={t('common.delete')}
      confirmVariant='destructive'
      description={t('aiAssessmentRules.ruleDetails.delete.description')}
      isLoading={isPending}
      onConfirm={onConfirm}
      onOpenChange={(nextOpen) => !nextOpen && setOpen(null)}
      open={open === 'delete'}
      presentation='reference'
      title={t('aiAssessmentRules.ruleDetails.delete.title')}
    />
  )
}
