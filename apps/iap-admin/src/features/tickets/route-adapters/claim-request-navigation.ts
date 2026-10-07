import {
  CLAIM_REQUEST_FEATURES,
  CLAIM_REQUEST_FEATURE_QUERY_KEY,
  type ClaimRequestQuickStatus,
} from '@features/claim-requests'

export function toClaimRequestsSearch(status: ClaimRequestQuickStatus) {
  return {
    [CLAIM_REQUEST_FEATURE_QUERY_KEY]: CLAIM_REQUEST_FEATURES.claimRequests,
    quickStatus: status,
  }
}
