import type { AiAssessmentRuleAutomationLevelItem } from '@iap/api-types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

import { useAiAssessmentRuleAutomationLevelsTableStore } from '../../context/store/ai-assessment-rule-automation-levels-table-store'
import { AiAssessmentRuleAutomationLevelForm } from './ai-assessment-rule-automation-level-form'

interface AiAssessmentRuleAutomationLevelFormDialogProps {
  isPending: boolean
  onSubmit: (automationLevel: AiAssessmentRuleAutomationLevelItem) => void
}

export function AiAssessmentRuleAutomationLevelFormDialog({
  isPending,
  onSubmit,
}: AiAssessmentRuleAutomationLevelFormDialogProps) {
  const { t } = useTranslate()
  const open = useAiAssessmentRuleAutomationLevelsTableStore(
    (state) => state.open
  )
  const automationLevel = useAiAssessmentRuleAutomationLevelsTableStore(
    (state) => state.currentAutomationLevel
  )
  const setOpen = useAiAssessmentRuleAutomationLevelsTableStore(
    (state) => state.setOpen
  )
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
      <DialogContent className='max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {t(
              isEdit
                ? 'aiAssessmentRules.automationLevels.edit.title'
                : 'aiAssessmentRules.automationLevels.create.title'
            )}
          </DialogTitle>
        </DialogHeader>
        <AiAssessmentRuleAutomationLevelForm
          automationLevel={automationLevel ?? undefined}
          isPending={isPending}
          onCancel={() => handleOpenChange(false)}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
