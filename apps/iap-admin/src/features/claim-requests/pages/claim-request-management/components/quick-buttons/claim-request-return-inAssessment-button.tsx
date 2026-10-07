import { useState } from 'react'

import useClaimRequestManagementData from '@features/claim-requests/pages/claim-request-management/queries/use-claim-request-management-data'
import { useClaimRequestManagementParams as useParams } from '@features/claim-requests/pages/claim-request-management/route-adapters/use-claim-request-management-params'
import claimRequestService from '@features/claim-requests/pages/claim-request-management/services/claim-request-management-service'
import { ConfirmDialog } from '@iap/dialogs'
import { Button } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

function ClaimRequestReturnInAssessmentButton() {
  const { t } = useTranslation()
  const [openConfirm, setOpenConfirm] = useState(false)
  const { claimRequestId } = useParams({
    from: '/_authenticated/claim-requests/$claimRequestId/claim-request-management/',
  })
  const { data: claimRequest, refetch } = useClaimRequestManagementData()

  const updateStatusMutation = useMutation({
    mutationFn: () =>
      claimRequestService.updateClaim(claimRequestId, {
        status: 'IN_ASSESSMENT',
      }),
    onSuccess: async () => {
      toast.success(t('claimRequests.messages.returnInAssessmentSuccess'))
      await refetch()
      setOpenConfirm(false)
    },
  })

  return (
    <>
      <Button
        type='button'
        variant='destructive'
        size='xs'
        onClick={() => setOpenConfirm(true)}
        disabled={!claimRequest || updateStatusMutation.isPending}
      >
        {t('claimRequests.actions.returnInAssessment')}
      </Button>
      <ConfirmDialog
        presentation='reference'
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title={t('claimRequests.confirmations.returnInAssessment.title')}
        description={t(
          'claimRequests.confirmations.returnInAssessment.description'
        )}
        confirmLabel={t('claimRequests.actions.returnInAssessment')}
        confirmVariant='destructive'
        onConfirm={() => updateStatusMutation.mutate()}
        isLoading={updateStatusMutation.isPending}
      />
    </>
  )
}

export default ClaimRequestReturnInAssessmentButton
