# Claim Reports reference re-audit v2

## Scope and source closure

- Target route: `apps/iap-admin/src/app/router/routes/_authenticated/claim-reports/index.tsx`
- Target page and direct components:
  - `apps/iap-admin/src/features/claim-reports/claim-reports-page.tsx`
  - `apps/iap-admin/src/features/claim-reports/components/claim-report-columns.tsx`
  - `apps/iap-admin/src/features/claim-reports/components/claim-report-data-table-toolbar.tsx`
  - `apps/iap-admin/src/features/claim-reports/components/claim-report-row-actions.tsx`
- Reference page and direct components:
  - `insurance-ui/src/routes/_authenticated/claim-reports/index.tsx`
  - `insurance-ui/src/features/claim-reports/pages/claim-reports-page.tsx`
  - `insurance-ui/src/features/claim-reports/components/claim-report-columns.tsx`
  - `insurance-ui/src/features/claim-reports/components/claim-report-data-table-toolbar.tsx`
  - `insurance-ui/src/features/claim-reports/components/claim-report-row-actions.tsx`
- Supporting reference closure: status constants, the three mounted service
  methods, response schemas, and the `claimReports` plus outpatient-status
  Persian locale subtrees.

## Findings and implementation tasks

| Priority | Status | Finding | Required action | Reference evidence |
| --- | --- | --- | --- | --- |
| P0 | Complete | The target writes `pageSize` and `sortDirection` URL keys; the reference writes `size` and `direction`. The target route schema also rejects the reference keys. | Added a Claim Reports URL-state adapter that preserves `page`, `size`, `sort`, and `direction`; updated the route search schema and table-filter control-key handling. | `use-sync-query-params-table-filter.ts` in the reference, lines 13-16 and 40-93. |
| P0 | Complete | The target page-service contract redundantly declares `sort` and `direction` at the request root, while the reference passes them in `filters`; the shared target page-filter contract already owns them there. | Removed the duplicated root fields and serialize only validated filters after `page` and `size`. | Reference service `getPage`, lines 228-244. |
| P1 | Complete | Page composition, direct component names, column content/order, toolbar controls, action endpoints/labels, status constants, and Persian strings are behaviorally equivalent. | Keep as-is; retain only target architecture adaptations. | Referenced page/component closure and locale comparison. |
| P1 | Complete | `ClaimReportsSurface` is a `section`, not the reference `Main` component. | Retain intentionally: the target authenticated shell already owns `main#main-content`, so a nested landmark would be invalid. | Target authenticated layout and architecture guidance. |
| P1 | Complete | The target faceted filter uses `placeholder` where the reference primitive accepts `title`. | Retain as a shared-primitive API adaptation: both render the same translated status control, and the target primitive has no `title` property. | Reference toolbar and target filter type. |
| P1 | Complete | Target API response schemas use Zod v4 `.nullish()` where the reference chains nullable and optional fields. | Retain as required target architecture convention; accepted values are equivalent. | Architecture API-contract rules and reference response schema. |

## Completion criteria

- The page accepts and emits the exact reference URL controls: `page`, `size`,
  `sort`, and `direction`.
- The list request, exports, enum values, nested response contract, and Persian
  values remain source-backed and parity-tested.
- No direct component is renamed or moved outside the target single-root-route
  feature architecture.
- Focused tests, target typecheck, lint, and `git diff --check` pass.

## Verification record

Completed on 2026-10-03:

- `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui pnpm --filter iap-admin exec vitest run src/features/claim-reports --reporter=verbose` — 5 files and 9 tests passed.
- `pnpm --filter @iap/api-types typecheck` — passed.
- `pnpm --filter iap-admin typecheck` — passed.
- `pnpm --filter iap-admin lint` — passed.
- `git diff --check` — passed.
