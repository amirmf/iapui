import { useState } from 'react'

import { ReturnFromPaymentSendAgainDialog } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/return-from-payment-send-again-section/return-from-payment-send-again-dialog'
import useClaimRequestManagementData from '@features/claim-requests/pages/claim-request-management/queries/use-claim-request-management-data'
import { useClaimRequestManagementParams as useParams } from '@features/claim-requests/pages/claim-request-management/route-adapters/use-claim-request-management-params'
import { Button } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'

export function ReturnFromPaymentSendAgainSection() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { claimRequestId } = useParams({
    from: '/_authenticated/claim-requests/$claimRequestId/claim-request-management/',
  })
  const { data: claimRequest, refetch } = useClaimRequestManagementData()

  return (
    <>
      <Button
        type='button'
        variant='destructive'
        size='xs'
        onClick={() => setOpen(true)}
        disabled={!claimRequest}
      >
        {t('claimRequests.returnFromPaymentSendAgain.actions.button')}
      </Button>
      <ReturnFromPaymentSendAgainDialog
        open={open}
        onOpenChange={setOpen}
        claimRequestId={claimRequestId}
        onSuccess={refetch}
        claimRequest={claimRequest}
      />
    </>
  )
}
