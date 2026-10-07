# Task 07: Reference Parity Audit and Discrepancies

## Reference Source
Reference Path: `/home/sadegh/Android/project/insurance-ui`
Target Path: `apps/iap-admin`

## Comparison Matrix

| Component / Artifact | Reference Path (`insurance-ui`) | Current Target State | Discrepancies Identified | Resolution Plan |
|---|---|---|---|---|
| **Page Component** | `src/features/agent-claim-requests/pages/agent-claim-requests-page.tsx` | `apps/iap-admin/src/features/agent-claim-requests/agent-claim-requests-page.tsx` | 1. Located in feature root instead of `pages/`.<br>2. `queryKey` uses `effectiveFilters` instead of `['agentClaimRequests', pagination, filters]`.<br>3. `produce(filters, (draft) => ...)` with `applyClaimRequestQuickStatusFilter` was wrapped inside a custom hook rather than inline in `queryFn`.<br>4. Header actions filters calculation differs.<br>5. Default export naming. | Align page location to `pages/agent-claim-requests-page.tsx` (re-export from feature root), align queryKey to `['agentClaimRequests', pagination, filters]`, align `queryFn` and filter producing verbatim. |
| **Context & Provider** | `src/features/agent-claim-requests/context/claim-request-context.tsx` | Split into `context/store/agent-claim-request-store.ts` & `context/provider/agent-claim-request-provider.tsx` | Reference has unified `claim-request-context.tsx` exporting default `AgentClaimRequestProvider`, plus `useAgentClaimRequest` and `useAgentClaimRequestStore`. | Add `claim-request-context.tsx` with identical default and named exports. |
| **Service API** | `src/features/agent-claim-requests/services/agent-claim-request-service.ts` | 5 endpoints implemented (`getPage`, `delete`, `refreshPolicyDetails`, `getById`, `exportPageLiteExcel`) | Reference has 10 endpoints: `getById`, `create`, `update`, `delete`, `refreshPolicyDetails`, `submitObjection`, `getSubInsuredPeople`, `inquiry`, `getPage`, `exportPageLiteExcel`. Default export was missing. | Implement all 10 endpoints with exact routes, method signatures, zod schema parsing, and default export. |
| **Service Schemas** | `src/features/agent-claim-requests/data/agent-claim-request-service-schema.ts` | Missing `data/agent-claim-request-service-schema.ts` in feature; partial schemas in `@iap/api-types`. | Reference defines 7 request/response schemas and inferred types (`registeryAgentSubInsuredPersonSchema`, `registeryAgentPolicySchema`, `registeryAgentInquirySchema`, `subInsuredPersonResponseSchema`, `subInsuredPersonResponseListSchema`, `createClaimRequestByRegisteryAgentRequestSchema`, `registeryAgentAddObjectionRequestSchema`). | Port all schemas to `data/agent-claim-request-service-schema.ts` and `@iap/api-types/src/agent-claim-request/`. |
| **Filter Utility** | `src/features/claim-requests/utils/claim-request-quick-status-filter.ts` | Inlined inside feature hook. | Missing standalone `applyClaimRequestQuickStatusFilter` utility under `src/features/claim-requests/utils/` and export from `@features/claim-requests`. | Create `src/features/claim-requests/utils/claim-request-quick-status-filter.ts` and export from `@features/claim-requests`. |
| **Table Filter Hook** | `src/components/data-table/filter/use-sync-query-params-table-filter.ts` | Named `use-agent-claim-request-table-search.ts` with custom signature. | Reference uses `useSyncQueryParamsTableFilter` returning `{ setPagination, pagination, filters, sorting, onSortingChange }`. | Provide `useSyncQueryParamsTableFilter` matching the reference hook signature. |
| **Header Actions** | `src/features/agent-claim-requests/components/agent-claim-request-header-actions.tsx` | Named export only. | Reference uses default export `AgentClaimRequestHeaderActions`. | Export default and named `AgentClaimRequestHeaderActions`. |
| **Row Actions** | `src/features/agent-claim-requests/components/agent-claim-request-row-actions.tsx` | Named export only. | Reference uses default export `AgentClaimRequestRowActions`. | Export default and named `AgentClaimRequestRowActions`. |
| **Delete Dialog** | `src/features/agent-claim-requests/components/agent-claim-request-delete-dialog.tsx` | Wrapped refetch callback. | Reference passes `refetch={refetch}` directly. | Align delete dialog usage and props. |
| **Translations** | `src/locales/fa.json` | Missing 4 keys in `claimRequests` namespace. | Missing `claimRequests.delete`, `claimRequests.create`, `claimRequests.bulkAssign`, `claimRequests.tabs`. | Add missing keys to `src/shared/i18n/locales/fa/common.json`. |

## Task Execution Sequence
- **Task 08**: Implement full `agent-claim-request-service-schema.ts` & update `@iap/api-types`.
- **Task 09**: Implement full 10-method `agent-claim-request-service.ts` with default export.
- **Task 10**: Implement `claim-request-context.tsx` with default export `AgentClaimRequestProvider` and hook aliases.
- **Task 11**: Implement `applyClaimRequestQuickStatusFilter` and `useSyncQueryParamsTableFilter`.
- **Task 12**: Update `AgentClaimRequestsPage` to exact reference parity in `pages/agent-claim-requests-page.tsx`.
- **Task 13**: Add missing Persian translations in `common.json`.
- **Task 14**: Run full validation gates (typecheck, lint, architecture check, vitest suite, build).
