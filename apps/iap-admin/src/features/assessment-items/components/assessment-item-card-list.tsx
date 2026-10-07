import { useMemo } from 'react'

import AssessmentItemCard from '@features/assessment-items/components/assessment-item-card'
import { assessmentItemService } from '@features/assessment-items/services/assessment-item-service'
import { claimRequestService } from '@features/claim-requests'
import type {
  AssessmentItem,
  ClaimRequest,
  SubInsuredPersonResponse,
} from '@iap/api-types'
import { Card, CardContent, CardHeader, Skeleton } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useQuery } from '@tanstack/react-query'

interface AssessmentItemsCardListProps {
  items?: AssessmentItem[]
  isLoading?: boolean
  claimRequest?: ClaimRequest
  claimRequestId?: string
  showEmptyMessage?: boolean
  mode?: 'default' | 'readonly'
}

const LoadingState = () => (
  <div className='grid grid-cols-1 gap-3'>
    {Array.from({ length: 3 }).map((_, idx) => (
      <Card key={idx} className='rounded-md py-2'>
        <CardHeader className='px-2'>
          <Skeleton className='h-5 w-60' />
        </CardHeader>
        <CardContent className='space-y-2 px-2'>
          {Array.from({ length: 2 }).map((__, i) => (
            <div key={i} className='flex items-center justify-between'>
              <Skeleton className='h-4 w-36' />
              <Skeleton className='h-4 w-36' />
            </div>
          ))}
        </CardContent>
      </Card>
    ))}
  </div>
)

export function AssessmentItemsCardList(props: AssessmentItemsCardListProps) {
  const {
    items,
    isLoading,
    claimRequest,
    claimRequestId,
    showEmptyMessage,
    mode = 'readonly',
  } = props
  const { t } = useTranslate()
  const { data: afterCalculationResults } = useQuery({
    queryKey: ['assessmentItemAfterCalculationResult', claimRequestId],
    queryFn: () =>
      assessmentItemService.getAfterCalculationResult({
        claimRequestId: claimRequestId || '',
      }),
    enabled: !!claimRequestId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })
  const hasFloatingCoverageItem =
    items?.some((item) => item.overrideInsuredPersonId != null) ?? false
  const { data: subInsuredPeople } = useQuery({
    queryKey: ['claimRequestSubInsuredPeople', claimRequestId],
    queryFn: ({ signal }) => {
      if (!claimRequestId) return []
      return claimRequestService.getSubInsuredPeople(claimRequestId, { signal })
    },
    enabled: Boolean(claimRequestId) && hasFloatingCoverageItem,
  })
  const subInsuredPeopleById = useMemo(() => {
    const peopleById = new Map<number, SubInsuredPersonResponse>()
    for (const person of subInsuredPeople ?? []) {
      if (person.id != null) peopleById.set(person.id, person)
    }
    return peopleById
  }, [subInsuredPeople])

  if (isLoading || items == null) {
    return <LoadingState />
  }

  if (items.length === 0) {
    if (!showEmptyMessage) return null
    return (
      <div className='py-12 text-center text-sm text-muted-foreground'>
        {t('assessmentItems.empty')}
      </div>
    )
  }

  return (
    <div className='mb-10 grid grid-cols-1 gap-3'>
      {items.map((item) => (
        <AssessmentItemCard
          key={item.id ?? `${item.damageCode?.code}-${item.title}`}
          item={item}
          mode={mode}
          deleteAccess={false}
          adjustmentAccess={false}
          claimRequestId={claimRequestId}
          claimRequest={claimRequest}
          overrideInsuredPerson={
            item.overrideInsuredPersonId == null
              ? undefined
              : subInsuredPeopleById.get(item.overrideInsuredPersonId)
          }
          fanavaranCalculationResult={afterCalculationResults?.filter(
            (result) => result.assessmentItemId === item.id
          )}
        />
      ))}
    </div>
  )
}
