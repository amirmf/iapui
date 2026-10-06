import { ConfirmDialog } from '@iap/dialogs'
import { useTranslate } from '@shared/i18n/i18n'

import { useAiAssessmentRule } from '../context/store/ai-assessment-rule-store'
import { useBulkDeleteAiAssessmentRulesMutation } from '../queries/use-ai-assessment-rules'

export function AiAssessmentRuleBulkDeleteDialog({ ids }: { ids: string[] }) {
  const { t } = useTranslate()
  const open = useAiAssessmentRule((state) => state.open)
  const setOpen = useAiAssessmentRule((state) => state.setOpen)
  const setRowSelection = useAiAssessmentRule((state) => state.setRowSelection)
  const bulkDelete = useBulkDeleteAiAssessmentRulesMutation()
  const close = () => setOpen(null)

  return (
    <ConfirmDialog
      confirmLabel={t('common.delete')}
      confirmVariant='destructive'
      description={t('aiAssessmentRules.bulkDelete.description', {
        count: ids.length,
      })}
      disableConfirm={!ids.length}
      isLoading={bulkDelete.isPending}
      onConfirm={() =>
        ids.length &&
        bulkDelete.mutate(ids, {
          onSuccess: () => {
            setRowSelection({})
            close()
          },
        })
      }
      onOpenChange={(nextOpen) => !bulkDelete.isPending && !nextOpen && close()}
      open={open === 'bulkDelete'}
      presentation='reference'
      title={t('aiAssessmentRules.bulkDelete.title')}
    />
  )
}
