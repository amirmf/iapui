# Agent Claim Request Management Parity

## Scope and Intent

Implement `/agent/claim-requests/$claimRequestId/claim-request-management/` in `apps/iap-admin` with exact line-by-line visual, functional, schema, API, and translation parity to reference implementation in `insurance-ui` (`src/routes/agent/claim-requests/$claimRequestId/claim-request-management/index.tsx` and `AgentClaimRequestManagement`). This is a single, stand-alone page without sub-routes in this scope.

## Reference Mapping

| Reference (`insurance-ui`) | Target (`iap-admin`) | Responsibility / Contract |
| --- | --- | --- |
| `src/routes/agent/claim-requests/$claimRequestId/claim-request-management/index.tsx` | `apps/iap-admin/src/app/router/routes/_agent/agent/claim-requests/$claimRequestId.claim-request-management/index.tsx` | Thin route file with `agentClaimRequestManagementQueryOptions` prefetch loader, `crumb: 'claimDetails'`, `pendingComponent: ClaimRequestManagementPanelPending`, `errorComponent: ClaimRequestManagementQueryError` |
| `src/features/agent-claim-requests/pages/agent-claim-request-management.tsx` | `apps/iap-admin/src/features/agent-claim-requests/pages/agent-claim-request-management.tsx` | Page composition, layout wiring, parameter extraction, pending/error branches, section layout |
| `src/features/agent-claim-requests/hooks/use-agent-claim-request-management-data.ts` | `apps/iap-admin/src/features/agent-claim-requests/queries/use-agent-claim-request-management-data.ts` | Query options and hook calling `agentClaimRequestService.getById(claimRequestId)` with queryKey `['agentClaimRequest', claimRequestId]` |
| `src/constants/claim-status-constant.ts` | `apps/iap-admin/src/features/agent-claim-requests/constants/agent-claim-request-constant.ts` & `@features/claim-requests/model/claim-request-status.ts` | Status colors, translation keys, badge/box styling, enum options |
| `src/locales/fa.json` (`claimRequests.*`, `claimDetails`) | `apps/iap-admin/src/shared/i18n/locales/fa/common.json` | Exact Persian translations copied from reference |

## Architecture Decisions

1. **Target Feature Placement**:
   - Following `APPLICATION-ARCHITECTURE.md`, `AgentClaimRequestManagement` page lives in `features/agent-claim-requests/pages/agent-claim-request-management.tsx`.
   - Query definition lives in `features/agent-claim-requests/queries/use-agent-claim-request-management-data.ts`.
   - The route file `routes/_agent/agent/claim-requests/$claimRequestId.claim-request-management/index.tsx` remains thin, importing only public exports.
2. **Import Boundaries & Public API**:
   - `tools/check-architecture.mjs` enforces `feature-public-api-only`.
   - Subcomponents shared with operations claim-request-management (`ClaimRequestLastStatusSection`, `ClaimRequestAssignSection`, `ClaimRequestInfoList`, `ClaimRequestAssessmentItemsSection`, `ClaimRequestDoctorResponses`, `ClaimRequestDuplicatedSection`, `ClaimRequestManagementError`, `ClaimRequestObjectionSection`, `ClaimRequestAttachmentsSection`, `ClaimRequestManagementPrevRequest`, `ClaimRequestDocumentsSection`, `ClaimRequestManagementPanelPending`) are exported through `@features/claim-requests` index barrel so `agent-claim-requests` imports them cleanly.
3. **Small Components & Clean Code**:
   - Single responsibility per component, strict typing inferred from Zod contracts, no `any`, memoized callbacks and values where applicable.
   - Clean UI layout with `@iap/ui` primitives (`Card`, `CardContent`, `Badge`, `Button`, `Separator`).

## Task Index and Status

- [x] `01-query-hook-and-service-contracts.md`: Query options and hook calling `agentClaimRequestService.getById` (Completed)
- [x] `02-constants-and-public-exports.md`: Constants verification and `@features/claim-requests` public barrel exports (Completed)
- [x] `03-page-composition-and-subcomponents.md`: `AgentClaimRequestManagement` page component and layout (Completed)
- [x] `04-route-and-breadcrumbs.md`: Thin TanStack Router route replacement and breadcrumb (Completed)
- [x] `05-tests-and-verification.md`: Unit/integration tests, typecheck, lint, architecture check, build (Completed)
- [x] `06-discrepancy-audit-and-component-parity.md`: Line-by-line component parity matrix and discrepancy audit (Completed)

## Completion Summary

All tasks and discrepancies have been resolved with 100% test pass rate across `agent-claim-requests` (25/25 tests passing) and `panel-routes` (9/9 tests passing), zero TypeScript errors (`tsc -b`), zero ESLint warnings/errors (`pnpm lint`), successful architecture check (`pnpm architecture:check`), and successful production build (`pnpm --filter iap-admin build`).
