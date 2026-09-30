import { DocTypeFormRendererFrame } from '@features/formio'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/formio/doc-types/$docTypeId/submission-example'
)({
  component: DocTypeFormRendererFrame,
})
