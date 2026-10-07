# Task 04: Route and Breadcrumbs

## Objective

Replace placeholder route in `apps/iap-admin/src/app/router/routes/_agent/agent/claim-requests/$claimRequestId.claim-request-management/index.tsx` with production TanStack Router definition matching reference.

## Reference Implementation

```tsx
// insurance-ui: src/routes/agent/claim-requests/$claimRequestId/claim-request-management/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { agentClaimRequestManagementQueryOptions } from '@/features/agent-claim-requests/hooks/use-agent-claim-request-management-data'
import { AgentClaimRequestManagement } from '@/features/agent-claim-requests/pages/agent-claim-request-management.tsx'
import { ClaimRequestManagementPanelPending } from '@/features/claim-requests/components/claim-request-management-pending'
import { ClaimRequestManagementQueryError } from '@/features/claim-requests/components/claim-request-management-query-error'

export const Route = createFileRoute(
  '/agent/claim-requests/$claimRequestId/claim-request-management/'
)({
  loader: async ({ context, params }) => {
    await context.queryClient.query({
      ...agentClaimRequestManagementQueryOptions(params.claimRequestId),
      staleTime: 'static',
    })

    return { crumb: 'claimDetails' }
  },
  pendingComponent: ClaimRequestManagementPanelPending,
  pendingMs: 200,
  pendingMinMs: 200,
  errorComponent: ({ error }) => (
    <ClaimRequestManagementQueryError error={error} />
  ),
  component: AgentClaimRequestManagement,
})
```

## Target Implementation

```tsx
// apps/iap-admin/src/app/router/routes/_agent/agent/claim-requests/$claimRequestId.claim-request-management/index.tsx
import {
  AgentClaimRequestManagement,
  agentClaimRequestManagementQueryOptions,
} from '@features/agent-claim-requests'
import {
  ClaimRequestManagementPanelPending,
  ClaimRequestManagementQueryError,
} from '@features/claim-requests'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_agent/agent/claim-requests/$claimRequestId/claim-request-management/'
)({
  loader: async ({ context, params }) => {
    await context.queryClient.query({
      ...agentClaimRequestManagementQueryOptions(params.claimRequestId),
      staleTime: 'static',
    })

    return { crumb: 'claimDetails' }
  },
  pendingComponent: ClaimRequestManagementPanelPending,
  pendingMs: 200,
  pendingMinMs: 200,
  errorComponent: ({ error }) => (
    <ClaimRequestManagementQueryError error={error} />
  ),
  component: AgentClaimRequestManagement,
})
```

## Breadcrumb and URL Rules

- Trailing slash: `trailingSlash: 'always'` enforced.
- Pathless layout ancestor: `_agent` (URLs render `/agent/claim-requests/$claimRequestId/claim-request-management/`).
- Breadcrumb loader returns `{ crumb: 'claimDetails' }` matching translation key `claimDetails: 'جزئیات درخواست'`.
