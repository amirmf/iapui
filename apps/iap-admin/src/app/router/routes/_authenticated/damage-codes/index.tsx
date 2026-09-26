import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/damage-codes/')({
  component: () => <PlaceholderPage titleKey='sidebar.damageCodes' />,
})
