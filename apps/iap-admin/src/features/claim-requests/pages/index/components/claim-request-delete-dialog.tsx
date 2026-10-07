import { useClaimRequestStore } from '@features/claim-requests/pages/index/context/store/claim-request-store'
import { claimRequestService } from '@features/claim-requests/services/claim-request-service'
import { ConfirmDialog } from '@iap/dialogs'
import { IconTrash } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type Props = { onSuccess: () => Promise<unknown> | void }

export function ClaimRequestDeleteDialog(props: Props) {
  const { onSuccess } = props
  const { t } = useTranslation()
  const currentRow = useClaimRequestStore((state) => state.currentRow)
  const openDialog = useClaimRequestStore((state) => state.openDialog)
  const setCurrentRow = useClaimRequestStore((state) => state.setCurrentRow)
  const setOpenDialog = useClaimRequestStore((state) => state.setOpenDialog)
  const close = () => {
    setOpenDialog(null)
    setTimeout(() => setCurrentRow(null), 500)
  }
  const mutation = useMutation({
    mutationFn: (id: string) => claimRequestService.delete(id),
    onSuccess: () => {
      onSuccess()
      toast.success(t('claimRequests.messages.deleted'))
      close()
    },
  })
  if (!currentRow) return null
  return (
    <ConfirmDialog
      presentation='reference'
      confirmLabel={t('common.delete')}
      description={t('common.dialog.deleteDialog.confirmMessage')}
      isLoading={mutation.isPending}
      onConfirm={() => {
        if (currentRow.id) mutation.mutate(currentRow.id)
      }}
      onOpenChange={(open) => {
        if (!open) close()
      }}
      open={openDialog === 'delete'}
      title={
        <span className='flex items-center gap-2 text-destructive'>
          <IconTrash size={18} />
          {t('common.dialog.deleteDialog.permanentTitle')}
        </span>
      }
      variant='error'
    />
  )
}
