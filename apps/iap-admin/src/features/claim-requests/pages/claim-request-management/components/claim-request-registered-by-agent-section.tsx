import { useMemo } from 'react'

import type { ClaimRequest } from '@iap/api-types'
import { cn } from '@iap/ui'
import { Badge } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

interface ClaimRequestRegisteredByAgentSectionProps {
  claimRequest: ClaimRequest
}

export function ClaimRequestRegisteredByAgentSection(
  props: ClaimRequestRegisteredByAgentSectionProps
) {
  const { claimRequest } = props
  const { t } = useTranslate()
  const registeredByAgentLabel = useMemo(() => {
    const displayName = claimRequest.registeredByAgentDisplayName
    const username = claimRequest.registeredByAgentUsername

    if (displayName && username) {
      return `${displayName} (${username})`
    }

    return displayName ?? username ?? ''
  }, [
    claimRequest.registeredByAgentDisplayName,
    claimRequest.registeredByAgentUsername,
  ])

  if (!registeredByAgentLabel) return null

  return (
    <div className='flex items-center'>
      <p className='pe-1 text-center text-xs font-medium text-muted-foreground'>
        {t('claimRequests.assignment.registeredByAgent')}:
      </p>
      <Badge
        presentation='reference'
        variant='outline'
        className={cn(
          'w-fit border-amber-200 bg-amber-100/30 capitalize text-amber-900 dark:text-amber-200'
        )}
      >
        {registeredByAgentLabel}
      </Badge>
    </div>
  )
}
