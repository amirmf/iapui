# Customer user dashboard parity — implementation and verification tasks

Target: `/customer-user/` in `iap-admin` (under `_customer-user` panel layout).
Reference: `insurance-ui/src/routes/customer-user/index.tsx` and `insurance-ui/src/features/customer-user/pages/customer-user-dashboard-page.tsx`.

## Task index

1. [Task 01 — page component parity](TASK-01-PAGE-COMPONENT.md)
2. [Task 02 — feature public API](TASK-02-FEATURE-PUBLIC-API.md)
3. [Task 03 — route wiring](TASK-03-ROUTE-WIRING.md)
4. [Task 04 — test coverage and verification](TASK-04-TESTS-AND-VERIFICATION.md)

## Parity scope and component inventory

| Reference component / owner | Target file / owner in iap-admin | Responsibility |
| --- | --- | --- |
| `src/routes/customer-user/index.tsx` | `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/index.tsx` | Thin route definition with `crumb: 'dashboard'` loader replacing placeholder |
| `src/features/customer-user/pages/customer-user-dashboard-page.tsx` | `apps/iap-admin/src/features/customer-user/components/customer-user-dashboard-page.tsx` | Customer user dashboard page with local `isReportVisible` toggle and 4 reporting tabs |
| `src/features/dashboard/components/report-count-by-assignee-summary-table.tsx` | `@features/dashboard` | Reused: count by assignee summary pivot table |
| `src/features/dashboard/components/report-count-by-assignee-table.tsx` | `@features/dashboard` | Reused: count by assignee detail pivot table |
| `src/features/dashboard/components/report-sum-by-assignee-table.tsx` | `@features/dashboard` | Reused: sum by assignee pivot table |
| `src/features/dashboard/components/report-distribution-by-status-table.tsx` | `@features/dashboard` | Reused: status distribution pivot table |
| `src/constants/claim-status-constant.ts` | `@features/claim-requests` (`model/claim-request-status.ts`) | Reused: centralized claim status translations |
