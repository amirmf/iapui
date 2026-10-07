import { useLayoutEffect, useMemo } from 'react'

import { CLAIM_REQUEST_STATUS_TRANSLATION_KEYS } from '@features/claim-requests/model/claim-request-status'
import { CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS } from '@features/claim-requests/pages/index/route-adapters/claim-request-feature'
import {
  type ClaimRequestQuickStatus,
  claimRequestQuickStatuses,
  claimRequestSentToBankQuickStatus,
  doctorClaimRequestQuickStatuses,
} from '@features/claim-requests/pages/index/route-adapters/claim-request-filters'
import { isDoctorRole, useAuthSession } from '@iap/auth'
import { cn } from '@iap/ui'
import { useTranslation } from 'react-i18next'

const statusCounts = new Map<string, number>()

type ClaimRequestStatusFilterProps = {
  count?: number
  isLoading?: boolean
  onStatusChange: (status: ClaimRequestQuickStatus) => void
  selectedStatus: ClaimRequestQuickStatus
}

export function ClaimRequestStatusFilter(props: ClaimRequestStatusFilterProps) {
  const { count, isLoading, onStatusChange, selectedStatus } = props
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
              ? isLoading
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
                    : t(CLAIM_REQUEST_STATUS_TRANSLATION_KEYS[status])}
            </p>
            <p>({displayedCount})</p>
          </button>
        )
      })}
    </div>
  )
}
