import type { AiAssessmentRuleDetail } from '@iap/api-types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

import { useAiAssessmentRuleDetailsTableStore } from '../../context/store/ai-assessment-rule-details-table-store'
import { AiAssessmentRuleDetailForm } from './ai-assessment-rule-detail-form'

interface AiAssessmentRuleDetailFormDialogProps {
  isPending: boolean
  onSubmit: (detail: AiAssessmentRuleDetail) => void
}

export function AiAssessmentRuleDetailFormDialog({
  isPending,
  onSubmit,
}: AiAssessmentRuleDetailFormDialogProps) {
  const { t } = useTranslate()
  const open = useAiAssessmentRuleDetailsTableStore((state) => state.open)
  const detail = useAiAssessmentRuleDetailsTableStore(
    (state) => state.currentDetail
  )
  const setOpen = useAiAssessmentRuleDetailsTableStore((state) => state.setOpen)
  const isEdit = open === 'edit'

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isPending) {
      if (!nextOpen) setOpen(null)
    }
  }

  return (
    <Dialog
      onOpenChange={handleOpenChange}
      open={open === 'create' || open === 'edit'}
    >
      <DialogContent className='max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {t(
              isEdit
                ? 'aiAssessmentRules.ruleDetails.edit.title'
                : 'aiAssessmentRules.ruleDetails.create.title'
            )}
          </DialogTitle>
        </DialogHeader>
        <AiAssessmentRuleDetailForm
          detail={detail ?? undefined}
          isPending={isPending}
          onCancel={() => handleOpenChange(false)}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
