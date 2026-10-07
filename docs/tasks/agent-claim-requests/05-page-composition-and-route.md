# Task 05: Page Composition and Route Replacement

## Objective

Assemble `AgentClaimRequestsPage` in `apps/iap-admin/src/features/agent-claim-requests/` and replace the placeholder route in `apps/iap-admin/src/app/router/routes/_agent/agent/claim-requests/index.tsx`.

## Reference Inspection

In `insurance-ui`:
- `src/routes/agent/claim-requests/index.tsx`:
  - `createFileRoute('/agent/claim-requests/')`
  - `component: AgentClaimRequestsPage`
  - `loader: () => ({ crumb: 'claim-agent' })`
- `src/features/agent-claim-requests/pages/agent-claim-requests-page.tsx`:
  - Query with TanStack Query `useQuery`:
    - `queryKey: ['agentClaimRequests', pagination, filters]`
    - Calls `agentClaimRequestService.getPage`
    - Formats sort default to `createdAt: asc` if not set
    - Applies `quickStatus` filter (defaults to `'IN_ASSESSMENT'`)
  - Renders:
    - `<AgentClaimRequestProvider>`
    - `<Main>` container
    - Header: title `{t('agent.claimRequests.title')}` + `<AgentClaimRequestHeaderActions>`
    - Toolbar: `<ClaimRequestDataTableToolbar count={pageData?.totalElements} isLoading={isLoading || isFetching} />`
    - Table: `<PaginatedDataTable columns={columns} data={claimRequests} ... />`
    - Dialog: `<AgentClaimRequestDeleteDialog refetch={refetch} />`

## Target Architecture

1. **Table Filtering Adapter**:
   - `apps/iap-admin/src/features/agent-claim-requests/route-adapters/use-agent-claim-request-table-search.ts`:
     Synchronizes pagination, sorting, and filters with the URL search parameters, applying `toClaimRequestQuickStatusSearch`.
2. **Page Composition**:
   - `apps/iap-admin/src/features/agent-claim-requests/agent-claim-requests-page.tsx`:
     Composes the provider, query hook, header actions, toolbar, paginated table, and delete dialog.
   - `apps/iap-admin/src/features/agent-claim-requests/index.ts`:
     Exposes public entry point: `export { AgentClaimRequestsPage } from './agent-claim-requests-page'`.
3. **Route Replacement**:
   - `apps/iap-admin/src/app/router/routes/_agent/agent/claim-requests/index.tsx`:
     Imports `AgentClaimRequestsPage` from `@features/agent-claim-requests`.
     Retains thin route boundary and `loader: () => ({ crumb: 'claim-agent' })`.
   - Add colocated page test `agent-claim-requests-page.test.tsx`.

## Acceptance Criteria

- Route file remains thin and delegates to `@features/agent-claim-requests`.
- Server state is owned by TanStack Query.
- Quick status filter and pagination synchronize properly with URL search parameters.
