import { memo } from 'react'

import { ClaimRequestAssignmentHistory } from '@features/claim-requests/pages/claim-request-management/components/claim-request-assignment-history'
import { ClaimRequestReplayForm } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/claim-request-replay-section/claim-request-replay-form'
import {
  type ClaimRequest,
  type ClaimRequestReplayForm as ClaimRequestReplayFormValues,
} from '@features/claim-requests/pages/claim-request-management/model/claim-request-management-forms'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'

type ClaimRequestReplayDialogProps = {
  assignmentHistory: ClaimRequest['assignmentHistory']
  isPending: boolean
  open: boolean
  onCancel: () => void
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ClaimRequestReplayFormValues) => void
}

function ClaimRequestReplayDialogComponent(
  props: ClaimRequestReplayDialogProps
) {
  const {
    assignmentHistory,
    isPending,
    open,
    onCancel,
    onOpenChange,
    onSubmit,
  } = props
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent presentation='reference' className='sm:max-w-4xl'>
        <DialogHeader>
          <DialogTitle>{t('claimRequests.replay.title')}</DialogTitle>
          <DialogDescription>
            {t('claimRequests.replay.description')}
          </DialogDescription>
        </DialogHeader>

        <ClaimRequestAssignmentHistory assignmentHistory={assignmentHistory} />
        <ClaimRequestReplayForm
          isPending={isPending}
          open={open}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}

export const ClaimRequestReplayDialog = memo(ClaimRequestReplayDialogComponent)
