---
name: agent-panel-claim-requests
description: Guide for implementing, extending, and maintaining agent claim request pages (index, create, details/management) in iap-admin with exact reference parity to insurance-ui.
---

# Agent Panel Claim Requests

Use this skill when implementing, maintaining, or extending agent claim requests pages (`/agent/claim-requests/**`) in `apps/iap-admin` with exact line-by-line parity to the `insurance-ui` reference project.

## Scope and Capabilities

The Agent Claim Requests area serves registry agents managing insurance claims:
1. **Index List Page** (`/agent/claim-requests/`):
   - Route: `apps/iap-admin/src/app/router/routes/_agent/agent/claim-requests/index.tsx`
   - Page: `apps/iap-admin/src/features/agent-claim-requests/pages/agent-claim-requests-page.tsx`
   - Features: Multi-column paginated table, quick status filter, search-params sync, Excel export, row actions (details, complete documents, refresh policy, delete).
2. **Creation Journey** (`/agent/claim-requests/create/`):
   - Route: `apps/iap-admin/src/app/router/routes/_agent/agent/claim-requests/create/index.tsx`
   - Creation steps, inquiry, sub-insured person selection, document upload.
3. **Claim Management / Details** (`/agent/claim-requests/$claimRequestId/`):
   - Route: `apps/iap-admin/src/app/router/routes/_agent/agent/claim-requests/$claimRequestId/index.tsx`
   - Status tracking, document review, objection submission (`registeryAgentAddObjectionRequestSchema`).

## Core Architecture and Contracts

### 1. API Services and Endpoint Conventions

All agent-specific claim request endpoints follow the `/claim-request-registery-agent/**` path pattern:
- **Paged List**: `GET /claim-request-registery-agent/claim-requests/page-full`
- **Excel Export**: `GET /claim-request-registery-agent/claim-requests/export-page-lite-excel` (with `responseType: 'blob'`)
- **Single Claim**: `GET /claim-request-registery-agent/claim-requests/{id}`
- **Create**: `POST /claim-request-registery-agent/claim-requests`
- **Update**: `PUT /claim-request-registery-agent/claim-requests/{id}`
- **Delete**: `DELETE /claim-request-registery-agent/claim-requests/{id}`
- **Refresh Policy**: `POST /claim-request-registery-agent/claim-requests/{id}/refresh-policy-details`
- **Objection**: `POST /claim-request-registery-agent/claim-requests/{id}/objection`
- **Inquiry**: `POST /claim-request-registery-agent/claim-requests/inquiry`
- **Sub-Insured People**: `GET /claim-request-registery-agent/claim-requests/sub-insured-people`

Always import and use `agentClaimRequestService` from `@features/agent-claim-requests`. Provide both named and default exports.

### 2. Contracts and Schemas

All schemas reside in `packages/api-types/src/agent-claim-request/index.ts` and are exported via `@iap/api-types`:
- Inferred types: `AgentClaimRequest`, `RegisteryAgentPolicy`, `RegisteryAgentSubInsuredPerson`, `RegisteryAgentInquiry`, `CreateClaimRequestByRegisteryAgentRequest`, `RegisteryAgentAddObjectionRequest`.
- Service schemas: `apps/iap-admin/src/features/agent-claim-requests/data/agent-claim-request-service-schema.ts`.
- Never duplicate schemas or use loose `any`. Infer types directly from Zod.

### 3. Context and State Management

- Use a unified feature context: `apps/iap-admin/src/features/agent-claim-requests/context/claim-request-context.tsx`.
- The file exports:
  - `AgentClaimRequestProvider` (default and named)
  - `useAgentClaimRequest`
  - `useAgentClaimRequestStore`
- When exporting both the component and hooks from the same file, include `/* eslint-disable react-refresh/only-export-components */` at the top to satisfy Fast Refresh lint rules.

### 4. Search Params and URL Synchronization

The table uses `useSyncQueryParamsTableFilter`:
```ts
useSyncQueryParamsTableFilter({
  pagination,
  setPagination,
  filters,
  sorting,
  onSortingChange,
});
```
**Critical Guard**: To avoid infinite re-render loops in tests or when query params change, extract primitive string values (`pageParam`, `sizeParam`, `sortParam`, `directionParam`) and guard updates against identical values before calling `setPagination` or `onSortingChange`.

### 5. Table and Column Setup

- Primary table uses `PaginatedDataTable` from `@shared/tables`.
- Always set `tableWrapperClassName="max-h-130"` for consistency with the reference grid styling.
- Columns use `TwoLineHeader` and `TwoLineCell` for high-density information (e.g., Claim Code / Tracking Number, Insured Person / National Code).
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
4. `pnpm --filter iap-admin test` (all unit and integration tests passing).
5. `pnpm --filter iap-admin build` (production build succeeds).
