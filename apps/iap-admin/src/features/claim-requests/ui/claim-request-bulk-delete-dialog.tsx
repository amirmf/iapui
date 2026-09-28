import { ConfirmDialog } from '@iap/dialogs'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useClaimRequestStore } from '../model/store/claim-request-store'
import { claimRequestService } from '../services/claim-request-service'

type ClaimRequestBulkDeleteDialogProps = {
  claimRequestIds: string[]
  onSuccess: () => void
}

export function ClaimRequestBulkDeleteDialog({
  claimRequestIds,
  onSuccess,
}: ClaimRequestBulkDeleteDialogProps) {
  const { t } = useTranslation()
  const openDialog = useClaimRequestStore((state) => state.openDialog)
  const setOpenDialog = useClaimRequestStore((state) => state.setOpenDialog)
  const setRowSelection = useClaimRequestStore((state) => state.setRowSelection)
  const mutation = useMutation({
    mutationFn: () => claimRequestService.bulkDelete(claimRequestIds),
    onSuccess: () => {
      toast.success(t('claimRequests.bulkDelete.success'))
      setOpenDialog(null)
      setRowSelection({})
      onSuccess()
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
      onOpenChange={(open) => !open && setOpenDialog(null)}
      open={openDialog === 'bulkDelete'}
      title={t('claimRequests.bulkDelete.title')}
      variant='error'
    />
  )
}
