import { useLayoutEffect, useMemo } from 'react'

import { cn } from '@iap/ui'
import { useTranslation } from 'react-i18next'

import { claimRequestStatusTranslationKeys } from '../constants/claim-request-status'
import { CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS } from '../model/claim-request-feature'
import {
  type ClaimRequestQuickStatus,
  claimRequestQuickStatuses,
  claimRequestSentToBankQuickStatus,
  doctorClaimRequestQuickStatuses,
} from '../model/claim-request-filters'
import { useClaimRequestTableSearch } from '../model/use-claim-request-table-search'

const statusCounts = new Map<string, number>()

type ClaimRequestQuickStatusFilterProps = {
  count?: number
  isFetching: boolean
  onQuickStatusChange?: (status: ClaimRequestQuickStatus) => void
  quickStatus?: ClaimRequestQuickStatus
}

export function ClaimRequestQuickStatusFilter(
  props: ClaimRequestQuickStatusFilterProps
) {
  const { count, isFetching, onQuickStatusChange, quickStatus } = props
  const { t } = useTranslation()
  const {
    isDoctor,
    onQuickStatusChange: onSearchQuickStatusChange,
    quickStatus: searchQuickStatus,
  } = useClaimRequestTableSearch()
  const resolvedQuickStatus = quickStatus ?? searchQuickStatus
  const handleQuickStatusChange =
    onQuickStatusChange ?? onSearchQuickStatusChange
  const visibleQuickStatuses = useMemo(
    () =>
      isDoctor
        ? [...doctorClaimRequestQuickStatuses]
        : [...claimRequestQuickStatuses],
    [isDoctor]
  )

  useLayoutEffect(() => {
    statusCounts.clear()
  }, [])

  statusCounts.set(resolvedQuickStatus, count ?? 0)

  return (
    <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8'>
      {visibleQuickStatuses.map((status) => {
        const savedCount = statusCounts.get(status) ?? '-'
        const displayedCount =
          status === CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS
            ? '-'
            : resolvedQuickStatus === status
              ? isFetching
                ? savedCount
                : count || 0
              : savedCount

        return (
          <button
            aria-pressed={resolvedQuickStatus === status}
            className={cn(
              'min-h-11 rounded bg-muted px-1 py-2 text-[0.8rem]',
              resolvedQuickStatus === status &&
                'bg-primary font-medium text-muted shadow'
            )}
            key={status}
            onClick={() => handleQuickStatusChange(status)}
            type='button'
          >
            <p>
              {status === 'ALL'
                ? t('common.all')
                : status === CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS
                  ? t('claimRequests.status.needsReassessment')
                  : status === claimRequestSentToBankQuickStatus
                    ? t('claimRequests.status.sentToBank')
                    : t(claimRequestStatusTranslationKeys[status])}
            </p>
            <p>({displayedCount})</p>
          </button>
        )
      })}
    </div>
  )
}
