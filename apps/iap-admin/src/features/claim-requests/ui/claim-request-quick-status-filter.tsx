import { useLayoutEffect, useMemo } from 'react'

import { isDoctorRole, useAuthSession } from '@iap/auth'
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

const statusCounts = new Map<string, number>()

export function ClaimRequestQuickStatusFilter(props: {
  count?: number
  isFetching: boolean
  onStatusChange: (status: ClaimRequestQuickStatus) => void
  selectedStatus: ClaimRequestQuickStatus
}) {
  const { count, isFetching, onStatusChange, selectedStatus } = props
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const isDoctor = isDoctorRole(user?.roles ?? [])
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

  statusCounts.set(selectedStatus, count ?? 0)

  return (
    <div className='grid grid-cols-8'>
      {visibleQuickStatuses.map((status) => {
        const savedCount = statusCounts.get(status) ?? '-'
        const displayedCount =
          status === CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS
            ? '-'
            : selectedStatus === status
              ? isFetching
                ? savedCount
                : count || 0
              : savedCount

        return (
          <button
            aria-pressed={selectedStatus === status}
            className={cn(
              'rounded bg-muted px-1 py-2 text-[0.8rem]',
              selectedStatus === status &&
                'bg-primary font-medium text-muted shadow'
            )}
            key={status}
            onClick={() => onStatusChange(status)}
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
