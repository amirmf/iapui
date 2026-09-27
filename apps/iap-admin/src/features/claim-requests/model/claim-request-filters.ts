import type { ClaimRequestStatus } from '@iap/api-types'
import type { TableFilterSearch } from '@shared/tables'
import { produce } from 'immer'

import { CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS } from './claim-request-feature'

export const claimRequestQuickStatuses = [
  'ALL',
  'IN_ASSESSMENT',
  'DEDICATED_TO_USER',
  'DELEGATED',
  'APPROVED',
  'SENT',
  'SENT_FAILED',
  'RETURN',
  'DELETED',
  'REJECTED',
  'PAID',
  CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS,
] as const satisfies readonly (
  'ALL' | ClaimRequestStatus | typeof CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS
)[]

export type ClaimRequestQuickStatus = (typeof claimRequestQuickStatuses)[number]

export const doctorClaimRequestQuickStatuses = ['DELEGATED'] as const
export const doctorClaimRequestDefaultQuickStatus = 'DELEGATED'
export const skipCurrentUserQuickStatuses = new Set([
  'APPROVED',
  'DEDICATED_TO_USER',
  'DELEGATED',
  'IN_ASSESSMENT',
  'PAID',
  'RETURN',
  'SENT',
  'SENT_FAILED',
])

export function getClaimRequestQuickStatus(
  filters: TableFilterSearch,
  isDoctor = false
): ClaimRequestQuickStatus {
  const quickStatus = filters.quickStatus

  if (
    isDoctor &&
    !doctorClaimRequestQuickStatuses.includes(
      quickStatus as (typeof doctorClaimRequestQuickStatuses)[number]
    )
  ) {
    return doctorClaimRequestDefaultQuickStatus
  }

  return claimRequestQuickStatuses.includes(
    quickStatus as ClaimRequestQuickStatus
  )
    ? (quickStatus as ClaimRequestQuickStatus)
    : 'IN_ASSESSMENT'
}

export function toClaimRequestApiFilters(
  filters: TableFilterSearch,
  isDoctor = false
) {
  const quickStatus = getClaimRequestQuickStatus(filters, isDoctor)

  return produce(filters, (draft) => {
    delete draft.quickStatus
    if (!draft.sort) draft.sort = 'createdAt'
    if (!draft.direction) draft.direction = 'asc'
    if (!skipCurrentUserQuickStatuses.has(quickStatus)) {
      draft.skipCurrentUserFilter = 'Y'
    }
    if (quickStatus !== 'ALL') draft.status = quickStatus
  })
}
