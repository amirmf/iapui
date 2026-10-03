# CoveragesPage Reference Discrepancies

## Source closure

- Entry: `/home/sadegh/Android/project/insurance-ui/src/features/coverages/pages/coverages-page.tsx`
- Direct files: all `src/features/coverages/{components,context,data,services}` files.
- Mounted dependent closure: `src/features/coverage-damage-code-appls/**` through `CoverageDamageCodeApplsSection`.
- Source translations: `src/locales/{fa,en}.json` `coverages` and `coverageDamageCodeAppls`; source enum map: `src/constants/coverage-constant.ts`.

## Discrepancies

| ID | Priority | Reference evidence | Target discrepancy | Required work |
| --- | --- | --- | --- | --- |
| COV-01 | P0 | `CoveragesPage` mounts `CoverageDamageCodeApplsSection` for the selected coverage. | Resolved: target mounts the feature-owned mapping section with source-backed filters, selection, toolbar, CRUD dialogs, row actions and soft/hard bulk deletion. | Keep mapping contracts and UI tests with the feature. |
| COV-02 | P0 | `coverageService.getPage` calls `GET /coverages/page`; dependent mapping form uses it for searchable coverage options. | Resolved: target exposes `getPage` with the source endpoint, validated page contract, and filter serialization through the workspace transport contract. | Keep the source-backed endpoint covered by service parity tests. |
| COV-03 | P0 | Source coverage schema contains `coverageListSchema`, complete Spring page metadata (`sort`, `pageable`) and ISO datetime validation. | Resolved: response contracts retain `coverageListSchema`, source nullability/ISO validation, and Spring `sort`/`pageable` metadata using Zod v4 `.loose()` response objects. | Keep strict request wrappers and contract fixtures in place. |
| COV-04 | P1 | Page wrapper/table behavior. | Resolved with the target's page composition and equivalent shared table primitives. | Maintain the target architecture boundary. |
| COV-05 | P1 | Query/filter state. | Resolved: target URL state supplies the source endpoint's filters without leaking UI sort controls into `page-full`. | Keep table-state tests. |
| COV-06 | P1 | Selection/delete lifecycle. | Resolved: selected row drives delete; selection is reset on pagination and after dialog close. | Keep lifecycle behavior covered by the feature. |
| COV-07 | P1 | Group coverage search/defaults. | Resolved: searchable group query and edited root-coverage retention match the reference behavior. | Keep query-key coverage. |
| COV-08 | P1 | Form/view/dialog details. | Resolved using the target form/dialog primitives while retaining the source interactions and styles. | Keep accessibility semantics from shared primitives. |
| COV-09 | P2 | Table column presentation. | Resolved with the target table header primitive and source sizing/fallback/action behavior. | No reference-only primitive was duplicated. |
| COV-10 | P2 | Toolbar filters. | Resolved with the target controlled filter adapter and source filter set/classes. | Keep URL-state ownership in the feature. |
| COV-11 | P2 | Compatibility dialog files. | Resolved: bulk delete and empty delete compatibility modules are present. | Keep source compatibility modules local to the page. |
| COV-12 | P2 | Enum constants. | Resolved: source enum translation maps/options/colors are restored with target-compatible aliases. | Keep enum keys type-safe. |
| COV-13 | P2 | Source uses exact `coverages` and `coverageDamageCodeAppls` Persian/English locale values. | Resolved for the target's Persian-only locale architecture: both namespaces now equal the source Persian resources verbatim, guarded by a reference-file parity test. | Do not add an English resource unless the target locale architecture is explicitly expanded. |

## Tasks

- [x] Compare `CoveragesPage`, all direct coverage components, schema/service/constants, source translations, and the mounted mapping closure.
- [x] Port COV-02/COV-03 API and schemas before UI.
- [x] Port COV-01 dependent mapping feature and translations.
- [x] Reconcile COV-04 through COV-12 page/component behavior.
- [x] Add focused coverage and mapping contract/state/visible-behavior tests.
- [x] Copy and lock COV-13 Persian translations against the reference resources.
- [x] Run typecheck, lint, test, build, `git diff --check`; replace each task status with evidence.

## Verification

- `pnpm --filter iap-admin typecheck` passed.
- `pnpm --filter iap-admin lint` passed.
- `pnpm --filter iap-admin test` passed: 45 files, 99 tests.
- `pnpm --filter iap-admin build` passed. Existing Rollup Zod-annotation and chunk-size warnings remain non-failing.
- `git diff --check` passed.
