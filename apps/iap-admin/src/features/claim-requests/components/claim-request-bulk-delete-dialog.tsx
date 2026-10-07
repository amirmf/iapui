import { useClaimRequestStore } from '@features/claim-requests/context/store/claim-request-store'
import { claimRequestService } from '@features/claim-requests/services/claim-request-service'
import { ConfirmDialog } from '@iap/dialogs'
import { IconTrash } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type ClaimRequestBulkDeleteDialogProps = {
  claimRequestIds: string[]
  onSuccess: () => Promise<unknown> | void
}

export function ClaimRequestBulkDeleteDialog(
  props: ClaimRequestBulkDeleteDialogProps
) {
  const { claimRequestIds, onSuccess } = props
  const { t } = useTranslation()
  const openDialog = useClaimRequestStore((state) => state.openDialog)
  const setOpenDialog = useClaimRequestStore((state) => state.setOpenDialog)
  const setRowSelection = useClaimRequestStore((state) => state.setRowSelection)
  const mutation = useMutation({
    mutationFn: () => claimRequestService.bulkDelete(claimRequestIds),
    onSuccess: () => {
      toast.success(t('claimRequests.bulkDelete.success'))
      onSuccess()
      setOpenDialog(null)
      setRowSelection({})
    },
  })

  const confirm = () => {
    if (!claimRequestIds.length) {
      toast.error(t('claimRequests.bulkDelete.noSelection'))
      return
    }
    mutation.mutate()
  }

  return (
    <ConfirmDialog
      presentation='reference'
      confirmLabel={
        mutation.isPending
          ? t('claimRequests.bulkDelete.submitting')
          : t('claimRequests.bulkDelete.confirm')
      }
      description={
        <div className='space-y-2'>
          <p>
            {t('claimRequests.bulkDelete.description', {
              count: claimRequestIds.length,
            })}
          </p>
          <p className='text-sm text-muted-foreground'>
            {t('claimRequests.bulkDelete.selectionInfo', {
              count: claimRequestIds.length,
            })}
          </p>
        </div>
      }
      disableConfirm={!claimRequestIds.length}
      isLoading={mutation.isPending}
      onConfirm={confirm}
      onOpenChange={(open) => {
        if (!open && !mutation.isPending) setOpenDialog(null)
      }}
      open={openDialog === 'bulkDelete'}
      title={
        <span className='flex items-center gap-2 text-destructive'>
          <IconTrash size={18} />
          {t('claimRequests.bulkDelete.title')}
        </span>
      }
      variant='error'
    />
  )
}
