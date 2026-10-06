# Medical Center admin page and table parity

Reference: `insurance-ui/src/features/medical-center/pages/medical-center-invoices-page.tsx`, `components/medical-center-invoice-columns.tsx`, `components/medical-center-invoice-toolbar.tsx`, and `components/data-table/filter/use-sync-query-params-table-filter.ts`.
Target: `apps/iap-admin/src/features/medical-center`.

## Tasks

- [x] T01: Replace handwritten main/table/pagination with Main and reference PaginatedDataTable. Restore heading, wrappers, refresh spinner, error retry translation and page-size/total-count controls.
- [x] T02: Replace manual browser history state with feature-owned router adapter. Restore one-based URL page, size default 40, lowercase URL sorting and uppercase API direction, scalar-only API filters. Keep sorting page-preserving as reference; shared filter transitions retain current accepted page-reset behavior.
- [x] T03: Restore DataTableColumnHeader menus, reference Badge, tooltip action primitives, disabled actions when IDs are missing, sticky actions column and exact date/amount fallbacks.
- [x] T04: Restore TableFilterQueryParams, source document-number wrapper dimensions, single-select faceted state control, reset visibility and reference debounce.
- [ ] T05: Verify route-search/request mapping with focused tests, lint and typecheck. Browser and real-backend verification are excluded by user instruction.

No API/schema/locale ownership changes are made by these tasks. Public shared primitives adapt reference dependencies to current architecture.

## Evidence

The three route-adapter tests and seven shared reference table/filter tests passed (10 total). Scoped ESLint passed, and `git diff --check` passed. Full admin typecheck initially reported the source-backed `common.retry` missing target locale key (resolved by the integration owner), concurrently ported files-module errors, and existing outpatient service errors. Final integrated typecheck remains the integration owner’s verification task. Date formatting now forwards host language and disables ISO normalization to match source timezone handling. Source filter defaults use `resetPageToFirst` and 10 visible controls; reset retains source clearing of all search parameters.

## Integrated completion evidence

See MEDICAL-CENTER-ADMIN-RECONCILIATION.md for final verification, approved contract precedence and the unrelated full-admin typecheck limitation. No UI/browser pixel parity is claimed from tests.

## Verification update

At the user’s explicit request, unrelated uncommitted outpatient-doc-acceptances additions were removed and its existing API contract file restored. Full iap-admin typecheck now passes. git diff --check also passes.

## Historical audit notice

This audit is superseded by MEDICAL-CENTER-FINAL-REAUDIT.md and its table/dialog companion audits.
