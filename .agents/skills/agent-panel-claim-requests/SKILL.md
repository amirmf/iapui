---
name: agent-panel-claim-requests
description: Guide for implementing, extending, and maintaining agent claim request pages (index, create, details/management) in iap-admin with exact reference parity to insurance-ui and aligned with application architecture.
---

# Agent Panel Claim Requests

Use this skill when implementing, maintaining, or extending agent claim requests pages (`/agent/claim-requests/**`) in `apps/iap-admin` with exact reference parity to `insurance-ui` and full compliance with `docs/architecture/APPLICATION-ARCHITECTURE.md`.

## Scope and Capabilities

The Agent Claim Requests area serves registry agents managing insurance claims:
1. **Index List Page** (`/agent/claim-requests/`):
   - Route: `apps/iap-admin/src/app/router/routes/_agent/agent/claim-requests/index.tsx`
   - Page Journey: `apps/iap-admin/src/features/agent-claim-requests/pages/index/agent-claim-requests-page.tsx`
   - Components: `pages/index/components/` (`agent-claim-requests-header.tsx`, `agent-claim-requests-table.tsx`, `agent-claim-request-columns.tsx`, `agent-claim-request-header-actions.tsx`, `agent-claim-request-row-actions.tsx`, `agent-claim-request-delete-dialog.tsx`)
   - Queries: `pages/index/queries/use-agent-claim-requests-query.ts`
   - Context: `pages/index/context/store/agent-claim-request-store.ts` and `pages/index/context/provider/agent-claim-request-provider.tsx`
   - Route Adapters: `pages/index/route-adapters/use-sync-query-params-table-filter.ts`
   - Features: Multi-column paginated table, quick status filter, search-params sync, Excel export, row actions (details, complete documents, refresh policy, delete).
2. **Creation Journey** (`/agent/claim-requests/create/`):
   - Route: `apps/iap-admin/src/app/router/routes/_agent/agent/claim-requests/create/index.tsx`
   - Page Journey: `apps/iap-admin/src/features/agent-claim-requests/pages/create/agent-claim-requests-create-page.tsx`
   - Components: `pages/create/components/`
     - `agent-claim-request-form.tsx`: Master form coordinating inquiry, policy, sub-insured, date, amount, doc-types, file-upload, and submission.
     - `agent-claim-request-inquiry-national-code-form-field.tsx`: 10-digit numerical input triggering inquiry with user display & `help_nationalCode` support button.
     - `agent-claim-request-ext-policy-id-form-field.tsx`: Select policy from inquiry data, auto-defaults first policy, clears sub-insured on change, with `help_insurancePolicy` support button.
     - `agent-claim-request-ext-national-code-form-field.tsx`: Query sub-insured people from `/claim-request-registery-agent/sub-insured-people/{policyId}/{username}`, handles foreign label format `({code}-اتباع)`, with `help_extNationalCode` support button.
     - `agent-claim-request-form-doc-types.tsx`: Doc-type select with `useDeferredValue` search filtering and pinned `others` option.
     - `agent-claim-request-account-not-found-dialog.tsx`: Uses `ConfirmDialog` (`presentation="reference"`) on 404 inquiry error, directing to `/agent/users/create/`.
   - Form Schemas & Contracts: `pages/create/model/agent-claim-request-form-schema.ts` (`agentClaimRequestFormSchema`, `AgentClaimRequestFormValues`, `MyClaimRequestPayload`, `defaultValues`).
   - Primitives:
     - `InputAmount` from `@iap/ui`: Numeric input with internal `rial` unit badge and footer Persian words in `toman` (`numberToPersianWords(val / 10)`).
     - `DatePicker` from `@iap/ui`: Uses `presentation="reference"`, `selected={field.value}`, and `onSelect={field.onChange}`.

3. **Claim Management / Details** (`/agent/claim-requests/$claimRequestId/claim-request-management/`):
   - Route: `apps/iap-admin/src/app/router/routes/_agent/agent/claim-requests/$claimRequestId.claim-request-management/index.tsx`
   - Page Journey: `apps/iap-admin/src/features/agent-claim-requests/pages/claim-request-management/agent-claim-request-management-page.tsx`
   - Components: `pages/claim-request-management/components/` (`agent-claim-request-management-header.tsx`, `agent-claim-request-management-details.tsx`, `agent-claim-request-management-footer.tsx`)
   - Queries: `pages/claim-request-management/queries/use-agent-claim-request-management-data.ts`
   - Prefetch loader: `agentClaimRequestManagementQueryOptions` with `staleTime: 'static'`, returning `{ crumb: 'claimDetails' }`.
   - Error & Pending: `pendingComponent: ClaimRequestManagementPanelPending`, `errorComponent: ClaimRequestManagementQueryError`.
   - Layout: Clean composite panels decomposing header status, claim info list, two-column assessment/attachments details, and history/document footer.
   - Boundary rule: All shared sections imported from `@features/claim-requests` must be exported via its public barrel (`apps/iap-admin/src/features/claim-requests/index.ts`).

