import { PlaceholderPage } from '@features/placeholders'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/myclaims/$id/')({
  component: () => (
    <PlaceholderPage titleKey='myiap.claimRequests.claimDetails' />
  ),
  loader: () => ({ crumb: 'claimDetails' }),
})
