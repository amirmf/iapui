import { PlaceholderPage } from '@features/placeholders'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/myclaims/create/')({
  component: () => <PlaceholderPage titleKey='myiap.nav.createClaim' />,
  loader: () => ({ crumb: 'createClaim' }),
})
