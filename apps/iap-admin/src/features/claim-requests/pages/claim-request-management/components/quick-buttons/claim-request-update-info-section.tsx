import { useState } from 'react'

import { ClaimRequestUpdateInfoDialog } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/claim-request-update-info-dialog'
import useClaimRequestManagementData from '@features/claim-requests/pages/claim-request-management/queries/use-claim-request-management-data'
import { Button } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'

export function ClaimRequestUpdateInfoSection() {
  const { t } = useTranslation()
  const { data: claimRequest, refetch } = useClaimRequestManagementData()
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)

  return (
    <>
      <Button
        type='button'
        variant='secondary'
        size='xs'
        onClick={() => setIsUpdateDialogOpen(true)}
        disabled={!claimRequest}
      >
        {t('claimRequests.actions.updateDocTypeButtonTitle')}
      </Button>
      <ClaimRequestUpdateInfoDialog
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        currentDocTypeId={claimRequest?.docType?.id}
        submitDate={claimRequest?.submitDate}
        amount={claimRequest?.amount}
        onUpdated={() => void refetch()}
      />
    </>
  )
}
