import { MY_IAP_SENT_TO_BANK_FILTER_VALUE } from '@features/my-claims/constants/claim-status-constant'
import type { ClaimRequestStatus } from '@iap/api-types'

type ClaimRequestDisplayStatus =
  ClaimRequestStatus | typeof MY_IAP_SENT_TO_BANK_FILTER_VALUE

interface ClaimRequestPaymentStatus {
  status?: ClaimRequestStatus | null
  extPaymentDate?: string | null
}

export function getClaimRequestDisplayStatus(
  claim: ClaimRequestPaymentStatus
): ClaimRequestDisplayStatus | null | undefined {
  return claim.status === 'PAID' && claim.extPaymentDate == null
    ? MY_IAP_SENT_TO_BANK_FILTER_VALUE
    : claim.status
}

export function getClaimRequestDisplayStatusColor(
  status: ClaimRequestDisplayStatus | null | undefined
): ClaimRequestStatus | null | undefined {
  return status === MY_IAP_SENT_TO_BANK_FILTER_VALUE ? 'PAID' : status
}
