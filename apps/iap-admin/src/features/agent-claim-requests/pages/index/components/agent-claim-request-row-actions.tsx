import type { ClaimRequest } from '@iap/api-types'
import { Permission } from '@iap/ui'
import { TableActionButton, TableActions } from '@shared/tables'
import {
  IconEye,
  IconFileCheck,
  IconRefresh,
  IconTrash,
} from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import type { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import agentClaimRequestService from '../../../services/agent-claim-request-service'
import { useAgentClaimRequest } from '../context'

interface AgentClaimRequestRowActionsProps {
  row: Row<ClaimRequest>
}

export function AgentClaimRequestRowActions({
  row,
}: AgentClaimRequestRowActionsProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useAgentClaimRequest()
  const queryClient = useQueryClient()
  const claimRequest = row.original

  const showCompletionDocumentsBtn = claimRequest.status === 'RETURN'

  const showGetFanavaranDataBtn =
    !claimRequest.extDisplayName &&
    !claimRequest.extCustomerName &&
    !claimRequest.extPlanCaption

  const refreshPolicyDetailsMutation = useMutation({
    mutationFn: (id: string) =>
      agentClaimRequestService.refreshPolicyDetails(id),
    onSuccess: async (_, id) => {
      toast.success(t('agent.claimRequests.messages.policyDetailsUpdated'))
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['agentClaimRequests'] }),
        queryClient.invalidateQueries({ queryKey: ['agentClaimRequest', id] }),
      ])
    },
  })

  const handleRefreshPolicyDetails = () => {
    if (!claimRequest.id) {
      toast.error(t('agent.claimRequests.messages.claimIdMissing'))
      return
    }

    refreshPolicyDetailsMutation.mutate(claimRequest.id)
  }

  const handleDelete = () => {
    setCurrentRow(claimRequest)
    setOpen('delete')
  }

  return (
    <TableActions>
      <Link
        to='/agent/claim-requests/$claimRequestId/claim-request-management/'
        params={{ claimRequestId: claimRequest.id! }}
      >
        <TableActionButton
          presentation='reference'
          icon={<IconEye className='size-4' />}
          label={t('agent.claimRequests.actions.viewDetails')}
          tooltipText={t('agent.claimRequests.actions.viewDetails')}
        />
      </Link>
      <Permission hasPermission={showCompletionDocumentsBtn}>
        <Link
          to='/agent/claim-requests/$claimRequestId/'
          params={{ claimRequestId: claimRequest.id! }}
        >
          <TableActionButton
            presentation='reference'
            icon={<IconFileCheck className='size-4' />}
            label={t('agent.claimRequests.actions.completionOfDocuments')}
            tooltipText={t('agent.claimRequests.actions.completionOfDocuments')}
            variant='primary'
          />
        </Link>
      </Permission>
      <Permission hasPermission={showGetFanavaranDataBtn}>
        <TableActionButton
          presentation='reference'
          icon={<IconRefresh className='size-4' />}
          label={t('agent.claimRequests.actions.refreshPolicyDetails')}
          tooltipText={t('agent.claimRequests.actions.refreshPolicyDetails')}
          onClick={handleRefreshPolicyDetails}
          disabled={refreshPolicyDetailsMutation.isPending}
        />
      </Permission>
      <TableActionButton
        presentation='reference'
        icon={<IconTrash className='size-4' />}
        label={t('agent.claimRequests.actions.delete')}
        tooltipText={t('agent.claimRequests.actions.delete')}
        variant='destructive'
        onClick={handleDelete}
      />
    </TableActions>
  )
}

export default AgentClaimRequestRowActions
