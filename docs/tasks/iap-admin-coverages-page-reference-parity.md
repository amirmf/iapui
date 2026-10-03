# IAP Admin Coverages Page: Reference Parity

## Scope

- Target: `apps/iap-admin/src/app/router/routes/_authenticated/coverages/index.tsx`
- Reference entry: `/home/sadegh/Android/project/insurance-ui/src/routes/_authenticated/coverages/index.tsx`
- Reference owner: `src/features/coverages/**`
- Goal: port verified `/coverages/` list, filtering, CRUD, view, refresh, selection and bulk soft/hard delete behavior into the target architecture.

## Verified reference closure

- Page/provider: `pages/coverages-page.tsx`, `context/coverage-context.tsx`
- API/schema: `services/coverage-service.ts`, `data/coverage-schema.ts`
- UI: columns, toolbar, row actions, form, view, delete-method and bulk-delete dialogs.
- Enum translation constant: `src/constants/coverage-constant.ts`; retain this mapping approach in target with typed translation-key maps and UI badge styles.
- Locales: exact `coverages` keys from the reference Persian and English locale files.

## Target reuse

- `@shared/tables`: controlled server table, filters, pagination, column header, action buttons.
- `@iap/ui`, `@iap/forms`, `@iap/dialogs`: base controls, form fields, dialogs, destructive-operation UI.
- Existing admin feature patterns: `doc-types`, `claim-requests`, and `user-account`.

## Missing target capability list

1. Coverage API contract/domain: no `coverage` entry in `@iap/api-types`.
2. Coverage feature/service/schema/query state and route search schema.
3. Coverage-specific page components: table columns/toolbar, row actions, form/view/delete-method dialogs and provider/state owner.
4. Coverage translations and enum translation constants.
5. Reference-only `CoverageDamageCodeApplsSection` and its domain/API contract are absent. It is a separate feature (`coverage-damage-code-appls`) and is excluded to avoid inventing unverified cross-feature behavior; this page will retain all verified coverage-owned behavior.

## Tasks

- [x] Inspect architecture, parity/UI skills, reference closure, target reuse candidates, and source translations.
- [x] Create a main-based worktree and record this plan before implementation.
- [x] Add strict Zod v4 coverage request/response contracts to `@iap/api-types` and a target service that validates both directions.
- [x] Add exact Persian coverage locale keys and typed enum translation constants.
- [x] Implement a thin route plus feature-owned URL table state, server query, table, toolbar, dialogs, and CRUD actions.
- [x] Add focused URL table-state tests.
- [x] Validate: `pnpm --filter iap-admin typecheck`, `lint`, `build`, `test` (39 files/90 tests), and `git diff --check` pass. Build retains existing Zod/Rollup annotation and chunk-size warnings.

## Acceptance criteria

- Route renders the target feature page and keeps route code free of page behavior.
- API names/methods/paths/payload/query semantics match the reference: `/coverages/page-full`, `/coverages`, `/coverages/:id`, `/coverages/soft-delete`, and `/coverages/bulk-delete`.
- UI behavior and Persian/English translation values match the verified reference closure where target primitives provide the equivalent behavior.
- Contracts use Zod v4 strict request objects and validated responses; no handcrafted duplicate types.
- Selection resets after pagination changes; refresh, create, edit, view, filtering, and bulk deletion are available with correct pending and accessibility states.
