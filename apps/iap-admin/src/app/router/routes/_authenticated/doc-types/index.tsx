import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/doc-types/')({
  component: () => <PlaceholderPage titleKey='sidebar.docTypes' />,
})
