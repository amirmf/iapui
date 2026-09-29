import { DocTypesPage, docTypeRouteSearchSchema } from '@features/doc-types'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/doc-types/')({
  component: DocTypesPage,
  loader: () => ({ crumb: 'doctype' }),
  validateSearch: docTypeRouteSearchSchema,
})
