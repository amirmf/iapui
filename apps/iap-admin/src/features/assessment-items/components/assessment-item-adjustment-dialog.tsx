import { useCallback } from 'react'

import AssessmentItemForm from '@features/assessment-items/components/assessment-item-form'
import { useAssessmentItem } from '@features/assessment-items/context/store/assessment-item-store'
import { type ClaimRequest } from '@iap/api-types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

interface AssessmentItemAdjustmentDialog {
  claimRequestId?: string
  claimRequest?: ClaimRequest
}

export function AssessmentItemAdjustmentDialog(
  props: AssessmentItemAdjustmentDialog
) {
  const { claimRequest, claimRequestId } = props
  const { open, setOpen, currentRow, setCurrentRow } = useAssessmentItem()
  const isOpen = open === 'adjustment'
  const { t } = useTranslate()

  const onClose = useCallback(() => {
    setOpen(null)
    setTimeout(() => setCurrentRow(null), 50)
  }, [setCurrentRow, setOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent presentation='reference' className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>{t('assessmentItems.adjustment.title')}</DialogTitle>
        </DialogHeader>

        <AssessmentItemForm
          isAdjustment
          adjustmentAssessmentId={currentRow?.id}
          onSuccess={onClose}
          handleCancel={onClose}
          claimRequestData={claimRequest}
          claimRequestId={claimRequestId}
        />
      </DialogContent>
    </Dialog>
  )
}
