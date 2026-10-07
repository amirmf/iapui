import { useClaimRequestStore } from '@features/claim-requests/pages/index/context/store/claim-request-store'
import { claimRequestService } from '@features/claim-requests/services/claim-request-service'
import { ConfirmDialog } from '@iap/dialogs'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type Props = { onSuccess: () => Promise<unknown> | void }

export function ClaimRequestRowActionsAssignToMeConfirmDialog(props: Props) {
  const { onSuccess } = props
  const { t } = useTranslation()
  const router = useRouter()
  const currentRow = useClaimRequestStore((state) => state.currentRow)
  const openDialog = useClaimRequestStore((state) => state.openDialog)
  const setCurrentRow = useClaimRequestStore((state) => state.setCurrentRow)
  const setOpenDialog = useClaimRequestStore((state) => state.setOpenDialog)
  const close = () => {
    setOpenDialog(null)
    setCurrentRow(null)
  }
  const assignMutation = useMutation({
    mutationFn: (claimRequestId: string) =>
      currentRow?.status === 'DELEGATED'
        ? claimRequestService.assignToMeWithStatus(claimRequestId, {
            claimRequestStatus: 'IN_ASSESSMENT',
          })
        : claimRequestService.assignToMe(claimRequestId),
    onSuccess: async (claimRequest) => {
      const claimRequestId = claimRequest.id ?? currentRow?.id
      if (!claimRequestId) {
        toast.error(t('claimRequests.messages.claimIdMissing'))
        return
      }

      await onSuccess()
      close()
      await router.navigate({
        params: { claimRequestId },
        to: '/claim-requests/$claimRequestId/claim-request-management/',
      })
    },
  })
  const requireClaimRequestId = () => {
    if (currentRow?.id) return currentRow.id
    toast.error(t('claimRequests.messages.claimIdMissing'))
    return null
  }
  return (
    <ConfirmDialog
      presentation='reference'
      description={t('claimRequests.confirmations.assignToMe.description')}
      isLoading={assignMutation.isPending}
      onConfirm={() => {
        const id = requireClaimRequestId()
        if (id) assignMutation.mutate(id)
      }}
      onOpenChange={(open) => !open && close()}
      open={openDialog === 'assignToMe'}
      title={t('claimRequests.confirmations.assignToMe.title')}
    />
  )
}
