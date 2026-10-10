import { PlaceholderPage } from '@features/placeholders'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/special-diseases/$id/')({
  component: () => <PlaceholderPage titleKey='myiap.specialDiseases.details' />,
  loader: () => ({ crumb: 'mySpecialDiseaseDetails' }),
})
