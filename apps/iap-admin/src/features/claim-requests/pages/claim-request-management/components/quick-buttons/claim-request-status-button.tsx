import { useState } from 'react'

import ClaimRequestStatusDialog from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/claim-request-status-dialog'
import { Button } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'

function ClaimRequestStatusButton() {
  const { t } = useTranslation()
  const [isOpen, setIsIsOpen] = useState(false)

  return (
    <>
      <Button
        type='button'
        variant='destructive'
        size='xs'
        onClick={() => setIsIsOpen(true)}
      >
        {t('claimRequests.actions.statusChange')}
      </Button>
      <ClaimRequestStatusDialog open={isOpen} onOpenChange={setIsIsOpen} />
    </>
  )
}

export default ClaimRequestStatusButton
