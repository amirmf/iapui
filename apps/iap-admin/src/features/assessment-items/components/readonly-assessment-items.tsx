import { AssessmentItemsCardList } from '@features/assessment-items/components/assessment-item-card-list'
import { assessmentItemService } from '@features/assessment-items/services/assessment-item-service'
import type { ClaimRequest } from '@iap/api-types'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

export function ReadonlyAssessmentItems(props: {
  claimRequestId?: string
  enabled: boolean
  claimRequest?: ClaimRequest
}) {
  const { claimRequestId, enabled, claimRequest } = props
  const { t } = useTranslation()
  const assessmentClaimRequestId = enabled ? claimRequestId : undefined
  const query = useQuery({
    queryKey: ['assessmentItems', { claimRequestId: assessmentClaimRequestId }],
    queryFn: ({ signal }) =>
      assessmentItemService.findByClaimRequest({
        path: { claimRequestId: assessmentClaimRequestId! },
        signal,
      }),
    enabled: !!assessmentClaimRequestId,
    staleTime: 30000,
    gcTime: 30000,
    refetchOnWindowFocus: false,
  })
  if (!assessmentClaimRequestId)
    return (
      <p className='text-sm text-muted-foreground'>
        {t('tickets.relatedClaimRequest.assessmentItemsUnavailable')}
      </p>
    )
  if (query.isError)
    return (
      <p className='text-sm text-destructive'>
        {t('tickets.relatedClaimRequest.assessmentItemsError')}
      </p>
    )
  return (
    <AssessmentItemsCardList
      claimRequest={claimRequest}
      claimRequestId={assessmentClaimRequestId}
      items={query.data}
      isLoading={query.isLoading}
      mode='readonly'
      showEmptyMessage
    />
  )
}
