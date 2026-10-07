import { ClaimRequestAssessmentItemsSection } from '@features/claim-requests/pages/claim-request-management/components/claim-request-assessment-items-section'
import ClaimRequestAssignSection from '@features/claim-requests/pages/claim-request-management/components/claim-request-assign-section'
import { ClaimRequestAttachmentsSection } from '@features/claim-requests/pages/claim-request-management/components/claim-request-attachments-section'
import ClaimRequestDoctorResponses from '@features/claim-requests/pages/claim-request-management/components/claim-request-doctor-responses'
import { ClaimRequestDocumentsSection } from '@features/claim-requests/pages/claim-request-management/components/claim-request-documents-section'
import ClaimRequestInfoList from '@features/claim-requests/pages/claim-request-management/components/claim-request-info-list'
import ClaimRequestLastStatusSection from '@features/claim-requests/pages/claim-request-management/components/claim-request-last-status-section'
import ClaimRequestManagementActionBtn from '@features/claim-requests/pages/claim-request-management/components/claim-request-management-action-btn'
import ClaimRequestManagementError from '@features/claim-requests/pages/claim-request-management/components/claim-request-management-error'
import { ClaimRequestManagementPending } from '@features/claim-requests/pages/claim-request-management/components/claim-request-management-pending'
import ClaimRequestManagementPrevRequest from '@features/claim-requests/pages/claim-request-management/components/claim-request-management-prev-request'
import { ClaimRequestManagementQueryError } from '@features/claim-requests/pages/claim-request-management/components/claim-request-management-query-error'
import { ClaimRequestObjectionSection } from '@features/claim-requests/pages/claim-request-management/components/claim-request-objection-section'
import { ClaimRequestRegisteredByAgentSection } from '@features/claim-requests/pages/claim-request-management/components/claim-request-registered-by-agent-section'
import { ClaimRequestReviewSwitcherSection } from '@features/claim-requests/pages/claim-request-management/components/claim-request-review-switcher-section'
import ClaimRequestQuickButtons from '@features/claim-requests/pages/claim-request-management/components/quick-buttons'
import useClaimRequestManagementData from '@features/claim-requests/queries/use-claim-request-management-data'
import { Card, CardContent } from '@iap/ui'
import { Main } from '@shared/components/layout/main'
import { useParams } from '@tanstack/react-router'

export function ClaimRequestManagementPage() {
  const { claimRequestId } = useParams({
    from: '/_authenticated/claim-requests/$claimRequestId/claim-request-management/',
  })
  const {
    data: claimRequest,
    isLoading,
    isError,
    error,
    refetch,
  } = useClaimRequestManagementData()

  if (isLoading) {
    return <ClaimRequestManagementPending />
  }

  if (isError || !claimRequest) {
    return <ClaimRequestManagementQueryError error={error} />
  }

  const documents = Array.isArray(claimRequest.documents)
    ? claimRequest.documents
    : []

  const filteredAttachements = Array.isArray(claimRequest.attachments)
    ? claimRequest.attachments
    : []

  return (
    <Main className='space-y-2 bg-transparent p-0 shadow-none sm:p-0'>
      <div className='flex flex-wrap items-center gap-3'>
        <ClaimRequestLastStatusSection
          statusHistory={claimRequest.statusHistory || []}
          status={claimRequest.status}
          extPaymentDate={claimRequest.extPaymentDate}
        />
        <ClaimRequestAssignSection claimRequest={claimRequest} />
        <ClaimRequestRegisteredByAgentSection claimRequest={claimRequest} />
        <ClaimRequestQuickButtons />
      </div>
      <ClaimRequestInfoList
        refetch={refetch}
        data={claimRequest}
        viewDetailsAdjustmentLink={
          '/claim-requests/$claimRequestId/claim-request-management' as '/claim-requests/$claimRequestId/claim-request-management/'
        }
      />
      <div className='-mx-2 flex flex-wrap'>
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
              <ClaimRequestReviewSwitcherSection claimRequest={claimRequest} />
              <ClaimRequestManagementError claimRequest={claimRequest} />
              <ClaimRequestObjectionSection
                claimRequest={claimRequest}
                claimRequestId={claimRequestId}
                refetch={refetch}
              />
              <ClaimRequestManagementActionBtn />
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
