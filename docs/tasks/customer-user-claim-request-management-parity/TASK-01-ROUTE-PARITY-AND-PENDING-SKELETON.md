# Task 01 — Route Parity and Pending Skeleton

## Objective
Align `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/claim-requests/$claimRequestId.claim-request-management/index.tsx` exactly with reference `insurance-ui/src/routes/customer-user/claim-requests/$claimRequestId/claim-request-management/index.tsx`:
1. Use `ClaimRequestManagementPanelPending` for `pendingComponent` instead of `ClaimRequestManagementPending`.
2. Import `CustomerUserClaimRequestManagementPage` directly from `@features/customer-user/pages/customer-user-claim-request-management-page`.

## Reference Code
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

## Action Items
- Update `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/claim-requests/$claimRequestId.claim-request-management/index.tsx`.
