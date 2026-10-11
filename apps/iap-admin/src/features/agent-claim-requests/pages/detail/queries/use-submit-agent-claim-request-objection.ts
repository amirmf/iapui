import type { MyClaimRequestObjectionFormValues } from '@features/agent-claim-requests/pages/detail/model/my-claim-request-objection-schema'
import useGetAgentClaimRequestById from '@features/agent-claim-requests/pages/detail/queries/use-get-agent-claim-request-by-id'
import { agentClaimRequestService } from '@features/agent-claim-requests/services/agent-claim-request-service'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useSubmitAgentClaimRequestObjection(onReset: () => void) {
  const { t } = useTranslate()
  const queryClient = useQueryClient()
  const { data: claim, refetch } = useGetAgentClaimRequestById()
  return useMutation({
    meta: { errorPresentation: 'reference' },
    mutationFn: async (values: MyClaimRequestObjectionFormValues) => {
      if (!claim?.id) {
        toast.error(t('agent.claimRequests.messages.claimIdMissing'))
        throw new Error('validation_failed')
      }
      return agentClaimRequestService.submitObjection({
        claimRequestId: claim.id,
        description: values.formDescription,
        attachments: values.attachments || [],
        claimRequestStatus: 'IN_ASSESSMENT',
      })
    },
    onSuccess: async (updatedClaim) => {
      await queryClient.invalidateQueries({ queryKey: ['agentClaimRequests'] })
      await refetch()
      if (claim?.id)
        queryClient.setQueryData(['agentClaimRequest', claim.id], updatedClaim)
      toast.success(t('agent.claimRequests.messages.formSubmitSuccess'))
      onReset()
    },
  })
}
