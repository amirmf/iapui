import { useMemo } from 'react'

import type { ClaimRequest } from '@iap/api-types'
import { cn } from '@iap/ui'
import { Badge } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

interface ClaimRequestAssignSectionProps {
  claimRequest?: ClaimRequest
}

function ClaimRequestAssignSection(props: ClaimRequestAssignSectionProps) {
  const { claimRequest } = props
  const { t } = useTranslate()
  const claimRequestAssigneeId = claimRequest?.assignedUserId

  const assignedLabel = useMemo(
    () =>
      claimRequest?.assignedUserDisplayName ??
      claimRequest?.latestAssignementDisplayName ??
      t('common.notAvailable'),
    [
      claimRequest?.assignedUserDisplayName,
      claimRequest?.latestAssignementDisplayName,
      t,
    ]
  )

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='flex items-center'>
        <p className='pe-1 text-center text-xs font-medium text-muted-foreground'>
          {t('claimRequests.assignment.label')}:
        </p>
        <Badge
          presentation='reference'
          variant='outline'
          className={cn(
            'w-fit border-primary-200 bg-primary-100/30 capitalize text-primary-900 dark:text-primary-200'
          )}
        >
          {claimRequestAssigneeId
            ? assignedLabel
            : `<${t('claimRequests.assignment.noAssign')}>`}
        </Badge>
      </div>
      <div className='flex items-center'>
        <p className='pe-1 text-center text-xs font-medium text-muted-foreground'>
          {t('claimRequests.assignment.companyAssessment')}:
        </p>
        <Badge
          presentation='reference'
          variant='outline'
          className={cn(
            'w-fit border-violet-200 bg-violet-100/30 capitalize text-violet-900 dark:text-violet-200'
          )}
        >
          {claimRequest?.mainAssignedUserDisplayName ??
            t('common.notAvailable')}
        </Badge>
      </div>
    </div>
  )
}

export default ClaimRequestAssignSection
