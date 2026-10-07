import { useClaimRequestStore } from '@features/claim-requests/context/store/claim-request-store'
import { claimRequestService } from '@features/claim-requests/services/claim-request-service'
import { ConfirmDialog } from '@iap/dialogs'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type Props = { onSuccess: () => Promise<unknown> | void }

export function ClaimRequestRowActionsRemoveMyAssessmentConfirmDialog(
  props: Props
) {
  const { onSuccess } = props
  const { t } = useTranslation()
  const currentRow = useClaimRequestStore((state) => state.currentRow)
  const openDialog = useClaimRequestStore((state) => state.openDialog)
  const setCurrentRow = useClaimRequestStore((state) => state.setCurrentRow)
  const setOpenDialog = useClaimRequestStore((state) => state.setOpenDialog)
  const close = () => {
    setOpenDialog(null)
    setCurrentRow(null)
  }
  const removeAssessmentMutation = useMutation({
    mutationFn: (claimRequestId: string) =>
      claimRequestService.updateDocType({
        claimRequestId,
        newDocType: currentRow?.docType?.id ?? '',
      }),
    onSuccess: async () => {
      toast.success(t('claimRequests.messages.removeMyAssessmentSuccess'))
      await onSuccess()
      close()
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
      description={t(
        'claimRequests.confirmations.removeMyAssessment.description'
      )}
      isLoading={removeAssessmentMutation.isPending}
      onConfirm={() => {
        const id = requireClaimRequestId()
        if (!id || !currentRow?.docType?.id) {
          if (id)
            toast.error(
              t('claimRequests.messages.docTypeUpdateFailed', {
                defaultValue: 'claimRequests.messages.docTypeUpdateFailed',
              })
            )
          return
        }
        removeAssessmentMutation.mutate(id)
      }}
      onOpenChange={(open) => !open && close()}
      open={openDialog === 'removeMyAssessment'}
      title={t('claimRequests.confirmations.removeMyAssessment.title')}
    />
  )
}
