import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/claim-reports/')({
  component: () => <PlaceholderPage titleKey='sidebar.claimReports' />,
})
