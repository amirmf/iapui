# Task 03 — Route Wiring and Breadcrumbs

## Objective
Wire route `/_customer-user/customer-user/claim-requests/$claimRequestId/claim-request-management/` in `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/claim-requests/$claimRequestId.claim-request-management/index.tsx` to replace placeholder with exact reference behavior.

## Reference Inspection
File: `insurance-ui/src/routes/customer-user/claim-requests/$claimRequestId/claim-request-management/index.tsx`
```tsx
import { createFileRoute } from '@tanstack/react-router'
import { ClaimRequestManagementPanelPending } from '@/features/claim-requests/components/claim-request-management-pending'
import { ClaimRequestManagementQueryError } from '@/features/claim-requests/components/claim-request-management-query-error'
import { customerUserClaimRequestQueryOptions } from '@/features/customer-user/hooks/use-customer-user-claim-request'
import CustomerUserClaimRequestManagementPage from '@/features/customer-user/pages/customer-user-claim-request-management-page'

export const Route = createFileRoute(
  '/customer-user/claim-requests/$claimRequestId/claim-request-management/'
)({
  loader: async ({ context, params }) => {
    await context.queryClient.query({
      ...customerUserClaimRequestQueryOptions(params.claimRequestId),
      staleTime: 'static',
    })

    return { crumb: 'claim-request-management' }
  },
  pendingComponent: ClaimRequestManagementPanelPending,
  pendingMs: 200,
  pendingMinMs: 200,
  errorComponent: ({ error }) => (
    <ClaimRequestManagementQueryError error={error} />
  ),
  component: CustomerUserClaimRequestManagementPage,
})
```

## Implementation Details
1. Update `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/claim-requests/$claimRequestId.claim-request-management/index.tsx`.
2. Connect `customerUserClaimRequestQueryOptions` in loader with `staleTime: 'static'`.
3. Return `{ crumb: 'claim-request-management' }`.
4. Connect `pendingComponent: ClaimRequestManagementPending` with `pendingMs: 200, pendingMinMs: 200`.
5. Connect `errorComponent: ({ error }) => <ClaimRequestManagementQueryError error={error} />`.
6. Connect `component: CustomerUserClaimRequestManagementPage`.
7. Verify route tree regeneration or compliance.
