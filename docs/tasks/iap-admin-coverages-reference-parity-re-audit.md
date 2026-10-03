# IAP Admin Coverages Reference-Parity Re-Audit

## Scope and source of truth

- Target route: `apps/iap-admin/src/app/router/routes/_authenticated/coverages/index.tsx`
- Target feature closure: `apps/iap-admin/src/features/coverages/**` and the mounted `apps/iap-admin/src/features/coverage-damage-code-appls/**` feature.
- Reference route: `/home/sadegh/Android/project/insurance-ui/src/routes/_authenticated/coverages/index.tsx`
- Reference feature closure: `/home/sadegh/Android/project/insurance-ui/src/features/{coverages,coverage-damage-code-appls}/**`.
- Reference translations and enum constants: `/home/sadegh/Android/project/insurance-ui/src/locales/fa.json` and `/home/sadegh/Android/project/insurance-ui/src/constants/coverage-constant.ts`.

## Audit method

The route, page, dialogs, table columns and toolbar, services, schemas, constants, and mounted mapping section were compared by responsibility. Target-only structure required by `APPLICATION-ARCHITECTURE.md` (a thin route, feature-owned Zustand UI state, shared UI primitives, Zod v4 boundary validation, and URL-owned table state) is an approved adaptation, not a discrepancy, when it preserves source behaviour.

## Verified discrepancies before implementation

| ID | Priority | Source evidence | Current target discrepancy | Completion criterion |
| --- | --- | --- | --- | --- |
| COV-RA-01 | P0 | `coverageService.softDeleteBulk(ids, thruDate?: Date \| string)` serializes `Date` values and is invoked by the delete-method dialog. | The target exposes `softDelete(ids, thruDate?: string)` only; the reference public API name and accepted `Date` input are absent. | Export and use `softDeleteBulk(ids, thruDate?: Date \| string)` with the identical request method, path, body, and ISO query behaviour; cover both date forms in a service test. |
| COV-RA-02 | P0 | Coverage form create/update success invalidates `['coverages']`, which includes the page query key. | The target invalidates `['coverages', 'page']`, which does not prefix-match its actual `['coverages', pagination, filters]` query. The list can remain stale after saving. | Invalidate `['coverages']` after create and update; add a focused mutation/lifecycle assertion where practical. |
| COV-RA-03 | P1 | The page keeps `CoverageDamageCodeApplsSection` inside `flex flex-col gap-4 pb-4`, after the primary table. | The target renders the section outside that wrapper, so the source spacing/flow is not retained. | Render the mapping section inside the source-equivalent outer layout wrapper while retaining target feature ownership. |
| COV-RA-04 | P1 | The reference mapping service provides `delete(id)` and `softDelete(id, thruDate?: Date \| string)` in addition to bulk variants. | The target mapping service omits both verified reference API operations. | Add validated target-contract methods with the exact reference endpoint placement and date serialization, plus request tests. |
| COV-RA-05 | P2 | Reference mapping public closure contains `coverage-damage-code-appl-bulk-delete-dialog.tsx` and `coverage-damage-code-appl-delete-dialog.tsx`. | Corresponding target compatibility components/modules are absent. | Add the minimal source-equivalent compatibility components under the target feature's `ui/` owner without changing the page's method-selection flow. |
| COV-RA-06 | P2 | Reference constant preserves the status order `ACTIVE`, `INACTIVE`, `SUSPENDED`, `PENDING` for coverage-damage-code applications. | Target translation/status maps place `PENDING` before `SUSPENDED`; this changes source-backed option order. | Preserve the reference order in every mapping enum map/options builder. |
| COV-RA-07 | P2 | Reference coverage column cells use the source fallback conventions: group badge for missing type and active badge for missing status, and define the matching multi-value `filterFn`s. | Target renders `'-'` for missing type/status and omits both source column `filterFn`s. | Restore source fallback values and filter functions while using the target table primitive. |
| COV-RA-08 | P2 | The mapping `getPage` API accepts and forwards optional `sort` and `direction` query parameters. | Target mapping `getPage` omits these source-backed public API parameters. | Preserve both optional parameters and their exact query placement, while retaining the target filter serialization contract. |
| COV-RA-09 | P2 | `coverageService.getById(id, { signal })` accepts its cancellation signal as an options object. | Target accepts `signal` directly as its second argument, changing the verified public service contract. | Restore the source-compatible options-object signature and request signal placement. |

## Tasks

- [x] Trace and compare the direct and mounted reference closures.
- [x] Compare source Persian namespaces against the target locale using the existing parity test.
- [x] Implement and test COV-RA-01 and COV-RA-02.
- [x] Implement and test COV-RA-03 through COV-RA-09.
- [x] Run feature tests, typecheck, lint, build, and `git diff --check`; replace every task with verified evidence.

## Deliberate architecture adaptations

- `CoverageProvider` is represented by the feature-local `useCoverageStore`; it owns only UI state and preserves the source dialog/selection lifecycle.
- Target `TableFilterState` and router search state replace the reference query-param hook. `transformApiFilterParams` is retained because the target workspace architecture requires the API transport contract for array filters.
- Target uses `@iap/ui`, `@iap/forms`, and `@shared/tables` primitives rather than duplicating reference-local primitives.
- The target remains Persian-only, as required by `docs/architecture/LOCALIZATION.md`; the existing test asserts the copied source Persian namespaces verbatim.

## Verification evidence

- `pnpm --filter iap-admin test` passed: 45 test files and 103 tests.
- `pnpm --filter iap-admin typecheck` passed.
- `pnpm --filter iap-admin lint` passed.
- `pnpm --filter iap-admin build` passed. Existing non-failing Rollup Zod annotation and chunk-size warnings remain.
- `git diff --check` passed.

## Follow-up comparison (2026-10-03)

- Re-compared the `CoveragesPage` route/page and every direct coverage and mounted mapping component by responsibility.
- Confirmed that the reference and target closures now contain the same component responsibilities and the same source-backed service operations.
- Re-ran the translation-parity test and focused coverage/mapping contract and service tests: 10 tests passed.
- No additional verified discrepancy was found. The remaining import, state-owner, shared-primitive, and URL-state differences are the documented target-architecture adaptations above; they do not change the reference behaviour.
