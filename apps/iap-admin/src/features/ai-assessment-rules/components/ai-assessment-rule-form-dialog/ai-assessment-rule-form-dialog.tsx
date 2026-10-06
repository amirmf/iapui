import { useState } from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

import { useAiAssessmentRule } from '../../context/store/ai-assessment-rule-store'
import { AiAssessmentRuleForm } from './ai-assessment-rule-form'

export function AiAssessmentRuleFormDialog() {
  const { t } = useTranslate()
  const open = useAiAssessmentRule((state) => state.open)
  const currentRow = useAiAssessmentRule((state) => state.currentRow)
  const setOpen = useAiAssessmentRule((state) => state.setOpen)
  const setCurrentRow = useAiAssessmentRule((state) => state.setCurrentRow)
  const [isPending, setIsPending] = useState(false)
  const isEdit = open === 'edit'
  const isOpen = open === 'create' || isEdit

  const close = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  return (
    <Dialog
      onOpenChange={(nextOpen) => !isPending && !nextOpen && close()}
      open={isOpen}
    >
      <DialogContent className='max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-4xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {t(
              isEdit
                ? 'aiAssessmentRules.edit.title'
                : 'aiAssessmentRules.create.title'
            )}
          </DialogTitle>
        </DialogHeader>
        <AiAssessmentRuleForm
          onCancel={close}
          onPendingChange={setIsPending}
          onSuccess={close}
          rule={isEdit ? (currentRow ?? undefined) : undefined}
        />
      </DialogContent>
    </Dialog>
  )
}
