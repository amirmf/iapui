import { ConfirmDialog } from '@iap/dialogs'
import {
  type QueryObserverResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useSupportPage } from '../../context'
import { supportPageService } from '../../services'

interface SupportPageDeleteDialogProps<TData> {
  refetch: () => Promise<QueryObserverResult<TData>>
}

export function SupportPageDeleteDialog<TData>({
  refetch,
}: SupportPageDeleteDialogProps<TData>) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const open = useSupportPage((state) => state.open)
  const setOpen = useSupportPage((state) => state.setOpen)
  const supportPage = useSupportPage((state) => state.currentRow)
  const setCurrentRow = useSupportPage((state) => state.setCurrentRow)

  const deleteMutation = useMutation({
    mutationFn: supportPageService.delete,
    onSuccess: async () => {
      await Promise.all([
        refetch(),
        queryClient.invalidateQueries({ queryKey: ['support-pages'] }),
      ])
      toast.success(t('supportPages.messages.deleted' as never))
      setOpen(null)
      setCurrentRow(null)
    },
  })

  return (
    <ConfirmDialog
      open={open === 'delete'}
      onOpenChange={(value) => {
        if (!value) {
          setOpen(null)
          setCurrentRow(null)
        }
      }}
      title={t('supportPages.delete.title' as never)}
      description={t('supportPages.delete.description' as never, {
        key: supportPage?.pageKey ?? '',
      })}
      confirmVariant='destructive'
      isLoading={deleteMutation.isPending}
      confirmLabel={t('supportPages.actions.delete' as never)}
      cancelLabel={t('common.dialog.cancel' as never)}
      onConfirm={() => {
        if (supportPage?.id) deleteMutation.mutate(supportPage.id)
      }}
      presentation='reference'
    />
  )
}
