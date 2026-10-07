import { ConfirmDialog } from '@iap/dialogs'
import { IconTrash } from '@tabler/icons-react'
import { type QueryObserverResult, useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useSupportQuestion } from '../../context'
import { supportQuestionService } from '../../services'

interface SupportQuestionDeleteDialogProps<TData> {
  refetch: () => Promise<QueryObserverResult<TData>>
}

export function SupportQuestionDeleteDialog<TData>(
  props: SupportQuestionDeleteDialogProps<TData>
) {
  const { refetch } = props
  const { t } = useTranslation()
  const open = useSupportQuestion((state) => state.open)
  const setOpen = useSupportQuestion((state) => state.setOpen)
  const currentRow = useSupportQuestion((state) => state.currentRow)
  const setCurrentRow = useSupportQuestion((state) => state.setCurrentRow)
  const isOpen = open === 'delete'

  const close = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  const mutation = useMutation({
    mutationFn: supportQuestionService.delete,
    onSuccess: async () => {
      await refetch()
      toast.success(t('supportQuestions.messages.deleted' as never))
      close()
    },
  })

  return (
    <ConfirmDialog
      open={isOpen}
      onOpenChange={(value) => !value && close()}
      onConfirm={() => {
        if (currentRow?.id) {
          mutation.mutate(currentRow.id)
        }
      }}
      isLoading={mutation.isPending}
      title={
        <span className='flex items-center gap-2 text-destructive'>
          <IconTrash size={18} />
          {t('supportQuestions.delete.title' as never)}
        </span>
      }
      description={t('common.dialog.deleteDialog.confirmMessage' as never)}
      confirmLabel={t('common.delete' as never)}
      cancelLabel={t('common.dialog.cancel' as never)}
      confirmVariant='destructive'
      presentation='reference'
    />
  )
}
