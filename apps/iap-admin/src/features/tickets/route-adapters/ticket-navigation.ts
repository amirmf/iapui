import {
  CLAIM_REQUEST_FEATURES,
  CLAIM_REQUEST_FEATURE_QUERY_KEY,
  type ClaimRequestQuickStatus,
} from '@features/claim-requests'
import type { TableFilterSearch } from '@shared/tables'

export type TicketStatus =
  'ALL' | 'ASSIGNED' | 'ANSWERED' | 'CLOSED' | 'WAITING_FOR_SUPPORT'

export function toClaimRequestsSearch(status: ClaimRequestQuickStatus) {
  return {
    [CLAIM_REQUEST_FEATURE_QUERY_KEY]: CLAIM_REQUEST_FEATURES.claimRequests,
    quickStatus: status,
  }
}

export function toTicketStatusSearch(
  search: TableFilterSearch,
  status: TicketStatus
) {
  return { ...search, page: undefined, status }
}
