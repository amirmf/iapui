import { useCallback } from 'react'

import { ConfirmDialog } from '@iap/dialogs'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useClaimRequestStore } from '../model/store/claim-request-store'
import { claimRequestService } from '../services/claim-request-service'

type ClaimRequestRowActionDialogsProps = {
  onSuccess: () => Promise<unknown> | void
}

export function ClaimRequestRowActionDialogs({
  onSuccess,
}: ClaimRequestRowActionDialogsProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const currentRow = useClaimRequestStore((state) => state.currentRow)
  const openDialog = useClaimRequestStore((state) => state.openDialog)
  const setCurrentRow = useClaimRequestStore((state) => state.setCurrentRow)
  const setOpenDialog = useClaimRequestStore((state) => state.setOpenDialog)
  const close = useCallback(() => {
    setOpenDialog(null)
    setCurrentRow(null)
  }, [setCurrentRow, setOpenDialog])
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
  const removeAssessmentMutation = useMutation({
    mutationFn: (claimRequestId: string) =>
      claimRequestService.updateDocType({
        claimRequestId,
        newDocType: currentRow?.docType?.id ?? '',
      }),
    onSuccess: () => {
      toast.success(t('claimRequests.messages.removeMyAssessmentSuccess'))
      onSuccess()
      close()
    },
  })
  const deleteMutation = useMutation({
    mutationFn: claimRequestService.delete,
    onSuccess: () => {
      toast.success(t('claimRequests.messages.deleted'))
      onSuccess()
      close()
    },
  })

  const requireClaimRequestId = () => {
    if (currentRow?.id) return currentRow.id
    toast.error(t('claimRequests.messages.claimIdMissing'))
    return null
  }

  return (
    <>
      <ConfirmDialog
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
      <ConfirmDialog
        description={t(
          'claimRequests.confirmations.removeMyAssessment.description'
        )}
        isLoading={removeAssessmentMutation.isPending}
        onConfirm={() => {
          const id = requireClaimRequestId()
          if (!id || !currentRow?.docType?.id) {
            if (id) toast.error(t('claimRequests.messages.docTypeUpdateFailed'))
            return
          }
          removeAssessmentMutation.mutate(id)
        }}
        onOpenChange={(open) => !open && close()}
        open={openDialog === 'removeMyAssessment'}
        title={t('claimRequests.confirmations.removeMyAssessment.title')}
      />
      <ConfirmDialog
        confirmLabel={t('common.delete')}
        description={t('common.dialog.deleteDialog.confirmMessage')}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          const id = requireClaimRequestId()
          if (id) deleteMutation.mutate(id)
        }}
        onOpenChange={(open) => !open && close()}
        open={openDialog === 'delete'}
        title={t('common.dialog.deleteDialog.permanentTitle')}
        variant='error'
      />
    </>
  )
}
