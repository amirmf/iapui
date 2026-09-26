import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/person-special-diseases/'
)({
  component: () => <PlaceholderPage titleKey='sidebar.personSpecialDiseases' />,
})
