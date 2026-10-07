# Task 01: Query Hook and Service Contracts

## Objective

Create `use-agent-claim-request-management-data.ts` in `features/agent-claim-requests/queries/` with exact parity to reference `src/features/agent-claim-requests/hooks/use-agent-claim-request-management-data.ts`.

## Reference Implementation

```ts
// insurance-ui: src/features/agent-claim-requests/hooks/use-agent-claim-request-management-data.ts
export function agentClaimRequestManagementQueryOptions(claimRequestId: string) {
  return queryOptions({
    queryKey: ['agentClaimRequest', claimRequestId],
    queryFn: ({ signal }) =>
      agentClaimRequestService.getById(claimRequestId, { signal }),
    staleTime: 10000,
    gcTime: 10000,
    refetchOnWindowFocus: true,
  })
}

function useAgentClaimRequestManagementData() {
  const { claimRequestId } = useParams({
    from: '/agent/claim-requests/$claimRequestId/claim-request-management/',
  })
  return useQuery(agentClaimRequestManagementQueryOptions(claimRequestId))
}
```

## Target Implementation Details

- File: `apps/iap-admin/src/features/agent-claim-requests/queries/use-agent-claim-request-management-data.ts`
- Uses `useParams` with `from: '/_agent/agent/claim-requests/$claimRequestId/claim-request-management/'` matching target route tree.
- Uses `agentClaimRequestService.getById(claimRequestId, { signal })` from `@features/agent-claim-requests/services/agent-claim-request-service`.
- In `agentClaimRequestService.getById`:
  - Calls `GET /claim-request-registery-agent/claim-requests/{id}`.
  - Validates and parses response with `claimRequestSchema.parse(response.data)`.
  - Inferred return type: `ClaimRequest`.
- Exports:
  - `agentClaimRequestManagementQueryOptions`
  - `useAgentClaimRequestManagementData` (both named and default export)
