# Medical Center admin reconciliation

This audit supersedes previous completion claims. Target: apps/iap-admin only. Reference: insurance-ui/src/routes/_authenticated/medical-center/index.tsx and every mounted dependency.

## Tasks

- A01: Replace raw table with reference presentation of PaginatedDataTable, headers and actions; restore Main wrapper and page content structure. See medical-center-admin-table-parity.md.
- A02: Replace browser history manipulation with Router-owned search adapter, source defaults and filter serialization.
- A03: Restore reference text/facet toolbar, debounce/reset and status subset/order.
- A04: Replace native upload dialog with FileUploader, including automatic upload, progress, file limits, failure retention and pending locking. See medical-center-admin-dialog-parity.md.
- A05: Restore ReadonlyItems/FileViewer in detail dialog, attachment mapping and exact eligibility predicate, empty/error/retry composition.
- A06: Restore typed edit resolver, dirty-only update, DatePicker clear/placeholder, numerical inputs, selected status and mutation sequencing.
- A07: Restore deletion pending/disabled and source confirmation presentation.
- A08: Audit schemas, endpoint placements and query sequencing. Strict request versus source stripping remains a pending user decision; public contract ownership remains api-types.
- A09: Compare locale values against source programmatically and add only mounted shared keys. Target remains Persian-only as established by the application.
- A10: Add contract/service/state tests; run affected tests, lint, typecheck, production bundling and diff checks.

## Initial evidence

Page uses window.history and raw tables; toolbar uses raw selects; detail has only filename instead of FileViewer; upload is a native picker; schema factory callback lacks source TFunction signature; request strict mode differs; enums, endpoint paths, HTTP methods and mutation invalidation match the reference. Previous 3 tests cover only list defaults, required records and query keys, not UI parity.

## Final integrated verification (2026-10-06)

A01–A09 are implemented in iap-admin. A10 checks: 40 focused admin tests passed across Medical Center, files capability, and reference table/filter controls (39 in the combined suite plus the dirty-field edit regression); 2 shared UI export/props tests passed. Scoped lint, api-types/UI typechecks, architecture-boundary checker, production Vite bundling and git diff --check passed. Full admin typecheck remains unsuccessful due exclusively to pre-existing type-only/unused imports in features/outpatient-doc-acceptances/services/outpatient-doc-acceptance-service.ts; it reports no errors in this scope. No changes remain in iap-app.

Locale values were compared programmatically against source fa.json for medicalCenter, common.fileUploader, files.viewer, attachment labels, retry/cancel/select/clear/loading/noResults, dataTable and form update/pending labels; all matched. The target keeps its established Persian-only language configuration. Source-missing keys are not invented.

Source schema stripping was explicitly approved by the user for Medical Center; the scoped exception is recorded in docs/architecture/MEDICAL-CENTER-REFERENCE-CONTRACT.md. Other architectural adaptations are public package imports, feature route adapters, split store/provider ownership and existing reference presentations. Browser pixel comparison and live backend tests remain excluded by the user.

## Verification update

At the user’s explicit request, unrelated uncommitted outpatient-doc-acceptances additions were removed and its existing API contract file restored. Full iap-admin typecheck now passes. git diff --check also passes.

## Historical audit notice

This audit is superseded by MEDICAL-CENTER-FINAL-REAUDIT.md and its table/dialog companion audits.
