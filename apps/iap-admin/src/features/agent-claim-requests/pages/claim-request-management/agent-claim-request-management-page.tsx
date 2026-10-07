import {
  ClaimRequestInfoList,
  ClaimRequestManagementPanelPending,
  ClaimRequestManagementQueryError,
} from '@features/claim-requests'
import type { Attachment, Document } from '@iap/api-types'
import { Main } from '@shared/components/layout/main'
import { useParams } from '@tanstack/react-router'

import {
  AgentClaimRequestManagementDetails,
  AgentClaimRequestManagementFooter,
  AgentClaimRequestManagementHeader,
} from './components'
import { useAgentClaimRequestManagementData } from './queries/use-agent-claim-request-management-data'

export function AgentClaimRequestManagementPage() {
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

  const filteredAttachments = Array.isArray(claimRequest.attachments)
    ? (claimRequest.attachments as Attachment[])
    : []

  return (
    <Main className='space-y-4 bg-transparent p-0 shadow-none sm:p-0'>
      <AgentClaimRequestManagementHeader claimRequest={claimRequest} />
      <ClaimRequestInfoList
        data={claimRequest}
        refetch={refetch}
        viewDetailsAdjustmentLink='/agent/claim-requests/$claimRequestId/claim-request-management/'
      />
      <AgentClaimRequestManagementDetails
        claimRequest={claimRequest}
        claimRequestId={claimRequestId}
        attachments={filteredAttachments}
        onRefetch={refetch}
      />
      <AgentClaimRequestManagementFooter
        claimRequest={claimRequest}
        claimRequestId={claimRequestId}
        documents={documents}
      />
    </Main>
  )
}

export default AgentClaimRequestManagementPage
export { AgentClaimRequestManagementPage as AgentClaimRequestManagement }
