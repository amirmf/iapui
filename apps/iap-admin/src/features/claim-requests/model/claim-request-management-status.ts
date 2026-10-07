import {
  type ClaimRequestStatus,
  claimRequestStatusSchema,
} from '@iap/api-types'

export function isClaimRequestStatus(
  value: unknown
): value is ClaimRequestStatus {
  return claimRequestStatusSchema.safeParse(value).success
}
