# Medical Center Invoices Page

Historical planning document. Final implementation evidence and task status are maintained in [MEDICAL-CENTER-FINAL-REAUDIT.md](MEDICAL-CENTER-FINAL-REAUDIT.md).

## Scope and verified reference

- Target URL: `/medical-center/`
- Reference route: `insurance-ui/src/routes/_authenticated/medical-center/index.tsx`
- Reference page: `insurance-ui/src/features/medical-center/pages/medical-center-invoices-page.tsx`
- The page is a single route with no child page.
- The reference closure was inspected before documenting this task. No behavior or API contract is inferred from names alone.

## Architecture mapping

Keep the route entry thin under `apps/iap-admin/src/app/router/routes/_authenticated/medical-center/index.tsx`. Product behavior belongs under `apps/iap-admin/src/features/medical-center/`; API contracts belong in the public `@iap/api-types` medical-center domain entry point; transport belongs in the feature service using `@iap/api-client`. Reuse `@iap/ui`, `@iap/forms`, shared file capabilities, table primitives, date formatting, and i18n public APIs where their behavior matches the reference. Conditional classes must use `cn` from `@iap/ui`.

## Implementation tasks

### M01 — Route and page composition (P0)

Create the authenticated route for `/medical-center/` and compose `MedicalCenterInvoicesPage`. The page must render the reference sequence: page title/description, create and refresh actions, list error alert with retry, filter toolbar, paginated table, upload dialog, detail dialog, edit dialog, and delete dialog. Preserve loading and empty-state text and refresh disabled/spinning behavior.

### M02 — API contracts and schemas (P0)

Port the verified contracts from `medical-center-invoice-schema.ts`: invoice states `SUBMITTED | EXTRACTING | EXTRACTED | FAILED`; attachment, record, invoice, page response, list request, upload request, and edit schema. Keep optional/nullability, defaults, minimums, nested arrays, and the translated amount validation exactly. Expose request and response Zod v4 schemas from `@iap/api-types` and infer types from them.

### M03 — Invoice service (P0)

Implement the verified endpoints under `/medical-center/invoices`:

- `GET /medical-center/invoices/page-full` with `page`, `size`, optional `sort`, optional `direction`, and flattened string filters.
- `GET /medical-center/invoices/{id}` with URI encoding.
- `POST /medical-center/invoices` as multipart form data with field `file` and upload progress.
- `PUT /medical-center/invoices/{id}` with the complete validated invoice payload.
- `DELETE /medical-center/invoices/{id}`.

Validate outgoing requests and incoming responses at the API boundary.

### M04 — Query hooks and mutation sequencing (P0)

Add list/detail query keys and hooks with the reference `staleTime` and `gcTime` of 30 seconds. Preserve mutation behavior: cache detail on create/update, invalidate list queries after create/update/delete, remove deleted detail cache, and keep dialog confirmation open on mutation failure.

### M05 — State constants (P0)

Create the medical-center constant module in the target constant ownership location. Preserve state order, translation-key map, color classes, and `getMedicalCenterInvoiceStateOptions(t)` output exactly. Review existing target constants for naming/export conventions before adding it.

### M06 — Table columns and toolbar (P0)

Implement `useMedicalCenterInvoiceColumns` with document number, invoice date, total amount, status badge, created-at date-time, and sticky actions. Preserve sorting availability, fallback `-`, state colors/translations, and view/edit/delete action labels and disabled behavior. Implement `MedicalCenterInvoiceToolbar` with one document-number text filter, one single-select state filter, and reset behavior.

### M07 — Dialog store/provider (P0)

Implement the Zustand dialog store with `view | edit | delete`, selected invoice, `openDialog`, `closeDialog`, and `reset`. The provider must reset on unmount. Keep the store under feature context rather than route or model folders.

### M08 — Upload dialog (P0)

Implement the single-file upload dialog with the shared file uploader capability, progress/pending lock, cancel behavior, multipart create mutation, and the verified success toast. Preserve the reference behavior when upload fails and while a file is uploading.

### M09 — Detail dialog (P0)

Implement lazy detail loading when the view dialog opens, loading/error/retry states, the seven verified read-only fields, state translation, record count formatting, and conditional invoice attachment viewer. Preserve attachment eligibility checks and the 85vh/4xl dialog layout.

### M10 — Edit dialog (P0)

Implement the reference form fields, date conversion, dirty-field merge semantics, Zod resolver, detail loading/error/retry states, pending close lock, update mutation, success toast, and reset behavior. Preserve `SUBMITTED` as the default state and non-negative amount validation.

### M11 — Delete dialog (P0)

Implement the shared confirmation dialog with interpolated document number, destructive styling, pending lock, delete mutation, success close sequencing, and error toast.

### M12 — Translations (P0)

Port only the mounted reference keys under `medicalCenter` and required `common` keys. Persian and English values must match the reference locale files exactly, including punctuation, ellipsis, state labels, validation text, and toast messages. Verify locale values programmatically; do not translate or replace with inferred values.

### M13 — Verification (P0)

Add focused contract, request placement, URL encoding, query-key, dialog-store, and visible-state tests. Run affected tests, typecheck, lint, and `git diff --check`. Record whether browser screenshot and live-backend verification were performed separately; passing tests alone does not establish pixel parity.

## Completion criteria

All M01–M13 tasks are implemented against the inspected reference, architecture boundaries are respected, no route file contains business behavior, and verification evidence is recorded. Any target capability missing from the current workspace must be ported minimally from the reference or documented with exact source evidence before claiming parity.

## Current implementation status (2026-10-06)

- **Implemented:** M01–M12, including route/page composition, API contracts, service, queries, constants, table, filters, pagination, sorting, dialog store, upload/detail/edit/delete dialogs, and mounted Persian translations.
- **Completed locally:** generated route-tree registration and broader local reference integration. Browser screenshot and live-backend verification are intentionally omitted per task scope.
- **Verified:** `pnpm --filter @iap/api-types typecheck`, `pnpm --filter iap-admin typecheck`, `pnpm --filter iap-admin test -- --run`, `pnpm --filter iap-admin lint`, `pnpm --filter iap-admin exec vite build`, and `git diff --check` pass.
- **Not claimed:** pixel parity, live-backend behavior, or browser screenshot parity.

## Ownership correction

The Medical Center page belongs to `iap-admin`. The feature, route, locale ownership, and task paths have been moved from the mistakenly used `iap-app` boundary. Shared backend contracts remain in `@iap/api-types`.

### Ownership correction verification

The feature and its tests now reside exclusively in `apps/iap-admin/src/features/medical-center`. The existing admin placeholder route composes the feature public export. No Medical Center references remain in `apps/iap-app`; its package manifest, locale, and route tree are restored. Admin Vite production build, focused feature lint, three feature tests, app typecheck, and diff whitespace checks passed. Earlier parity-completion claims are historical and do not establish full reference parity: the migrated detail dialog still lacks the reference FileViewer composition, and the page still uses custom table controls. These require a separate source-backed parity correction.

## Historical status

Prior completion claims are superseded by MEDICAL-CENTER-ADMIN-RECONCILIATION.md and the new component-level admin audits.
