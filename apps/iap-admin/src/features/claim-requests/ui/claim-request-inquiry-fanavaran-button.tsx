import { useState } from 'react'

import { ConfirmDialog } from '@iap/dialogs'
import { Button } from '@iap/ui'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useClaimRequestStore } from '../model/store/claim-request-store'
import { claimRequestService } from '../services/claim-request-service'

type ClaimRequestInquiryFanavaranButtonProps = {
  claimRequestIds: string[]
  onSuccess?: () => Promise<unknown> | void
}

export function ClaimRequestInquiryFanavaranButton({
  claimRequestIds,
  onSuccess,
}: ClaimRequestInquiryFanavaranButtonProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const setRowSelection = useClaimRequestStore((state) => state.setRowSelection)
  const inquiryMutation = useMutation({
    mutationFn: () => claimRequestService.inquiryFanavaranBulk(claimRequestIds),
    onSuccess: async () => {
      toast.success(t('claimRequests.messages.inquiryFanavaranSuccess'))
      setOpen(false)
      setRowSelection({})
      await onSuccess?.()
    },
    onError: () =>
      toast.error(t('claimRequests.messages.inquiryFanavaranError')),
  })

  return (
    <>
      <Button
        disabled={!claimRequestIds.length || inquiryMutation.isPending}
        onClick={() => setOpen(true)}
      >
        {t('claimRequests.actions.inquiryFanavaran')}
      </Button>
      <ConfirmDialog
        description={t(
          'claimRequests.confirmations.inquiryFanavaran.description'
        )}
        isLoading={inquiryMutation.isPending}
        onConfirm={() => inquiryMutation.mutate()}
        onOpenChange={setOpen}
        open={open}
        title={t('claimRequests.confirmations.inquiryFanavaran.title')}
      />
    </>
  )
}
