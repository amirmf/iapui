import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/claim-requests/')({
  component: () => <PlaceholderPage titleKey='sidebar.claimRequests' />,
})