## Core Architecture and Contracts

### 1. API Services and Endpoint Conventions

All agent-specific claim request endpoints follow the `/claim-request-registery-agent/**` path pattern:
- **Paged List**: `GET /claim-request-registery-agent/claim-requests/page-full` (uses `transformApiFilterParams`)
- **Excel Export**: `GET /claim-request-registery-agent/claim-requests/page-lite/excel` (with `responseType: 'blob'`, uses `transformApiFilterParams`)
- **Single Claim**: `GET /claim-request-registery-agent/claim-requests/{id}`
- **Create**: `POST /claim-request-registery-agent/claim-requests`
- **Update**: `PUT /claim-request-registery-agent/claim-requests/{id}`
- **Delete**: `DELETE /claim-request-registery-agent/claim-requests/{id}`
- **Refresh Policy**: `POST /claim-requests/{id}/policy-details`
- **Objection**: `POST /claim-request-registery-agent/claim-requests/objections`
- **Inquiry**: `GET /claim-request-registery-agent/inquery`
- **Sub-Insured People**: `GET /claim-request-registery-agent/sub-insured-people/{policyId}/{username}`

Always import and use `agentClaimRequestService` from `@features/agent-claim-requests`.

### 2. Contracts and Schemas

All schemas reside in `model/`:
- `apps/iap-admin/src/features/agent-claim-requests/model/agent-claim-request-schema.ts`
- `apps/iap-admin/src/features/agent-claim-requests/model/agent-claim-request-constant.ts`
- Re-exported via public barrel `apps/iap-admin/src/features/agent-claim-requests/index.ts`.
- Never duplicate schemas or use loose `any`. Infer types directly from Zod.

### 3. Context and State Management

- Page-exclusive state resides in `pages/index/context/store/` and `pages/index/context/provider/`.
- `useAgentClaimRequestStore` manages modal and active row state for table operations.
- `AgentClaimRequestProvider` resets store state on component unmount.
- Re-exported through the feature's public API for backwards compatibility.

### 4. Search Params and URL Synchronization

The table uses `useSyncQueryParamsTableFilter`:
```ts
useSyncQueryParamsTableFilter({
  pagination,
  setPagination,
  filters,
  sorting,
  onSortingChange,
})
```
**Critical Guard**: To avoid infinite re-render loops in tests or when query params change, extract primitive string values (`pageParam`, `sizeParam`, `sortParam`, `directionParam`) and guard updates against identical values before calling `setPagination` or `onSortingChange`.

### 5. Table and Column Setup

- Primary table uses `PaginatedDataTable` from `@shared/tables`.
- Set `tableWrapperClassName="max-h-130"` for consistency with the reference grid styling.
- Columns use `TwoLineHeader` and `TwoLineCell` for high-density information.
- Hidden columns are defined with `showColumn: false` in meta so they can be toggled via the toolbar without cluttering the default view.

### 6. Router and Breadcrumb Rules

- All route files must remain thin: declare route, loaders, guards, breadcrumb metadata, and render the page component from `@features/agent-claim-requests`.
- `iap-admin` enforces trailing slashes: `trailingSlash: 'always'`. All route targets must end with `/` (e.g. `./`, `/agent/claim-requests/create/`).
- Breadcrumb loader: `loader: () => ({ crumb: 'claim-agent' })`.

### 7. Translations

- Primary namespace: `agent.claimRequests.*` in `apps/iap-admin/src/shared/i18n/locales/fa/common.json`.
- Action and modal strings: `claimRequests.delete.*`, `claimRequests.tabs.*`, `claimRequests.bulkAssign.*`.
- Copy keys and values directly from `insurance-ui/src/locales/fa.json` without re-translating or modifying phrasing.

## Verification Checklist

When building or modifying agent claim request features:
1. `pnpm --filter iap-admin typecheck` (zero TypeScript errors).
2. `pnpm --filter iap-admin lint` (zero warnings and errors).
3. `pnpm architecture:check` (verifies package/feature boundaries).
4. `pnpm --filter iap-admin test agent-claim-requests` (all unit and integration tests passing).
5. `pnpm --filter iap-admin build` (production build succeeds).
