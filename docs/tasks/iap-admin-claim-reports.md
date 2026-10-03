# iap-admin Claim Reports parity

## Scope

- Target route: `apps/iap-admin/src/app/router/routes/_authenticated/claim-reports/index.tsx`
- Reference route: `insurance-ui/src/routes/_authenticated/claim-reports/index.tsx`
- Reference page: `insurance-ui/src/features/claim-reports/pages/claim-reports-page.tsx`
- Reference component closure: `claim-report-columns.tsx`,
  `claim-report-data-table-toolbar.tsx`, and `claim-report-row-actions.tsx`.

## Source-backed requirements

- Render the claim-reports header, refresh action, URL-synchronised filters,
  server-paginated sortable table, status badges, Excel/PDF actions, and the
  new-tab claim-request link exactly as in the reference.
- Preserve the source API endpoints, query parameter names, default sort
  (`exId desc`), response schemas, enum values, and Persian locale values.
- Keep application boundaries: a thin route, feature-owned page/UI/service,
  shared `@iap/api-types` contracts, and `@shared/tables` primitives.

## Work items

| Priority | Status | Work item | Evidence / source |
| --- | --- | --- | --- |
| P0 | Complete | Add the outpatient document acceptance request/response and pagination schemas to `@iap/api-types`, including the status enum. | `insurance-ui/src/features/outpatient-doc-acceptances/data/outpatient-doc-acceptance-schema.ts` |
| P0 | Complete | Add the feature service for list, Excel export, and PDF export; validate all request and response boundaries. | `insurance-ui/src/features/outpatient-doc-acceptances/services/outpatient-doc-acceptance-service.ts` |
| P0 | Complete | Add the enum translation-key and badge-color constants used by this page. | `insurance-ui/src/constants/outpatient-doc-acceptance-status-constant.ts` |
| P0 | Complete | Implement small page-specific components: columns, filters toolbar, and row actions. | Reference claim-reports component closure |
| P0 | Complete | Implement the page, typed route search handling, query state, default sorting, and thin route composition. | Reference page and target `@shared/tables` README |
| P0 | Complete | Add only the used Persian locale keys and update i18n typing if required. | `insurance-ui/src/locales/fa.json` `claimReports` |
| P1 | Complete | Add focused contract/service, URL state, and visible-page behavior tests. | Reference-page parity verification requirements |
| P1 | Complete | Run the affected tests, typecheck, lint, and `git diff --check`; then update this checklist with evidence. | Repository scripts |

## Missing target capabilities before this task

The target already supplies the necessary reusable table, filter, action-button,
badge, button, date-formatting, toast, and file-download dependencies. The
following page-owned capabilities were absent and are included in this task:

- `@iap/api-types` outpatient document acceptance contracts;
- the `claim-reports` feature and its backend service;
- outpatient document acceptance status constants;
- claim-report columns, filter toolbar, row actions, and page composition;
- the `claimReports` Persian locale subtree.

## Completion criteria

- `/claim-reports/` is no longer a placeholder and matches the verified
  reference behavior.
- All page API inputs and responses are Zod-validated at the boundary.
- The route remains a composition boundary and no cross-feature internal import
  is introduced.
- Verification commands pass and their results are recorded below.

## Verification record

Completed on 2026-10-03:

- `pnpm --filter iap-admin exec vitest run src/features/claim-reports --reporter=verbose` — 2 files, 4 tests passed.
- `pnpm --filter @iap/api-types typecheck` — passed.
- `pnpm --filter iap-admin typecheck` — passed.
- `pnpm --filter iap-admin lint` — passed.
- `git diff --check` — passed.

The full admin test suite was also run with
`INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui`; this
provides the source locale needed by pre-existing parity tests.
