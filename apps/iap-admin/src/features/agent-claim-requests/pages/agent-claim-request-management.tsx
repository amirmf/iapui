import { useAgentClaimRequestManagementData } from '@features/agent-claim-requests/queries/use-agent-claim-request-management-data'
import {
  ClaimRequestAssessmentItemsSection,
  ClaimRequestAssignSection,
  ClaimRequestAttachmentsSection,
  ClaimRequestDoctorResponses,
  ClaimRequestDocumentsSection,
  ClaimRequestDuplicatedSection,
  ClaimRequestInfoList,
  ClaimRequestLastStatusSection,
  ClaimRequestManagementError,
  ClaimRequestManagementPanelPending,
  ClaimRequestManagementPrevRequest,
  ClaimRequestManagementQueryError,
  ClaimRequestObjectionSection,
} from '@features/claim-requests'
import type { Attachment, Document } from '@iap/api-types'
import { Card, CardContent } from '@iap/ui'
import { Main } from '@shared/components/layout/main'
import { useParams } from '@tanstack/react-router'

export function AgentClaimRequestManagement() {
  const { claimRequestId } = useParams({
    from: '/_agent/agent/claim-requests/$claimRequestId/claim-request-management/',
  })
  const {
    data: claimRequest,
    isLoading,
    isError,
    error,
    refetch,
  } = useAgentClaimRequestManagementData()

  if (isLoading) {
    return <ClaimRequestManagementPanelPending />
  }

  if (isError || !claimRequest) {
    return <ClaimRequestManagementQueryError error={error} />
  }

  const documents = Array.isArray(claimRequest.documents)
    ? (claimRequest.documents as Document[])
    : []

  const filteredAttachements = Array.isArray(claimRequest.attachments)
    ? (claimRequest.attachments as Attachment[])
    : []

  return (
    <Main className='space-y-4 bg-transparent p-0 shadow-none sm:p-0'>
      <div className='flex flex-wrap items-center gap-3'>
        <ClaimRequestLastStatusSection
          statusHistory={claimRequest.statusHistory || []}
          status={claimRequest.status}
          extPaymentDate={claimRequest.extPaymentDate}
        />
        <ClaimRequestAssignSection claimRequest={claimRequest} />
      </div>
      <ClaimRequestInfoList
        data={claimRequest}
        refetch={refetch}
        viewDetailsAdjustmentLink='/agent/claim-requests/$claimRequestId/claim-request-management/'
      />
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
                refetch={refetch}
              />
              {/*<ClaimRequestManagementActionBtn />*/}
            </CardContent>
          </Card>
        </div>
        <div className='w-full px-2 md:w-1/2 lg:w-3/5'>
          <ClaimRequestAttachmentsSection attachments={filteredAttachements} />
        </div>
      </div>
      {claimRequest.createdBy && (
        <ClaimRequestManagementPrevRequest
          userId={claimRequest.createdBy}
          claimRequestId={claimRequestId}
          claimRequest={claimRequest}
        />
      )}
      <ClaimRequestDocumentsSection
        claimRequestId={claimRequestId}
        documents={documents}
      />
    </Main>
  )
}

export default AgentClaimRequestManagement
