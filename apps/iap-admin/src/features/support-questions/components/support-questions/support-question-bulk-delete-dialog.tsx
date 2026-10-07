import { ConfirmDialog } from '@iap/dialogs'
import { IconTrash } from '@tabler/icons-react'
import { type QueryObserverResult, useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useSupportQuestion } from '../../context'
import { supportQuestionService } from '../../services'

interface SupportQuestionBulkDeleteDialogProps<TData> {
  supportQuestionIds: string[]
  refetch: () => Promise<QueryObserverResult<TData>>
}

export function SupportQuestionBulkDeleteDialog<TData>(
  props: SupportQuestionBulkDeleteDialogProps<TData>
) {
  const { supportQuestionIds, refetch } = props
  const { t } = useTranslation()
  const open = useSupportQuestion((state) => state.open)
  const setOpen = useSupportQuestion((state) => state.setOpen)
  const setCurrentRow = useSupportQuestion((state) => state.setCurrentRow)
  const setRowSelection = useSupportQuestion((state) => state.setRowSelection)

  const isOpen = open === 'bulkDelete'
  const close = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  const mutation = useMutation({
    mutationFn: () => supportQuestionService.bulkDelete(supportQuestionIds),
    onSuccess: async () => {
      await refetch()
      toast.success(t('supportQuestions.messages.deleted' as never))
      setRowSelection({})
      close()
    },
  })

  const handleDelete = () => {
    if (supportQuestionIds.length === 0) {
      toast.error(t('supportQuestions.bulkDelete.noSelection' as never))
      return
    }

    mutation.mutate()
  }

  return (
    <ConfirmDialog
      open={isOpen}
      onOpenChange={(value) => !value && close()}
      onConfirm={handleDelete}
      isLoading={mutation.isPending}
      disableConfirm={supportQuestionIds.length === 0}
      confirmVariant='destructive'
      confirmLabel={t('common.delete' as never)}
      title={
        <span className='flex items-center gap-2 text-destructive'>
          <IconTrash size={18} />
          {t('supportQuestions.bulkDelete.button' as never)}
        </span>
      }
      description={t('common.dialog.deleteDialog.confirmMessage' as never)}
      cancelLabel={t('common.dialog.cancel' as never)}
      presentation='reference'
    />
  )
}
