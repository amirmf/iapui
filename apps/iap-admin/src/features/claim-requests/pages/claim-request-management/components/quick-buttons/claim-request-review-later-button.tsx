import useClaimRequestManagementData from '@features/claim-requests/pages/claim-request-management/queries/use-claim-request-management-data'
import { useClaimRequestManagementParams as useParams } from '@features/claim-requests/pages/claim-request-management/route-adapters/use-claim-request-management-params'
import claimRequestService from '@features/claim-requests/pages/claim-request-management/services/claim-request-management-service'
import { Button } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export function ClaimRequestReviewLaterButton() {
  const { t } = useTranslation()
  const { claimRequestId } = useParams({
    from: '/_authenticated/claim-requests/$claimRequestId/claim-request-management/',
  })
  const { data: claimRequest, refetch } = useClaimRequestManagementData()

  const updateStatusMutation = useMutation({
    mutationFn: () =>
      claimRequestService.updateClaim(claimRequestId, {
        status: 'DEDICATED_TO_USER',
      }),
    onSuccess: async () => {
      toast.success(t('claimRequests.messages.reviewLaterSuccess'))
      await refetch()
    },
  })

  return (
    <Button
      type='button'
      size='xs'
      onClick={() => updateStatusMutation.mutate()}
      disabled={!claimRequest || updateStatusMutation.isPending}
    >
      {t('claimRequests.actions.reviewLater')}
    </Button>
  )
}
