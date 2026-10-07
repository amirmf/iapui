import {
  ClaimRequestAssessmentItemsSection,
  ClaimRequestAttachmentsSection,
  ClaimRequestDoctorResponses,
  ClaimRequestDuplicatedSection,
  ClaimRequestManagementError,
  ClaimRequestObjectionSection,
} from '@features/claim-requests'
import type { Attachment, ClaimRequest } from '@iap/api-types'
import { Card, CardContent } from '@iap/ui'
import type { QueryObserverResult } from '@tanstack/react-query'

interface AgentClaimRequestManagementDetailsProps {
  claimRequest: ClaimRequest
  claimRequestId: string
  attachments: Attachment[]
  onRefetch: () => Promise<QueryObserverResult<unknown>>
}

export function AgentClaimRequestManagementDetails({
  claimRequest,
  claimRequestId,
  attachments,
  onRefetch,
}: AgentClaimRequestManagementDetailsProps) {
  return (
    <div className='-mx-2 flex flex-wrap pb-4'>
      <div className='w-full px-2 md:w-1/2 lg:w-2/5'>
        <Card>
          <CardContent className='px-4'>
            <ClaimRequestAssessmentItemsSection
              claimRequest={claimRequest}
              claimRequestId={claimRequestId}
            />
            <ClaimRequestDoctorResponses
              assignmentHistory={claimRequest.assignmentHistory}
            />
            <ClaimRequestDuplicatedSection claimRequest={claimRequest} />
            <ClaimRequestManagementError claimRequest={claimRequest} />
            <ClaimRequestObjectionSection
              claimRequest={claimRequest}
              claimRequestId={claimRequestId}
              refetch={onRefetch}
            />
          </CardContent>
        </Card>
      </div>
      <div className='w-full px-2 md:w-1/2 lg:w-3/5'>
        <ClaimRequestAttachmentsSection attachments={attachments} />
      </div>
    </div>
  )
}

export default AgentClaimRequestManagementDetails
