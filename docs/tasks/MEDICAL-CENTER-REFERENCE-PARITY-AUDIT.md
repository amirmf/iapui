# Medical Center Reference Parity Audit

Historical audit. The later component audit and final completion evidence supersede this snapshot: [MEDICAL-CENTER-FINAL-REAUDIT.md](MEDICAL-CENTER-FINAL-REAUDIT.md).

## Scope

Reference closure: `insurance-ui/src/routes/_authenticated/medical-center/index.tsx`, `src/features/medical-center/pages/medical-center-invoices-page.tsx`, its mounted components, dialog context, schema, service, hooks, constants, and the mounted locale keys. Target closure: `apps/iap-admin/src/app/router/routes/_authenticated/medical-center/index.tsx` and `apps/iap-admin/src/features/medical-center/`.

## Verified discrepancy tasks

### P01 — Page composition parity

Match the reference `MedicalCenterInvoicesPage` composition exactly: provider boundary, title/description block, create state, refresh action, list error retry, toolbar, paginated table, and all four dialogs. Preserve reference request normalization, query-param table state, loading text, empty text, and refresh behavior.

### P02 — Table and toolbar parity

Port the reference table primitives and behavior: `DataTableColumnHeader`, sortable columns, status sorting disabled, sticky actions, action labels/disabled rules, document-number text filter, single-select state filter, reset, and reference class/presentation values. Do not replace filter behavior with an uncontrolled input.

### P03 — Upload dialog parity

Match the reference shared `FileUploader` contract: one file, upload-progress callback, uploading lock, mutation success sequencing, cancel behavior, and source translation keys. Preserve multipart field name `file`.

### P04 — Detail dialog parity

Match lazy detail loading, error/retry, seven read-only fields, state translation, record count formatting, attachment eligibility mapping, separator, and file viewer layout. Copy only reference keys and values.

### P05 — Edit dialog parity

Match the reference form schema, date conversion, dirty-field merge, fields, date picker clear behavior, state select, loading/error/retry, pending close lock, update success sequencing, and reset behavior. Keep the reference schema and inferred types instead of broad `any` types.

### P06 — Delete dialog parity

Use the shared confirmation dialog with the reference prop contract and exact success/error behavior. Keep confirmation open during failure and pending state.

### P07 — Contract and query parity

Compare every schema field, nullability, optionality, response metadata, request defaults, endpoint path, query/body placement, URI encoding, upload progress, query keys, cache timings, invalidation and detail-cache removal against the reference. Preserve architecture boundaries by exposing contracts through `@iap/api-types`.

### P08 — Constants and locale parity

Compare state order, translation-key maps, colors, filter options, and every mounted Persian/English locale key/value programmatically. Record any target-locale limitation explicitly; do not invent fallback wording.

### P09 — Route generation and verification

Regenerate `routeTree.gen.ts` from the literal route path after implementation. Run affected tests, typecheck, lint, and `git diff --check`. Browser screenshot and live-backend verification are optional and excluded from this task.

## Implementation order

P02, P03, P04, P05, P06, P07, and P08 can be implemented independently after audit confirmation. P01 and P09 are integration tasks and must run after those changes are merged.

## Status

Audit completed from both source closures. P07 (contract/query audit) and P08 (constant/locale audit) were corrected: page content optionality/object mode now matches the reference, source-absent locale keys were removed, and the route crumb loader was restored. P01–P06 are now implemented against the audited reference behavior: URL-synced table state, retry/reset/sorting/pagination semantics, action indicators, upload progress locking, detail loading and attachment behavior, dirty-field edit merge, and the shared confirmation contract. Local parity checks pass. Browser screenshot and live-backend verification remain intentionally out of scope.

## Ownership correction

The Medical Center page belongs to `iap-admin`. The feature, route, locale ownership, and task paths have been moved from the mistakenly used `iap-app` boundary. Shared backend contracts remain in `@iap/api-types`.

### Ownership correction verification

The feature and its tests now reside exclusively in `apps/iap-admin/src/features/medical-center`. The existing admin placeholder route composes the feature public export. No Medical Center references remain in `apps/iap-app`; its package manifest, locale, and route tree are restored. Admin Vite production build, focused feature lint, three feature tests, app typecheck, and diff whitespace checks passed. Earlier parity-completion claims are historical and do not establish full reference parity: the migrated detail dialog still lacks the reference FileViewer composition, and the page still uses custom table controls. These require a separate source-backed parity correction.

## Historical status

Prior completion claims are superseded by MEDICAL-CENTER-ADMIN-RECONCILIATION.md and the new component-level admin audits.
