# Claim Reports parity audit

## Compared source closure

- `insurance-ui/src/routes/_authenticated/claim-reports/index.tsx`
- `insurance-ui/src/features/claim-reports/pages/claim-reports-page.tsx`
- `insurance-ui/src/features/claim-reports/components/claim-report-columns.tsx`
- `insurance-ui/src/features/claim-reports/components/claim-report-data-table-toolbar.tsx`
- `insurance-ui/src/features/claim-reports/components/claim-report-row-actions.tsx`
- `insurance-ui/src/features/outpatient-doc-acceptances/data/outpatient-doc-acceptance-schema.ts`
  (the response-contract closure used by Claim Reports)
- `insurance-ui/src/features/outpatient-doc-acceptances/services/outpatient-doc-acceptance-service.ts`
  (the `getPage`, `exportReport`, and `exportPdfReport` methods used by Claim
  Reports)
- `insurance-ui/src/constants/outpatient-doc-acceptance-status-constant.ts`
- `insurance-ui/src/locales/fa.json` (`claimReports` and the mounted
  `outpatientDocAcceptances.status` keys)

## Excluded source

The reference's create/update/generate/claim/issuance/damage-case API methods
and their related translations are not mounted by Claim Reports. They are not
ported by this task. This is intentionally a page-closure parity audit, not an
outpatient-document-acceptance feature migration.

## Discrepancies and work items

| Priority | Status | Target discrepancy | Verified reference behavior |
| --- | --- | --- | --- |
| P0 | Complete | `@iap/api-types` validates only a partial outpatient document acceptance response. | The mounted response schema includes full `dmgCase`, `issuance`, `outpatientClaim`, acceptance, `sort`, `pageable`, and page contracts. |
| P0 | Complete | Page list request differs in shape: the target derives sort state independently rather than preserving the reference filter contract and `getPage` API shape. | `getPage({ page, size, filters, signal })` applies `exId desc` only when the filter sort is absent. |
| P0 | Complete | The status constants omit the web-service enum, colors, translation keys, and option helpers; CSS token ordering differs. | The constant module exposes both acceptance and web-service status maps and helpers exactly as listed in the reference. |
| P0 | Complete | The page's table and header composition differs from the reference: missing `Main`-equivalent boundary, header wrapper structure, refresh icon/component variant, and explicit `manualFiltering`. | The reference uses the page layout boundary, a wrapped heading/actions structure, `IconRefresh`, and explicit manual filtering. |
| P0 | Complete | The columns differ in implementation and output details: the target omits the status cell wrapper, uses a different actions column declaration, and has different class-token ordering. | The reference declares the exact seven columns, status wrapper, `enableSorting: false` actions column, and action metadata. |
| P0 | Complete | The row actions use a different icon set and omit the reference Excel `success` variant and derived encoded `claimRequestsHref`. | The reference uses Tabler XLS/PDF/external icons, `success`/`destructive` variants, and a query-string link derived with `encodeURIComponent`. |
| P0 | Complete | The toolbar uses a target-only placeholder adaptation rather than preserving the reference constant/helper structure; class-token order also differs. | The reference keeps the named text configuration, memoised filter arrays, status options helper, and its original class values. |
| P0 | Complete | Seven static keys in `claimReports` are absent from the target locale. | Missing keys: `columns.opUnitId`, `columns.outpatientClaim.status`, `columns.inqueryStatusId`, `filters.opUnitId`, `filters.outpatientClaim.exId`, `filters.outpatientClaim.status`, `messages.excelDownloadFailed`. Existing copied values were programmatically equal. |
| P1 | Complete | Current tests cover URL shape and endpoints but do not prove the full response contract, source locale subtree, default sort, or row-action visual contract. | Add focused schema, service, translation, and component contract tests. |
| P1 | Complete | Documentation describes the prior partial implementation as complete. | Supersede that claim only after all rows here are verified. |

## Completion criteria

- The mounted UI, API calls, default sort, schemas, constants, and Persian
  locale values are source-backed and parity-tested.
- Target-only architectural adaptations are limited to package ownership,
  aliases, and equivalent shared primitives; every adaptation is documented.
- Focused tests, typecheck, lint, and `git diff --check` pass.

## Follow-up: component naming parity

| Priority | Status | Work item | Reference name |
| --- | --- | --- | --- |
| P1 | Complete | Rename the target toolbar file, component, and consuming import while retaining its page-exclusive `ui/` ownership. | `ClaimReportDataTableToolbar` |
| P1 | Complete | Move the single-root-route page to the feature root and its page-exclusive components to `components/`; do not introduce `pages/index/`. | Application architecture single-root-route exception |

## Verification record

Completed on 2026-10-03:

- Target-only structural adaptations are documented and deliberately limited to
  the target aliases, the route-search adapter, and `ClaimReportsSurface`.
  `ClaimReportsSurface` is a semantic `section` rather than a nested `main`,
  because the target authenticated layout already owns `main#main-content`.
- Added the source-backed `success` visual variant to `@iap/ui` so the reference
  Excel action retains its semantic appearance.
- `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui pnpm --filter iap-admin exec vitest run src/features/claim-reports --reporter=verbose` — 4 files, 7 tests passed.
- `pnpm --filter @iap/api-types typecheck` — passed.
- `pnpm --filter iap-admin typecheck` — passed.
- `pnpm --filter iap-admin lint` — passed.
- `git diff --check` — passed.
