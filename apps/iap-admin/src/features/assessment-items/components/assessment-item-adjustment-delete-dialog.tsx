import { useCallback } from 'react'

import { useAssessmentItem } from '@features/assessment-items/context/store/assessment-item-store'
import assessmentItemService from '@features/assessment-items/services/assessment-item-editing-service'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function AssessmentItemAdjustmentDeleteDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useAssessmentItem()
  const isOpen = open === 'adjustment-delete'

  const { t } = useTranslate()
  const queryClient = useQueryClient()

  const onClose = useCallback(() => {
    setOpen(null)
    setTimeout(() => setCurrentRow(null), 50)
  }, [setCurrentRow, setOpen])

  const deleteAdjustmentMutation = useMutation({
    mutationFn: async () => {
      if (!currentRow?.id) {
        throw new Error('Assessment item id not found.')
      }

      const latestAssessmentItem = await assessmentItemService.getById(
        currentRow.id
      )
      const updatePayload = { ...latestAssessmentItem }
      delete updatePayload.updatedAt

      return assessmentItemService.update(currentRow.id, {
        ...updatePayload,
        claimRequestAdjustment: null,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessmentItems'] })
      toast.success(t('assessmentItems.messages.updated'))
      onClose()
    },
  })

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader className='dir-rtl'>
          <AlertDialogTitle>
            {t('assessmentItems.adjustment.delete.title')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('assessmentItems.adjustment.delete.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            {t('common.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            className='bg-destructive text-destructive-foreground'
            onClick={() => deleteAdjustmentMutation.mutate()}
            disabled={deleteAdjustmentMutation.isPending}
          >
            {t('assessmentItems.adjustment.delete.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
