# Dashboard page parity — implementation and verification tasks

Target: the authenticated `/` (Dashboard) page in `iap-admin`.
Reference: `insurance-ui/src/routes/_authenticated/index.tsx` and `insurance-ui/src/features/dashboard/`.

## Task index

1. [Task 01 — contracts and service parity](TASK-01-CONTRACTS-AND-SERVICE.md)
2. [Task 02 — constants and localization parity](TASK-02-CONSTANTS-AND-LOCALIZATION.md)
3. [Task 03 — feature context store](TASK-03-FEATURE-STORE.md)
4. [Task 04 — report table header and toolbar](TASK-04-HEADER-AND-TOOLBAR.md)
5. [Task 05 — individual report tables parity](TASK-05-REPORT-TABLES.md)
6. [Task 06 — root dashboard page and route parity](TASK-06-PAGE-AND-ROUTE.md)
7. [Task 07 — test coverage and verification](TASK-07-VERIFICATION.md)

## Parity scope and component inventory

| Reference component / owner | Target file / owner in iap-admin | Responsibility |
| --- | --- | --- |
| `src/routes/_authenticated/index.tsx` | `apps/iap-admin/src/app/router/routes/_authenticated/index.tsx` | Thin route definition with `crumb: 'dashboard'` loader |
| `src/features/dashboard/index.tsx` | `apps/iap-admin/src/features/dashboard/components/dashboard-page.tsx` | Dashboard root page with `useShowReport` toggle and 5 tab contents |
| `src/features/dashboard/context/report-show-report.ts` | `apps/iap-admin/src/features/dashboard/context/store/report-show-report-store.ts` | Zustand store for `isShowReport` toggle |
| `src/features/dashboard/services/dashboard-service.ts` | `apps/iap-admin/src/features/dashboard/services/dashboard-service.ts` | 6 reporting endpoints with Zod v4 validation and query transform |
| `src/features/dashboard/data/dashboard-report-schema.ts` | `packages/api-types/src/dashboard/index.ts` | Shared request & response Zod v4 contracts |
| `src/features/dashboard/components/dashboard-report-table-header.tsx` | `apps/iap-admin/src/features/dashboard/components/dashboard-report-table-header.tsx` | Refresh action button with spinner state |
| `src/features/dashboard/components/dashboard-pivot-table-toolbar.tsx` | `apps/iap-admin/src/features/dashboard/components/dashboard-pivot-table-toolbar.tsx` | Grouped filter toolbar (5 filter groups, doc-types, status, dates, financial) |
| `src/features/dashboard/components/report-count-by-assignee-summary-table.tsx` | `apps/iap-admin/src/features/dashboard/components/report-count-by-assignee-summary-table.tsx` | Count by assignee summary pivot table (approved translation override) |
| `src/features/dashboard/components/report-count-by-assignee-table.tsx` | `apps/iap-admin/src/features/dashboard/components/report-count-by-assignee-table.tsx` | Count by assignee detail pivot table |
| `src/features/dashboard/components/report-sum-by-assignee-table.tsx` | `apps/iap-admin/src/features/dashboard/components/report-sum-by-assignee-table.tsx` | Amount sum by assignee pivot table |
| `src/features/dashboard/components/report-distribution-by-status-table.tsx` | `apps/iap-admin/src/features/dashboard/components/report-distribution-by-status-table.tsx` | Status distribution pivot table |
| `src/features/dashboard/utils/report-distribution-by-status.ts` | `apps/iap-admin/src/features/dashboard/utils/report-distribution-by-status.ts` | Status distribution pivot data mapper |
| `src/features/dashboard/components/report-agreements-without-main-assessment-user-table.tsx` | `apps/iap-admin/src/features/dashboard/components/report-agreements-without-main-assessment-user-table.tsx` | Simple data table for agreements without main assessor |
| `src/constants/claim-status-constant.ts` | `@features/claim-requests` (`model/claim-request-status.ts`) | Centralized claim status translation keys and option generator |
