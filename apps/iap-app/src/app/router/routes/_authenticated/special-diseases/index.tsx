import { PlaceholderPage } from '@features/placeholders'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/special-diseases/')({
  component: () => <PlaceholderPage titleKey='myiap.nav.specialDiseases' />,
})
