import {
  ClaimRequestDocumentsSection,
  ClaimRequestManagementPrevRequest,
} from '@features/claim-requests'
import type { ClaimRequest, Document } from '@iap/api-types'

interface AgentClaimRequestManagementFooterProps {
  claimRequest: ClaimRequest
  claimRequestId: string
  documents: Document[]
}

export function AgentClaimRequestManagementFooter({
  claimRequest,
  claimRequestId,
  documents,
}: AgentClaimRequestManagementFooterProps) {
  return (
    <>
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
    </>
  )
}

export default AgentClaimRequestManagementFooter
