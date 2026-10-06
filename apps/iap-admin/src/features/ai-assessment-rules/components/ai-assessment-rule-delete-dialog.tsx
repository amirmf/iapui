import { ConfirmDialog } from '@iap/dialogs'
import { useTranslate } from '@shared/i18n/i18n'

import { useAiAssessmentRule } from '../context/store/ai-assessment-rule-store'
import { useDeleteAiAssessmentRuleMutation } from '../queries/use-ai-assessment-rules'

export function AiAssessmentRuleDeleteDialog() {
  const { t } = useTranslate()
  const open = useAiAssessmentRule((state) => state.open)
  const currentRow = useAiAssessmentRule((state) => state.currentRow)
  const setOpen = useAiAssessmentRule((state) => state.setOpen)
  const setCurrentRow = useAiAssessmentRule((state) => state.setCurrentRow)
  const setRowSelection = useAiAssessmentRule((state) => state.setRowSelection)
  const remove = useDeleteAiAssessmentRuleMutation()
  const close = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  return (
    <ConfirmDialog
      confirmLabel={t('common.delete')}
      confirmVariant='destructive'
      description={t('aiAssessmentRules.delete.description', {
        title: currentRow?.id ?? '',
      })}
      isLoading={remove.isPending}
      onConfirm={() =>
        currentRow?.id &&
        remove.mutate(currentRow.id, {
          onSuccess: () => {
            setRowSelection({})
            close()
          },
        })
      }
      onOpenChange={(nextOpen) => !remove.isPending && !nextOpen && close()}
      open={open === 'delete'}
      presentation='reference'
      title={t('aiAssessmentRules.delete.title')}
    />
  )
}
