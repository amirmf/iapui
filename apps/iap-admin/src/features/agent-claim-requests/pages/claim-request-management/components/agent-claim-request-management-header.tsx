import {
  ClaimRequestAssignSection,
  ClaimRequestLastStatusSection,
} from '@features/claim-requests'
import type { ClaimRequest } from '@iap/api-types'

interface AgentClaimRequestManagementHeaderProps {
  claimRequest: ClaimRequest
}

export function AgentClaimRequestManagementHeader({
  claimRequest,
}: AgentClaimRequestManagementHeaderProps) {
  return (
    <div className='flex flex-wrap items-center gap-3'>
      <ClaimRequestLastStatusSection
        statusHistory={claimRequest.statusHistory || []}
        status={claimRequest.status}
        extPaymentDate={claimRequest.extPaymentDate}
      />
      <ClaimRequestAssignSection claimRequest={claimRequest} />
    </div>
  )
}

export default AgentClaimRequestManagementHeader
