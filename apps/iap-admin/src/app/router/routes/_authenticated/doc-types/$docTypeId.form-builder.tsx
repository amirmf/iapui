import { DocTypeFormBuilderPage } from '@features/doc-types'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/doc-types/$docTypeId/form-builder'
)({ component: DocTypeFormBuilderPage })
