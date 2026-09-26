import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/outpatient-doc-acceptances/'
)({
  component: () => (
    <PlaceholderPage titleKey='sidebar.outpatientDocAcceptances' />
  ),
})
