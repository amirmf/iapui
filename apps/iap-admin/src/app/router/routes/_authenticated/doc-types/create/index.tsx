import { DocTypeCreatePage } from '@features/doc-types'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/doc-types/create/')({
  component: DocTypeCreatePage,
  loader: () => ({ crumb: 'docType-create' }),
})
