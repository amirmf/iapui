import { ClaimRequestDeleteDialog } from '@features/claim-requests/components/claim-request-delete-dialog'
import { ClaimRequestRowActionsAssignToMeConfirmDialog } from '@features/claim-requests/components/claim-request-row-actions-assign-to-me-confirm-dialog'
import { ClaimRequestRowActionsRemoveMyAssessmentConfirmDialog } from '@features/claim-requests/components/claim-request-row-actions-remove-my-assessment-confirm-dialog'

type Props = { onSuccess: () => Promise<unknown> | void }

export function ClaimRequestRowActionDialogs(props: Props) {
  return (
    <>
      <ClaimRequestRowActionsAssignToMeConfirmDialog {...props} />
      <ClaimRequestRowActionsRemoveMyAssessmentConfirmDialog {...props} />
      <ClaimRequestDeleteDialog {...props} />
    </>
  )
}
