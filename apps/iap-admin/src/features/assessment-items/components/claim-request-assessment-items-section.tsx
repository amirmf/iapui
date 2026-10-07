import { AssessmentItemsContent } from '@features/assessment-items/components/assessment-items-content'
import AssessmentItemConfirmDialogProvider from '@features/assessment-items/context/provider/assessment-item-confirm-dialog-context'
import AssessmentItemProvider from '@features/assessment-items/context/provider/assessment-item-context'
import AssessmentItemDialogProvider from '@features/assessment-items/context/provider/assessment-item-dialog-context'
import type { ClaimRequest } from '@iap/api-types'

export function ClaimRequestAssessmentItemsSection(props: {
  claimRequest?: ClaimRequest
  claimRequestId?: string
}) {
  const { claimRequest, claimRequestId } = props
  return (
    <AssessmentItemProvider>
      <AssessmentItemConfirmDialogProvider>
        <AssessmentItemDialogProvider>
          <AssessmentItemsContent
            claimRequest={claimRequest}
            claimRequestId={claimRequestId}
          />
        </AssessmentItemDialogProvider>
      </AssessmentItemConfirmDialogProvider>
    </AssessmentItemProvider>
  )
}
