# IAP Admin Person Special Diseases: Reference Parity

## Scope

- Target route: `apps/iap-admin/src/app/router/routes/_authenticated/person-special-diseases/index.tsx`
- Reference route: `/home/sadegh/Android/project/insurance-ui/src/routes/_authenticated/person-special-diseases/index.tsx`
- Reference owner: `/home/sadegh/Android/project/insurance-ui/src/features/person-special-diseases/**`
- Goal: port the verified `/person-special-diseases/` list, create, edit, individual delete, bulk soft/hard delete, selection, refresh, and validation behavior into the iap-admin architecture.

## Verified reference closure

- Page and lifecycle state: `pages/person-special-diseases-page.tsx`, `context/person-special-disease-context.tsx`.
- API/schema: `data/person-special-disease-schema.ts`, `services/person-special-disease-service.ts`.
- UI: table columns, row actions, form dialog, searchable user selector, single-delete dialog, and bulk delete-method dialog.
- Enum mapping: `src/constants/person-special-diseases-constant.ts` supplies labels and badge colors for all five enum values.
- Locales: only the mounted closure's `personSpecialDiseases` keys from the reference Persian locale are in scope.

## Existing target capabilities

- `@iap/api-types` already has the source-backed person-special-disease, insured-person, page, enum, and strict request schemas.
- `@modules/person-special-diseases` already validates every source-backed endpoint at the transport boundary, including page, CRUD, soft/hard bulk delete, and insured-person lookup.
- `apps/iap-admin/src/shared/i18n/locales/fa/common.json` already contains the exact required Persian `personSpecialDiseases` values.
- `@shared/tables`, `@iap/forms`, `@iap/dialogs`, and `@iap/ui` provide equivalent controlled table, form, confirmation, deletion, dialog, badge, and action primitives.

## Missing target capability list

1. Feature owner and thin public export for `/person-special-diseases/`; the route currently renders `PlaceholderPage`.
2. Typed route-search/table state for server pagination and filters.
3. Feature-local Zustand dialog/selection state, page query, controlled table composition, columns, row actions, and the create/edit/delete/bulk-delete components.
4. A source-equivalent searchable user selector using the target's existing user-account query capability.
5. A shared owner for enum labels and badge styles. The existing `user-account/constants/special-disease-options.ts` works functionally, but is feature-private while both user-account and this page need it. It should move to the reusable `person-special-diseases` module public API; consumers must not import another feature's internals.

## Component names retained from the reference

- `PersonSpecialDiseasesPage`
- `PersonSpecialDiseaseFormDialog`
- `PersonSpecialDiseaseDeleteDialog`
- `PersonSpecialDiseaseBulkDeleteDialog`
- `PersonSpecialDiseaseRowActions`
- `PersonSpecialDiseaseUserSearchSelect`
- `usePersonSpecialDiseaseColumns`

The target file paths follow iap-admin feature/module ownership; only the paths, not these component names or verified behavior, differ from the reference.

## Tasks

- [x] Read architecture guidance and the relevant project skills; create a main-based isolated worktree.
- [x] Trace the reference component closure and compare it with target services, schemas, translations, table primitives, and dialogs.
- [x] Record the verified scope, missing capability list, and acceptance criteria before implementation.
- [x] Add the target route search schema and pure table-state adapters, with focused URL/filter contract tests.
- [x] Relocate the enum label/color mapping to the person-special-diseases module public API and update the existing user-account consumer without changing its behavior.
- [x] Add the feature-owned page, state store, query composition, table columns, row actions, and responsive accessible toolbar; keep the route as a composition boundary.
- [x] Add source-equivalent form/user-selection, single delete, and bulk soft/hard-delete components using target shared primitives.
- [x] Add focused component/service behavior tests for request semantics, validation, selection reset, and dialog action sequencing.
- [x] Verify affected tests, `pnpm --filter iap-admin typecheck`, `lint`, `build`, and `git diff --check`; record actual results below.

## Verification evidence

- `pnpm --filter iap-admin exec vitest run src/features/person-special-diseases` — 6 files and 12 tests passed.
- `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui pnpm --filter iap-admin test` — 66 files and 144 tests passed.
- `pnpm --filter iap-admin typecheck` — passed.
- `pnpm --filter iap-admin lint` — passed.
- `pnpm --filter iap-admin build` — passed. Rollup emitted existing third-party Zod annotation warnings only.
- `git diff --check` — passed.

## Acceptance criteria

- The route renders the feature page and has no page behavior beyond route configuration.
- Page API methods, paths, payloads, filters, optional query handling, response validation, and enum values match the verified reference.
- The mounted UI reproduces reference behavior: server page table, badge labels/colors, refresh, create/edit validation, individual delete, selectable bulk deletion with soft-delete date, and hard delete.
- Persian translations are sourced verbatim from the reference; no inferred translation is added.
- The constant mapping has one reusable owner and remains typed against `PersonSpecialDiseasesEnum`.
- Components remain focused, feature ownership follows `src/features`, cross-feature dependencies go through public module APIs, and all verification evidence is recorded.
