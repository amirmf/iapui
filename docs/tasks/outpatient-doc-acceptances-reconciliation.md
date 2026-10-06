# Outpatient document acceptance source reconciliation

## Status

Source-derived implementation integrated. Previous completion claims are
superseded by this audit and its verification record.
Live-backend and pixel-perfect verification are out of scope; source-backed
functional parity, request mapping, schemas, translations, and tests remain required.

## Evidence and tasks

- [x] Contracts/service: replace abbreviated/invented form schemas and payloads
  with the full reference schema and numeric/string/boolean mapping, exact
  nullability, recursive responses, 404 handling, and endpoint contracts.
- [x] Acceptance dialogs: replace single-input adapters, hardcoded titles,
  generic toast keys, missing edit flow, and incorrect generation/send payloads
  with each reference component's complete fields and lifecycle.
- [x] Nested dialogs: replace invented claim-code field, empty issuance form,
  truncated Object.entries details, exId-based lookup requests, and null
  damage-case table/form/view exports with the complete reference components.
- [x] Page: restore reference action order, super-admin bulk-delete permission,
  actual sync mutation and pending feedback, selected-row bulk-delete inputs,
  delayed selection clearing, and all nested mounts. Remove unrequested default
  exId sorting and previous-data behavior absent in the source page.
- [x] Columns/actions: replace report-only columns/download actions with all nine
  reference columns, status/ws badges, terminate action, and exact dropdown menu.
- [x] Route filters: admit all mounted toolbar fields, preserve source defaults
  (page size 40, empty sort), and verify filter serialization/reset behavior.
- [x] Localization/constants: compare exact source values/order and all mounted
  keys, preserve source-absent keys/fallbacks, remove invented visible text.
- [x] Verification: focused contract, invalid schema, form field, pending/failure,
  selection, and orchestration tests; typecheck, lint and diff checks.

## Source ownership

Reference root: `/home/sadegh/Android/project/insurance-ui`.
Start: `src/routes/_authenticated/outpatient-doc-acceptances/index.tsx` and
`src/features/outpatient-doc-acceptances/pages/outpatient-doc-acceptances-page.tsx`.
All 20 components, context, damage-case store, schema, service, status constants,
and mounted shared controls must be traced. Target remains a single-root feature
with a thin route, shared API contracts, and public package imports.

## Verification record

- All 20 reference component filenames are present. Placeholder forms and null
  damage-case exports were replaced by source-derived implementations.
- Acceptance: 24 fields; claim: 28; issuance: 25; damage: 48; source field order,
  names and translated labels retained, split into smaller field groups.
- Full `outpatientDocAcceptances` Persian subtree matches source exactly.
- Page sync now calls the source endpoint; bulk delete is super-admin-only and
  receives selected current-page rows, with source delayed clearing.
- Focused suite: 9 files, 34 tests pass, including rendered form field/default
  tests, confirmation failures staying open, nested mutation lifecycle,
  damage-case action state, schema/request mapping and URL state.
- Admin lint and `git diff --check` pass. Admin and API-types typechecks pass after integration. Architecture check passes.
- These checks cover source/contract/behavior parity only. Live-backend and
  pixel-perfect checks are excluded by user request.

Cross-consumer regression: outpatient + claim-reports, 14 files / 43 tests pass
with `INSURANCE_UI_REFERENCE_PATH` pointing to the verified local reference.
