# Task 01 — Hooks and Query Options

## Objective
Implement `customerUserClaimRequestQueryOptions` and `useCustomerUserClaimRequest` in `iap-admin` with exact parity to reference `insurance-ui/src/features/customer-user/hooks/use-customer-user-claim-request.ts`.

## Reference Inspection
File: `insurance-ui/src/features/customer-user/hooks/use-customer-user-claim-request.ts`
```ts
import { queryOptions, useQuery } from '@tanstack/react-query'
import claimRequestService from '@/features/claim-requests/services/claim-request-service'

export function customerUserClaimRequestQueryOptions(claimRequestId: string) {
  return queryOptions({
    queryKey: ['customerUserClaimRequest', claimRequestId],
    queryFn: ({ signal }) =>
      claimRequestService.getById(claimRequestId, { signal }),
    enabled: Boolean(claimRequestId),
  })
}

export function useCustomerUserClaimRequest(claimRequestId: string) {
  return useQuery(customerUserClaimRequestQueryOptions(claimRequestId))
}
```

## Implementation Details
1. Create `apps/iap-admin/src/features/customer-user/hooks/use-customer-user-claim-request.ts`.
2. Import `queryOptions, useQuery` from `@tanstack/react-query`.
3. Import `claimRequestService` from `@features/claim-requests`.
4. Export `customerUserClaimRequestQueryOptions` with query key `['customerUserClaimRequest', claimRequestId]`.
5. Export `useCustomerUserClaimRequest`.
6. Export from `apps/iap-admin/src/features/customer-user/index.ts`.
7. Add comprehensive unit tests verifying query key, fetch invocation, signal forwarding, and enabled conditions.
