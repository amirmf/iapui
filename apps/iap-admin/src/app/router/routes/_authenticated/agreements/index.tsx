import {
  AgreementsPage,
  agreementRouteSearchSchema,
} from '@features/agreements'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/agreements/')({
  component: AgreementsPage,
  loader: () => ({ crumb: 'agreement' }),
  validateSearch: agreementRouteSearchSchema,
})
