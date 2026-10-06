# Medical Center fresh re-audit

This document supersedes earlier completion claims and records the current admin implementation. Reference route: insurance-ui/src/routes/_authenticated/medical-center/index.tsx. Target route: apps/iap-admin/src/app/router/routes/_authenticated/medical-center/index.tsx.

## Ownership and task split

- R01: Full page/table/filter/router closure re-audit and source-backed fixes, documented in medical-center-table-reaudit.md.
- R02: Full dialog/file/date/control closure re-audit and fixes, documented in medical-center-dialog-reaudit.md.
- R03: Verify API schemas, services, query hooks, state constants and locale parity.
- R04: Integrated verification and stale-document reconciliation.

## Initial R03 evidence

Normalized invoice schema comparison matches reference exactly after equivalent Zod v4 nullish notation and formatting/import ownership. All nested record/attachment fields, optional page content, stripping object behavior, defaults, validations and canonical exports are preserved. Methods/paths and placement are unchanged: GET page-full with flat filters; GET encoded id; multipart POST file; PUT encoded id/full parsed invoice; DELETE encoded id. Query keys, staleTime/gcTime of 30000 and awaited invalidation/cache sequencing match. State colors, option order and state translation maps match source. Mounted locale subtrees were compared programmatically and matched. This host remains Persian-only; no new global language is introduced.

## Completion evidence

- [x] R01: Six verified discrepancies documented and fixed in `medical-center-table-reaudit.md`, including nested table primitives, filter timing, URL transitions and invalid-date formatting.
- [x] R02: Two verified discrepancies documented and fixed in `medical-center-dialog-reaudit.md`; all four dialogs and nested files/control dependencies inspected.
- [x] R03: Source schemas, service methods/paths, constants and mounted Persian locale values verified. Four real QueryClient regression tests cover mutation cache ordering, awaited invalidation, failure and disabled detail fetching without network access.
- [x] R04: Integrated checks completed. 64 admin tests and 16 UI tests passed; seven admin table tests were rerun after the final table changes. Admin, UI and API-types typechecks, scoped lint, architecture check, production Vite build and diff whitespace checks passed. Earlier audit documents are marked historical and link here.

No changes remain under `apps/iap-app`; unrelated outpatient acceptance additions are absent. The build reports its existing large-chunk warning. Browser pixel comparisons and live backend tests remain excluded per user instruction. This evidence verifies source-backed contracts and component behavior, not pixel-identical screenshots. The dialog audit records the date-field display limitation without treating an unverified runtime difference as a reference discrepancy.

During final commit verification, workspace-wide typechecking exposed the shared edit-schema factory's dependency on application-specific i18next augmentation. Its callback now accepts the exact source validation key directly; validation, translated text and schema output are unchanged. This keeps the API contract package independent of either application's locale types.
