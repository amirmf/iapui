import { ClaimRequestsContent } from '@features/claim-requests/pages/index/components/claim-requests-content'
import { ClaimRequestProvider } from '@features/claim-requests/pages/index/context/provider/claim-request-provider'
import {
  CLAIM_REQUEST_FEATURES,
  getClaimRequestFeature,
} from '@features/claim-requests/pages/index/route-adapters/claim-request-feature'
import { ClaimRequestsTicketsPage } from '@features/tickets'
import { useLocation } from '@tanstack/react-router'

export function ClaimRequestsPage() {
  const location = useLocation()
  const feature = getClaimRequestFeature(location.search)

  if (feature === CLAIM_REQUEST_FEATURES.tickets) {
    return <ClaimRequestsTicketsPage />
  }

  return (
    <ClaimRequestProvider>
      <ClaimRequestsContent />
    </ClaimRequestProvider>
  )
}
