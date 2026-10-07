import { UpdateDocTypeForm } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/update-doc-type-form'
import { UpdateSubmitDateForm } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/update-submit-date-form'
import { Button } from '@iap/ui'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { Separator } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'

interface ClaimRequestUpdateDocTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentDocTypeId?: string | null
  submitDate?: string | null
  amount?: number | null
  onUpdated?: () => void
}

export function ClaimRequestUpdateInfoDialog(
  props: ClaimRequestUpdateDocTypeDialogProps
) {
  const {
    open,
    onOpenChange,
    currentDocTypeId,
    submitDate,
    amount,
    onUpdated,
  } = props
  const { t } = useTranslation()

  const handleSuccess = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent presentation='reference'>
        <DialogHeader>
          <DialogTitle>
            {t('claimRequests.actions.updateDocTypeButtonTitle')}
          </DialogTitle>
        </DialogHeader>

        <UpdateDocTypeForm
          currentDocTypeId={currentDocTypeId}
          onUpdated={onUpdated}
          onSuccess={handleSuccess}
        />

        <Separator className='my-2' />

        <UpdateSubmitDateForm
          submitDate={submitDate}
          amount={amount?.toString()}
          onUpdated={onUpdated}
          onSuccess={handleSuccess}
        />

        <Separator className='my-2' />

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            {t('common.cancel', { defaultValue: 'Cancel' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
