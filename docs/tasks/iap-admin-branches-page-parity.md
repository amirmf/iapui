# iap-admin branches page parity

## Scope

- Target route: `apps/iap-admin/src/app/router/routes/_authenticated/branches/index.tsx`
- Reference entry point: `insurance-ui/src/routes/_authenticated/branches/index.tsx`
- Reference page: `insurance-ui/src/features/branches/pages/branches-page.tsx`
- Reference source of truth: the mounted branch page closure, including API contracts, Zod schemas, Persian translation values, table state, dialogs, mutation sequencing, and row actions.

## Verified gaps in the target

The target currently renders only `PlaceholderPage` for `/branches/`. Its reusable table, filter, dialog, form, query, API-client, and localization infrastructure already exists. The following page-scoped components do not exist and must be implemented in `features/branches`:

1. Branches page composition and public feature entry point.
2. Branch contract schemas, service, query hook, and page-local dialog state.
3. Table columns, code/unit-name filters, refresh, synchronization, and row edit/delete controls.
4. Create/edit and delete dialogs, including reference-equivalent success sequencing.
5. Reference-derived translation namespace and an enum-display constant only if the reference exposes an enum used by this page.

## Tasks

| Priority | Task | Completion evidence | Status |
| --- | --- | --- | --- |
| P0 | Trace the reference component closure and compare each responsibility with target primitives. | Source mapping and gaps above are verified. | Complete |
| P0 | Add the reference API request/response Zod contracts to `@iap/api-types` and a validated target service. | Equivalent contracts and a validated service were already present on `main`; their existing mutation tests verify reference paths and payload mappings. | Complete |
| P0 | Implement the feature-owned `/branches/` page with server pagination, sorting, filters, refresh, and empty/loading states. | Route is thin; feature page uses target shared table/filter APIs. | Complete |
| P0 | Implement reference-equivalent create, edit, delete, and sync controls. | Mutations invalidate/refetch correctly; pending states and successful feedback match page behavior. | Complete |
| P1 | Copy only mounted `branches.*` Persian values from the reference and assess the enum-translation constant. | Exact Persian values were copied from the reference; no unused enum constant was added. | Complete |
| P0 | Add focused contract, state, and visible-behavior tests; run lint, typecheck, affected tests, and `git diff --check`. | Contract tests cover paths, query serialization, request validation, and invalid responses; table-state, reference-locale parity, and accessible row-action tests cover the page surface. `pnpm --filter iap-admin test`, `typecheck`, `lint`, and `git diff --check` pass (the test command uses `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui`). | Complete |

## Architecture decisions

- The route stays a composition boundary and imports only the feature public API.
- Contracts belong in `@iap/api-types`; transport behavior stays in the feature service.
- The target shared table, filter, dialog, form, and UI primitives replace reference-local equivalents when their responsibility matches.
- No enum-display constant is currently justified: the page shows `isActive` as an editable numeric value and has no enum-rendered table field. This will be rechecked while tracing the reference closure.

## Completion criteria

- `/branches/` matches all user-visible, API, schema, and localization behavior that is mounted by the reference page.
- Components are page- or feature-scoped, small, and imported through public boundaries.
- No unverified behavior, reference-only dependency, or translation is invented.
