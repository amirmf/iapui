import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/otp/')({
  component: () => <PlaceholderPage titleKey='sidebar.otp' />,
})
