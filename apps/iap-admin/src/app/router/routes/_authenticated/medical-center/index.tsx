import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/medical-center/')({
  component: () => <PlaceholderPage titleKey='sidebar.medicalCenter' />,
})
