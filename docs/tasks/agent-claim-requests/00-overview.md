# Agent Claim Requests Page Parity

## Scope and Intent

Implement `/agent/claim-requests/` (index list page) in `apps/iap-admin` with exact visual, functional, schema, API, and translation parity to the reference implementation in `insurance-ui` (`src/routes/agent/claim-requests/index.tsx` and `AgentClaimRequestsPage`). This is a single, stand-alone page without sub-routes in this scope.

## Reference Mapping

| Reference (`insurance-ui`) | Target (`iap-admin`) | Purpose / Responsibility |
| --- | --- | --- |
| `src/routes/agent/claim-requests/index.tsx` | `apps/iap-admin/src/app/router/routes/_agent/agent/claim-requests/index.tsx` | Thin route file delegating to `AgentClaimRequestsPage`, with breadcrumb `claim-agent` |
| `src/features/agent-claim-requests/pages/agent-claim-requests-page.tsx` | `apps/iap-admin/src/features/agent-claim-requests/agent-claim-requests-page.tsx` | Page composition, TanStack Query server-state hook, layout and table wiring |
| `src/features/agent-claim-requests/components/agent-claim-request-columns.tsx` | `apps/iap-admin/src/features/agent-claim-requests/components/agent-claim-request-columns.tsx` | Table column definitions with TwoLineCell, status badges, actions |
| `src/features/agent-claim-requests/components/agent-claim-request-header-actions.tsx` | `apps/iap-admin/src/features/agent-claim-requests/components/agent-claim-request-header-actions.tsx` | Header actions: create link, export excel, refresh query |
| `src/features/agent-claim-requests/components/agent-claim-request-row-actions.tsx` | `apps/iap-admin/src/features/agent-claim-requests/components/agent-claim-request-row-actions.tsx` | Row actions: view details, completion of documents, refresh policy details, delete |
| `src/features/agent-claim-requests/components/agent-claim-request-delete-dialog.tsx` | `apps/iap-admin/src/features/agent-claim-requests/components/agent-claim-request-delete-dialog.tsx` | Permanent delete confirmation dialog backed by `agentClaimRequestService.delete` |
| `src/features/agent-claim-requests/context/claim-request-context.tsx` | `apps/iap-admin/src/features/agent-claim-requests/context/` | Store (`store/agent-claim-request-store.ts`) and Provider (`provider/agent-claim-request-provider.tsx`) |
| `src/features/agent-claim-requests/services/agent-claim-request-service.ts` | `apps/iap-admin/src/features/agent-claim-requests/services/agent-claim-request-service.ts` | Service with `getPage`, `exportPageLiteExcel`, `delete`, `refreshPolicyDetails` |
| `src/features/agent-claim-requests/data/agent-claim-request-service-schema.ts` | `packages/api-types/src/agent-claim-request/index.ts` | Zod v4 request and response contracts |
| `src/constants/claim-status-constant.ts` | `apps/iap-admin/src/features/agent-claim-requests/constants/agent-claim-request-constant.ts` | Status colors, translation keys, and helper options |
| `src/locales/fa.json` (`agent.claimRequests.*`) | `apps/iap-admin/src/shared/i18n/locales/fa/common.json` | Exact Persian translations copied from reference |

## Architecture Decisions

1. **Feature Placement**:
   - Following `APPLICATION-ARCHITECTURE.md`, because this feature owns only its root route with no sibling page journeys, `agent-claim-requests-page.tsx` lives directly in `features/agent-claim-requests/` and its page-exclusive components live in `features/agent-claim-requests/components/`.
   - Client state is split cleanly: Zustand store in `context/store/`, React provider in `context/provider/`.
2. **Contracts**:
   - Backend contracts reside in `@iap/api-types/src/agent-claim-request/` using Zod v4 schemas and inferred TypeScript types.
   - Filter parameter transformation uses `transformApiFilterParams` from `@iap/shared-lib`.
3. **Small Components & Clean Code**:
   - Break down large UI blocks into single-responsibility, performant components.
   - Reuse shared `@iap/ui` primitives, `@shared/tables` (`TwoLineCell`, `TwoLineHeader`, `PaginatedDataTable`, `TableActions`, `TableActionButton` with `presentation='reference'`), and `@iap/dialogs` (`ConfirmDialog`).
4. **Translations**:
   - Exact mirror of `insurance-ui`'s `agent.claimRequests` keys in `fa/common.json`.

## Task Index and Status

- [x] `01-api-contracts-and-service.md`: API schemas in `@iap/api-types` and `agent-claim-request-service.ts` (Completed).
- [x] `02-translations-and-constants.md`: Persian locale additions and status constants (Completed).
- [x] `03-feature-state-and-dialogs.md`: Zustand store, provider, and delete dialog (Completed).
- [x] `04-table-columns-and-actions.md`: Header actions, row actions, and column definitions (Completed).
- [x] `05-page-composition-and-route.md`: `AgentClaimRequestsPage` composition and thin router entry replacement (Completed).
- [x] `06-verification-and-tests.md`: Unit tests, route integration tests, typecheck, lint, build (Completed).
- [x] `07-reference-parity-audit-and-discrepancies.md`: Comprehensive line-by-line parity audit against `insurance-ui` and discrepancy resolution (Completed).

## Completion Summary

All tasks and discrepancies have been resolved with 100% test passing rate (654/654 tests), zero lint errors/warnings, zero typecheck errors, successful architecture check, and successful production build. Reusable skill `.agents/skills/agent-panel-claim-requests/SKILL.md` has been established for future agent pages.
