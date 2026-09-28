import { ConfirmDialog } from '@iap/dialogs'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useClaimRequestStore } from '../model/claim-request-store'
import { claimRequestService } from '../services/claim-request-service'

type ClaimRequestGenerateAndSendBulkDialogProps = {
  claimRequestIds: string[]
  onSuccess: () => void
}

export function ClaimRequestGenerateAndSendBulkDialog({
  claimRequestIds,
  onSuccess,
}: ClaimRequestGenerateAndSendBulkDialogProps) {
  const { t } = useTranslation()
  const openDialog = useClaimRequestStore((state) => state.openDialog)
  const setOpenDialog = useClaimRequestStore((state) => state.setOpenDialog)
  const setRowSelection = useClaimRequestStore((state) => state.setRowSelection)
  const mutation = useMutation({
    mutationFn: () => claimRequestService.generateAndSendBulk(claimRequestIds),
    onSuccess: () => {
      toast.success(t('claimRequests.generateAndSendBulk.success'))
      setOpenDialog(null)
      setRowSelection({})
      onSuccess()
    },
  })

  const confirm = () => {
    if (!claimRequestIds.length) {
      toast.error(t('claimRequests.generateAndSendBulk.noSelection'))
      return
    }
    mutation.mutate()
  }

  return (
    <ConfirmDialog
      confirmLabel={
        mutation.isPending
          ? t('claimRequests.generateAndSendBulk.submitting')
          : t('claimRequests.generateAndSendBulk.confirm')
      }
      description={
        <div className='space-y-2'>
          <p>
            {t('claimRequests.generateAndSendBulk.description', {
              count: claimRequestIds.length,
            })}
          </p>
          <p className='text-sm text-muted-foreground'>
            {t('claimRequests.generateAndSendBulk.selectionInfo', {
              count: claimRequestIds.length,
            })}
          </p>
        </div>
      }
      disableConfirm={!claimRequestIds.length}
      isLoading={mutation.isPending}
      onConfirm={confirm}
      onOpenChange={(open) => !open && setOpenDialog(null)}
      open={openDialog === 'bulkGenerateAndSend'}
      title={t('claimRequests.generateAndSendBulk.title')}
    />
  )
}
