import { useEffect, useState } from 'react'

import type { ClaimRequestStatus } from '@features/claim-requests/pages/claim-request-management/model/claim-request-management-forms'
import { getClaimRequestStatusOptions } from '@features/claim-requests/model/claim-request-status'
import useClaimRequestManagementData from '@features/claim-requests/pages/claim-request-management/queries/use-claim-request-management-data'
import { useClaimRequestManagementParams as useParams } from '@features/claim-requests/pages/claim-request-management/route-adapters/use-claim-request-management-params'
import claimRequestService from '@features/claim-requests/pages/claim-request-management/services/claim-request-management-service'
import { Button } from '@iap/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { SearchableSelect } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

interface ClaimRequestStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ClaimRequestStatusDialog(props: ClaimRequestStatusDialogProps) {
  const { open, onOpenChange } = props
  const { t } = useTranslation()
  const { claimRequestId } = useParams({
    from: '/_authenticated/claim-requests/$claimRequestId/claim-request-management/',
  })
  const { refetch } = useClaimRequestManagementData()
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>()

  const updateStatusMutation = useMutation({
    mutationFn: (status: ClaimRequestStatus) =>
      claimRequestService.updateClaim(claimRequestId, {
        status,
      }),
    onSuccess: async () => {
      onOpenChange(false)
      toast.success(t('claimRequests.messages.statusChangeSuccess'))
      await refetch()
    },
  })

  useEffect(() => {
    if (!open) {
      setSelectedStatus(undefined)
    }
  }, [open])

  const isSubmitDisabled = !selectedStatus || updateStatusMutation.isPending
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent presentation='reference'>
        <DialogHeader>
          <DialogTitle>{t('claimRequests.actions.statusChange')}</DialogTitle>
          <DialogDescription>
            {t('claimRequests.actions.selectedStatusChange')}
          </DialogDescription>
        </DialogHeader>
        <SearchableSelect
          selectText={t('common.select')}
          loadingText={t('common.loading')}
          emptyText={t('common.noResults')}
          clearText={t('common.clear')}
          presentation='reference'
          value={selectedStatus}
          onChange={setSelectedStatus}
          items={getClaimRequestStatusOptions(t)}
          placeholder={t('claimRequests.actions.selectedStatusChange')}
          disabled={updateStatusMutation.isPending}
        />
        <DialogFooter className='gap-2 sm:space-x-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={updateStatusMutation.isPending}
          >
            {t('common.cancel', { defaultValue: 'Cancel' })}
          </Button>
          <Button
            type='button'
            onClick={() => {
              if (selectedStatus) {
                updateStatusMutation.mutate(
                  selectedStatus as ClaimRequestStatus
                )
              }
            }}
            disabled={isSubmitDisabled}
          >
            {updateStatusMutation.isPending
              ? t('common.loading')
              : t('claimRequests.actions.statusChange')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ClaimRequestStatusDialog
