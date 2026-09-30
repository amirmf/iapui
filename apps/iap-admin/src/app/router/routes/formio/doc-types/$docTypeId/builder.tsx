import { DocTypeFormBuilderFrame } from '@features/formio'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/formio/doc-types/$docTypeId/builder')({
  component: DocTypeFormBuilderFrame,
})
