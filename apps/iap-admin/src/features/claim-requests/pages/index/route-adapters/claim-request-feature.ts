export const CLAIM_REQUEST_FEATURE_QUERY_KEY = 'features'

export const CLAIM_REQUEST_FEATURES = {
  claimRequests: 'claim-requests',
  tickets: 'tickets',
} as const

export type ClaimRequestFeature =
  (typeof CLAIM_REQUEST_FEATURES)[keyof typeof CLAIM_REQUEST_FEATURES]

export const CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS =
  'NEEDS_REASSESSMENT' as const

export function getClaimRequestFeature(search: unknown): ClaimRequestFeature {
  if (!search || typeof search !== 'object') {
    return CLAIM_REQUEST_FEATURES.claimRequests
  }

  const feature = (search as Record<string, unknown>)[
    CLAIM_REQUEST_FEATURE_QUERY_KEY
  ]

  return feature === CLAIM_REQUEST_FEATURES.tickets
    ? CLAIM_REQUEST_FEATURES.tickets
    : CLAIM_REQUEST_FEATURES.claimRequests
}
