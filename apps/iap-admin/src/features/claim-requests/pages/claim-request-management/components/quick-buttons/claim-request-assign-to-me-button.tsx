import { useState } from 'react'

import useClaimRequestManagementData from '@features/claim-requests/pages/claim-request-management/queries/use-claim-request-management-data'
import claimRequestService from '@features/claim-requests/pages/claim-request-management/services/claim-request-management-service'
import { ConfirmDialog } from '@iap/dialogs'
import { Button } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export function ClaimRequestAssignToMeButton() {
  const { t } = useTranslation()
  const [openAssignToMeConfirm, setOpenAssignToMeConfirm] = useState(false)
  const { data: claimRequest, refetch } = useClaimRequestManagementData()

  const assignToMeMutation = useMutation({
    mutationFn: (id: string) => {
      if (claimRequest?.status === 'DELEGATED') {
        return claimRequestService.assignToMeWithStatus(id, {
          claimRequestStatus: 'IN_ASSESSMENT',
        })
      }

      return claimRequestService.assignToMe(id)
    },
    onSuccess: async () => {
      await refetch()
      setOpenAssignToMeConfirm(false)
    },
  })

  const handleAssignToMe = () => {
    if (!claimRequest?.id) {
      toast.error(t('claimRequests.messages.claimIdMissing'))
      return
    }

    assignToMeMutation.mutate(claimRequest.id)
  }

  return (
    <>
      <Button
        type='button'
        size='xs'
        variant='default'
        onClick={() => setOpenAssignToMeConfirm(true)}
        disabled={assignToMeMutation.isPending}
      >
        {t('claimRequests.actions.assignToMe')}
      </Button>
      <ConfirmDialog
        presentation='reference'
        open={openAssignToMeConfirm}
        onOpenChange={setOpenAssignToMeConfirm}
        title={t('claimRequests.confirmations.assignToMe.title')}
        description={t('claimRequests.confirmations.assignToMe.description')}
        onConfirm={handleAssignToMe}
        isLoading={assignToMeMutation.isPending}
      />
    </>
  )
}
