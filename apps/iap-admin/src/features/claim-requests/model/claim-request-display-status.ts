import type { ClaimRequestStatus } from '@iap/api-types'

export const sentToBankStatus = 'SENT_TO_BANK' as const

export function getClaimRequestDisplayStatus(claim: {
  extPaymentDate?: string | null
  status?: ClaimRequestStatus | null
}) {
  return claim.status === 'PAID' && claim.extPaymentDate == null
    ? sentToBankStatus
    : claim.status
}

export function getClaimRequestDisplayStatusColor(
  status: ClaimRequestStatus | typeof sentToBankStatus | null | undefined
) {
  return status === sentToBankStatus ? 'PAID' : status
}
