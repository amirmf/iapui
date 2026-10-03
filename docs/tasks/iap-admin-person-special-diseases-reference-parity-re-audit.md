# IAP Admin Person Special Diseases: Reference Parity Re-Audit

## Scope and evidence

- Target: `apps/iap-admin/src/features/person-special-diseases/**`
- Target route: `apps/iap-admin/src/app/router/routes/_authenticated/person-special-diseases/index.tsx`
- Reference: `/home/sadegh/Android/project/insurance-ui/src/features/person-special-diseases/**`
- Reference route: `/home/sadegh/Android/project/insurance-ui/src/routes/_authenticated/person-special-diseases/index.tsx`
- Method: component-by-component comparison of mounted page closure, request/service schemas, enum mapping, and Persian locale object.

## Verified parity already present

- Persian `personSpecialDiseases` object is JSON-equivalent to the reference locale object.
- Enum values, colors, translation keys, response schemas, form validation messages, endpoint paths, HTTP methods, request body placement, optional `thruDate`, and response parsing match the reference. Target-only strict request schemas remain required by target architecture.
- `PersonSpecialDiseaseColumns`, `PersonSpecialDiseaseFormDialog`, `PersonSpecialDiseaseDeleteDialog`, and `PersonSpecialDiseaseBulkDeleteDialog` retain their reference component names and source-backed data behavior.

## Discrepancy tasks

### P1 — Restore reference page lifecycle and table interaction

- [x] Place the direct-route page at the feature root and its page-exclusive components under `features/person-special-diseases/components/`, matching the established direct-page feature convention. Preserve all reference component names and public feature exports.
- [x] Reset feature dialog/current-row/selection state when `PersonSpecialDiseasesPage` unmounts. The reference provider performs this cleanup; target Zustand state currently survives route leave/return.
- [x] Remove target-only sortable table behavior and route `sort`/`direction` state. The reference page neither enables nor controls sorting.
- [x] Preserve arbitrary non-pagination URL filters instead of rejecting every filter except `nationalCode`. The reference query adapter preserves all filter keys.
- [x] Restore toolbar order and semantics: Refresh outline, destructive Bulk Delete, Create.
- [x] Remove target-only `max-h-60` table cap.

### P1 — Restore reference row actions

- [x] Replace the target `MoreHorizontal` dropdown with the two immediately visible reference-equivalent edit/delete action buttons and action-column width (`w-20 max-w-20`). Keep target shared table primitives where they provide the same visible/accessibility behavior.

### P2 — Restore form and user-selection behavior

- [x] Close/reset the form immediately after a successful create/update, then await the refetch, matching reference mutation sequencing.
- [x] Make `PersonSpecialDiseaseUserSearchSelect` use the reference lookup behavior when the selected value is absent from search results. Do not retain the target-only `GET /auth/users?textFilter=<value>` substitution without reference evidence.
- [x] Remove target-only required markers and pending-control/close disabling from the form where they change source UI/interactions.

### P2 — Restore deletion dialog UX/cache behavior

- [x] Make bulk deletion retain reference success sequencing: refetch, clear selection, invalidate `person-special-diseases`, show success feedback, and reset dialog stage after its reference delay where target primitives allow it.
- [x] Align single-delete presentation with the target equivalent of the reference destructive confirmation appearance; preserve reference cleanup timing.

### P3 — Restore remaining visual details

- [x] Restore blank national-code cells rather than target-only `-` fallback.
- [x] Align page/header layout with the reference where target app-shell ownership does not require a difference.
- [x] Use the same source refresh translation key (`claimRequests.refresh`) as the reference; the current value happens to match but the source key differs.

## Completion criteria

- No P1/P2/P3 discrepancy remains unless a target architecture primitive makes exact behavior impossible and the exception is recorded with source evidence.
- API/schema/localization comparisons remain source-backed; no inferred endpoint or translation is added.
- Focused parity tests, complete iap-admin tests with `INSURANCE_UI_REFERENCE_PATH`, typecheck, lint, build, and `git diff --check` pass.

## Verification evidence

- `pnpm --filter iap-admin exec vitest run src/features/person-special-diseases` — 6 files and 12 tests passed after the final direct-route feature-structure alignment.
- `pnpm --filter iap-admin typecheck` — passed after the final direct-route feature-structure alignment.
- `pnpm --filter iap-admin lint` — passed after the final direct-route feature-structure alignment.
- `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui pnpm --filter iap-admin test` — 66 files and 144 tests passed.
- `pnpm --filter iap-admin build` — passed. Rollup reported pre-existing Zod annotation and bundle-size warnings only.
- `git diff --check` — passed.

## Reuse assessment

The existing repository-local `reference-page-parity` skill already covers the repeatable workflow for comparing a local reference page, documenting discrepancies, porting source-backed API/schema/localization behavior, and verifying parity. No new skill or generic document is needed for this feature.
