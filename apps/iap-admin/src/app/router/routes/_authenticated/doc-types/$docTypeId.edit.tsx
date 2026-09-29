import { DocTypeEditPage } from '@features/doc-types'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/doc-types/$docTypeId/edit'
)({
  component: DocTypeEditPage,
  loader: ({ params }) => ({ crumb: params.docTypeId }),
})
