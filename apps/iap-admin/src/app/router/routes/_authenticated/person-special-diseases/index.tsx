import {
  PersonSpecialDiseasesPage,
  personSpecialDiseaseRouteSearchSchema,
} from '@features/person-special-diseases'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/person-special-diseases/'
)({
  component: PersonSpecialDiseasesPage,
  loader: () => ({ crumb: 'personSpecialDiseases' }),
  validateSearch: personSpecialDiseaseRouteSearchSchema,
})
