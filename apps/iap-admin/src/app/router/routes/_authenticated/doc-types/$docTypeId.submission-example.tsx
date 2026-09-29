import { DocTypeSampleSubmissionPage } from '@features/doc-types'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/doc-types/$docTypeId/submission-example'
)({ component: DocTypeSampleSubmissionPage })
