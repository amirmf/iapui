import { ClaimRequestsPage } from '@features/claim-requests'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/claim-requests/')({
  component: ClaimRequestsPage,
})
