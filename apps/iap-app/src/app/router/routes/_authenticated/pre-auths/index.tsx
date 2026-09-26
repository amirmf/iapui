import { PlaceholderPage } from '@features/placeholders'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/pre-auths/')({
  component: () => <PlaceholderPage titleKey='myiap.nav.preAuths' />,
})
