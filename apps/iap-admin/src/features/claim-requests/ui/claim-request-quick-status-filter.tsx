import { useLayoutEffect, useMemo } from 'react'

import { cn } from '@iap/ui'
import { useTranslation } from 'react-i18next'

import { claimRequestStatusTranslationKeys } from '../constants/claim-request-status'
import { CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS } from '../model/claim-request-feature'
import {
  claimRequestQuickStatuses,
  claimRequestSentToBankQuickStatus,
  doctorClaimRequestQuickStatuses,
} from '../model/claim-request-filters'
import { useClaimRequestTableSearch } from '../model/use-claim-request-table-search'

const statusCounts = new Map<string, number>()

export function ClaimRequestQuickStatusFilter(props: {
  count?: number
  isFetching: boolean
}) {
  const { count, isFetching } = props
  const { t } = useTranslation()
  const { isDoctor, onQuickStatusChange, quickStatus } =
    useClaimRequestTableSearch()
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

  statusCounts.set(quickStatus, count ?? 0)

  return (
    <div className='grid grid-cols-8'>
      {visibleQuickStatuses.map((status) => {
        const savedCount = statusCounts.get(status) ?? '-'
        const displayedCount =
          status === CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS
            ? '-'
            : quickStatus === status
              ? isFetching
                ? savedCount
                : count || 0
              : savedCount

        return (
          <button
            aria-pressed={quickStatus === status}
            className={cn(
              'rounded bg-muted px-1 py-2 text-[0.8rem]',
              quickStatus === status &&
                'bg-primary font-medium text-muted shadow'
            )}
            key={status}
            onClick={() => onQuickStatusChange(status)}
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
