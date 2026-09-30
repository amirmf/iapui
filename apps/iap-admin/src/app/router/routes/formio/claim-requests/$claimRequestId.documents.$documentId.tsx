import { ClaimDocumentFormRendererFrame } from '@features/formio'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/formio/claim-requests/$claimRequestId/documents/$documentId'
)({ component: ClaimDocumentFormRendererFrame })
