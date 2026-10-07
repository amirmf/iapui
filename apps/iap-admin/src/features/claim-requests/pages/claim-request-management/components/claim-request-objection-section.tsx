import { ClaimRequestObjectionForm } from '@features/claim-requests/pages/claim-request-management/components/claim-request-objection-form'
import ObjectionChat from '@features/claim-requests/pages/claim-request-management/components/objection-chat'
import { useIsAgentPanel } from '@features/claim-requests/pages/claim-request-management/route-adapters/use-is-agent-panel'
import type { ClaimRequest } from '@iap/api-types'
import { isAdminRole, isSuperAdminRole, useAuthSession } from '@iap/auth'
import { Permission } from '@iap/ui'
import type { QueryObserverResult } from '@tanstack/react-query'

interface ClaimRequestObjectionSectionProps<TData> {
  claimRequest?: ClaimRequest
  claimRequestId?: string
  refetch: () => Promise<QueryObserverResult<TData>>
}

export function ClaimRequestObjectionSection<TData>(
  props: ClaimRequestObjectionSectionProps<TData>
) {
  const { claimRequest, claimRequestId, refetch } = props
  const { user } = useAuthSession()
  const roles = user?.roles ?? []
  const isSuperAdmin = isSuperAdminRole(roles)
  const rolesActions =
    isAdminRole(roles) ||
    roles.some((role) =>
      [
        'ROLE_ASSESSMENT_USER',
        'ROLE_MAIN_ASSESSMENT_USER',
        'ROLE_HQ_USER',
        'ROLE_BRANCH_USER',
      ].includes(role)
    )
  const status =
    claimRequest?.status === 'IN_ASSESSMENT' ||
    claimRequest?.status === 'DEDICATED_TO_USER' ||
    claimRequest?.status === 'SENT_FAILED'
  const isAgentPanel = useIsAgentPanel()
  return (
    <div className='mx-auto flex max-w-150 flex-col gap-5'>
      {!!claimRequest?.resultReasons?.length && (
        <div className='mt-2 overflow-auto rounded-md border bg-gray-50 p-1 text-sm text-text-primary'>
          {claimRequest.resultReasons.join(', ')}
        </div>
      )}
      {!!claimRequest?.objections?.length && (
        <ObjectionChat objections={claimRequest.objections} />
      )}
      <Permission
        hasPermission={
          !isAgentPanel && (isSuperAdmin || (rolesActions && status))
        }
      >
        <ClaimRequestObjectionForm
          claimRequestId={claimRequestId}
          claimRequest={claimRequest}
          refetch={refetch}
        />
      </Permission>
    </div>
  )
}
