import { useClaimRequestStore } from '@features/claim-requests/context/store/claim-request-store'
import { claimRequestService } from '@features/claim-requests/services/claim-request-service'
import { ConfirmDialog } from '@iap/dialogs'
import { IconSend } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type ClaimRequestGenerateAndSendBulkDialogProps = {
  claimRequestIds: string[]
  onSuccess: () => Promise<unknown> | void
}

export function ClaimRequestGenerateAndSendBulkDialog(
  props: ClaimRequestGenerateAndSendBulkDialogProps
) {
  const { claimRequestIds, onSuccess } = props
  const { t } = useTranslation()
  const openDialog = useClaimRequestStore((state) => state.openDialog)
  const setOpenDialog = useClaimRequestStore((state) => state.setOpenDialog)
  const setRowSelection = useClaimRequestStore((state) => state.setRowSelection)
  const mutation = useMutation({
    mutationFn: () => claimRequestService.generateAndSendBulk(claimRequestIds),
    onSuccess: () => {
      toast.success(t('claimRequests.generateAndSendBulk.success'))
      onSuccess()
      setOpenDialog(null)
      setRowSelection({})
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
      presentation='reference'
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
      onOpenChange={(open) => {
        if (!open && !mutation.isPending) setOpenDialog(null)
      }}
      open={openDialog === 'bulkGenerateAndSend'}
      title={
        <span className='flex items-center gap-2'>
          <IconSend size={18} />
          {t('claimRequests.generateAndSendBulk.title')}
        </span>
      }
    />
  )
}
