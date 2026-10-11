import { AgentClaimRequestObjectionForm } from '@features/agent-claim-requests/pages/detail/components/agent-claim-request-objection-form'
import useGetAgentClaimRequestById from '@features/agent-claim-requests/pages/detail/queries/use-get-agent-claim-request-by-id'
import { ObjectionChat } from '@features/claim-requests'
import { useTranslation } from 'react-i18next'

function AgentClaimRequestDetailResult() {
  const { t } = useTranslation()
  const { data: claimData } = useGetAgentClaimRequestById()

  const completeDocCondition =
    claimData?.status === 'IN_ASSESSMENT' && !claimData?.assignedUserUsername
  const canSubmitObjection =
    Boolean(claimData?.id) &&
    (claimData?.status === 'RETURN' || completeDocCondition)

  const objections = claimData?.objections?.slice().sort((a, b) => {
    const dateA = new Date(a.createdAt || '').getTime()
    const dateB = new Date(b.createdAt || '').getTime()
    return dateA - dateB
  })

  const resultReasons = claimData?.resultReasons?.join(', ')

  return (
    <div className='space-y-3 text-sm'>
      {!!resultReasons || !!objections?.length ? (
        <>
          <div className='font-medium text-text-primary'>
            {t('agent.claimRequests.detail.rejectionReasons')}
          </div>
          {!!resultReasons && (
            <div className='rounded-md border bg-gray-50 p-2 text-sm text-text-primary'>
              {resultReasons}
            </div>
          )}
          {!!objections?.length && (
            <ObjectionChat objections={objections} presentation='reference' />
          )}
        </>
      ) : null}

      {canSubmitObjection && (
        <AgentClaimRequestObjectionForm isCompleteDoc={completeDocCondition} />
      )}
    </div>
  )
}

export default AgentClaimRequestDetailResult
