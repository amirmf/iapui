import { ConfirmDialog } from '@iap/dialogs'
import {
  type QueryObserverResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useSupportFeature } from '../../context'
import { supportFeatureService } from '../../services'

interface SupportFeatureDeleteDialogProps<TData> {
  refetch: () => Promise<QueryObserverResult<TData>>
}

export function SupportFeatureDeleteDialog<TData>({
  refetch,
}: SupportFeatureDeleteDialogProps<TData>) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const open = useSupportFeature((state) => state.open)
  const setOpen = useSupportFeature((state) => state.setOpen)
  const supportFeature = useSupportFeature((state) => state.currentRow)
  const setCurrentRow = useSupportFeature((state) => state.setCurrentRow)

  const deleteMutation = useMutation({
    mutationFn: supportFeatureService.delete,
    onSuccess: async () => {
      await Promise.all([
        refetch(),
        queryClient.invalidateQueries({ queryKey: ['support-features'] }),
      ])
      toast.success(t('supportFeatures.messages.deleted' as never))
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
      title={t('supportFeatures.delete.title' as never)}
      description={t('supportFeatures.delete.description' as never, {
        key: supportFeature?.featureKey ?? '',
      })}
      confirmVariant='destructive'
      isLoading={deleteMutation.isPending}
      confirmLabel={t('supportFeatures.actions.delete' as never)}
      cancelLabel={t('common.dialog.cancel' as never)}
      onConfirm={() => {
        if (supportFeature?.id) deleteMutation.mutate(supportFeature.id)
      }}
      presentation='reference'
    />
  )
}
