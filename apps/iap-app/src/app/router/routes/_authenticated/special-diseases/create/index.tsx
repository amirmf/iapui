import { PlaceholderPage } from '@features/placeholders'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/special-diseases/create/'
)({
  component: () => <PlaceholderPage titleKey='myiap.specialDiseases.create' />,
  loader: () => ({ crumb: 'createMySpecialDisease' }),
})
