import { useCallback } from 'react'

import { useAssessmentItem } from '@features/assessment-items/context/store/assessment-item-store'
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

import assessmentItemService from '../services/assessment-item-editing-service'

export function AssessmentItemDeleteDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useAssessmentItem()
  const isOpen = open === 'delete'
  const { t } = useTranslate()
  const queryClient = useQueryClient()

  const onClose = useCallback(() => {
    setOpen(null)
    setTimeout(() => setCurrentRow(null), 50)
  }, [setCurrentRow, setOpen])

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assessmentItemService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessmentItems'] })
      toast.success(t('assessmentItems.messages.deleted'))
      onClose()
    },
  })

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader className='dir-rtl'>
          <AlertDialogTitle>
            {t('assessmentItems.delete.title')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('assessmentItems.delete.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            {t('common.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            className='bg-destructive text-destructive-foreground'
            onClick={() =>
              currentRow?.id && deleteMutation.mutate(currentRow.id)
            }
          >
            {t('assessmentItems.delete.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
