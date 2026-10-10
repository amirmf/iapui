# Customer user claim requests parity — implementation and verification tasks

Target: `/customer-user/claim-requests/` in `iap-admin` (under `_customer-user` panel layout).
Reference: `insurance-ui/src/routes/customer-user/claim-requests/index.tsx` and `insurance-ui/src/features/customer-user/pages/customer-user-claim-requests-page.tsx`.
Status: **COMPLETED** (Verified with unit tests, typecheck, lint, architecture check, and production build).

## Task index

1. [Task 01 — page structure reorganization (COMPLETED)](TASK-01-PAGE-STRUCTURE-REORGANIZATION.md)
2. [Task 02 — route adapters, constants, and models (COMPLETED)](TASK-02-ROUTE-ADAPTERS-AND-CONSTANTS.md)
3. [Task 03 — header actions and columns components (COMPLETED)](TASK-03-HEADER-ACTIONS-AND-COLUMNS.md)
4. [Task 04 — page component and route wiring (COMPLETED)](TASK-04-PAGE-COMPONENT-AND-ROUTE-WIRING.md)
5. [Task 05 — test coverage and verification (COMPLETED)](TASK-05-TESTS-AND-VERIFICATION.md)

## Parity scope and component inventory

| Reference component / owner | Target file / owner in iap-admin | Responsibility | Status |
| --- | --- | --- | --- |
| `src/routes/customer-user/claim-requests/index.tsx` | `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/claim-requests/index.tsx` | Thin route definition with `crumb: 'claim'` loader delegating to `CustomerUserClaimRequestsPage` | Verified |
| `src/features/customer-user/pages/customer-user-claim-requests-page.tsx` | `apps/iap-admin/src/features/customer-user/pages/claim-requests/customer-user-claim-requests-page.tsx` | Customer user claim requests page with query synchronization, status filtering, and paginated table | Verified |
| `src/features/customer-user/components/customer-user-claim-request-header-actions.tsx` | `apps/iap-admin/src/features/customer-user/pages/claim-requests/components/customer-user-claim-request-header-actions.tsx` | Excel export button and table refetch action with spinning icon | Verified |
| `src/features/customer-user/components/customer-user-claim-request-columns.tsx` | `apps/iap-admin/src/features/customer-user/pages/claim-requests/components/customer-user-claim-request-columns.tsx` | 10 table columns with two-line layout and status badges | Verified |
| `src/features/customer-user/utils/customer-user-claim-routes.ts` | `apps/iap-admin/src/features/customer-user/pages/claim-requests/utils/customer-user-claim-routes.ts` | Customer user claim requests URL routes | Verified |
| `src/components/data-table/filter/use-sync-query-params-table-filter.ts` | `apps/iap-admin/src/features/customer-user/pages/claim-requests/route-adapters/use-sync-query-params-table-filter.ts` | Table query parameter synchronization hook | Verified |
| `src/constants/claim-status-constant.ts` | `apps/iap-admin/src/features/customer-user/model/customer-user-claim-constant.ts` | Centralized claim and AI status colors, translation keys, and filter constants | Verified |
| `src/features/claim-requests/components/claim-request-data-table-toolbar.tsx` | `@features/claim-requests` (`ClaimRequestDataTableToolbar`) | Reused grouped filter toolbar and quick status tabs | Verified |
| `src/features/claim-requests/services/claim-request-service.ts` | `@features/claim-requests` (`claimRequestService.getPageLite`) | Reused backend service for fetching paginated claim requests | Verified |
