# iap-admin OTP page parity

## Scope

Implement the authenticated `/otp/` page in `iap-admin`, matching the verified
behavior of the reference page at
`insurance-ui/src/routes/_authenticated/otp/index.tsx` and its mounted OTP
feature closure. The target keeps the `iap-ui` architecture: a thin route,
feature-owned page UI and services, application shared tables, and API
contracts in `@iap/api-types`.

## Verified reference behavior

- The page renders independent signup-OTP and password-reset-OTP sections.
- Each section fetches a server-paginated list, with its own filters,
  pagination, sorting, refresh state, loading state, and empty state.
- Both sections filter `phoneNumber` and `nationalCode`; sorting sends the
  selected column id and `ASC` or `DESC` direction.
- Signup records display phone number, national code, OTP creation time,
  expiration time, and OTP hash. Password-reset records add username.
- The endpoints are `GET /auth/signup/otp` and
  `GET /auth/password-reset/otp`. Filters are flattened query parameters;
  `page`, `size`, `sort`, and `direction` are query parameters.

## Component inventory

| Component or capability | Reference source | Target status | Decision |
| --- | --- | --- | --- |
| Page composition | `features/otp/pages/otp-page.tsx` | Missing | Add feature-root page component. |
| Signup OTP section | `components/signup-otp-section.tsx` | Missing | Add small feature component. |
| Password-reset OTP section | `components/password-reset-otp-section.tsx` | Missing | Add small feature component. |
| OTP table columns | `components/*-otp-columns.tsx` | Missing | Add two focused column hooks. |
| OTP filter toolbar | `components/*-otp-data-table-toolbar.tsx` | Missing | Add one reusable, feature-private toolbar because both sections have identical filters. |
| Server table, filters, column header, date format | reference shared components | Present in `@shared/tables` and `@iap/ui` | Reuse; do not duplicate. |
| OTP list API contracts | reference `features/auth/data/auth-schema.ts` | Missing in `@iap/api-types` | Add source-backed Zod v4 contracts in the auth package. |
| OTP list service | reference `features/auth/services/auth-service.ts` | Missing | Add feature service using target API client and shared filter serialization. |
| OTP translations | reference `src/locales/fa.json` | Missing | Copy only the referenced Persian values into target locale. |
| Enum translation constants | target feature `constants/` conventions | Not applicable | No visible OTP enum is rendered; no constant is added. |

## Tasks

- [x] Add OTP request and response Zod contracts to `@iap/api-types`, with
  focused tests for defaults and invalid input.
- [x] Add the target OTP feature service and tests that verify endpoint,
  method, query placement, request defaults, and response validation.
- [x] Add exactly the OTP translation keys and verified Persian values from the
  reference project.
- [x] Implement the OTP page, two independent sections, table-column hooks,
  and the shared feature-private filter toolbar.
- [x] Replace the placeholder route with the feature public API composition.
- [x] Add focused user-visible tests for both section headings, table columns,
  empty states, filters, sorting, pagination, and refresh feedback.
- [x] Run affected tests, lint, typecheck, and `git diff --check`; record
  results here before marking this task complete.

## Completion criteria

- `/otp/` presents the two tables and all reference-visible controls.
- API contracts, paths, query serialization, defaults, and Zod validation are
  source-backed by the reference implementation.
- Route remains thin; feature internals are not imported outside its public
  API; existing target table primitives are reused.
- Persian text is copied from the reference rather than translated or inferred.
- The implementation preserves keyboard-accessible native controls, loading
  feedback, and responsive overflow behavior provided by target shared tables.

## Verification

- `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui
  pnpm --dir apps/iap-admin exec vitest run src/features/otp` — passed
  (3 files, 4 tests).
- `pnpm --filter iap-admin typecheck` — passed.
- `pnpm --filter iap-admin lint` — passed.
- `git diff --check` — passed.
- Focused OTP tests use `INSURANCE_UI_REFERENCE_PATH` because the locale parity
  test verifies values directly against the reference project.

## Second parity audit — 2026-10-03

The initial implementation matched the page capability but not the reference
component closure closely enough. This audit compares every mounted reference
file line by line. No implementation work for this audit begins until this
list is recorded.

### Confirmed matches

- The mounted sections, table columns, query keys, empty-state keys, stale and
  garbage-collection times, and table manual-mode flags exist in the target.
- A programmatic deep comparison confirms the entire `otp` Persian locale
  object in the target is byte-for-byte structurally equal to
  `insurance-ui/src/locales/fa.json`.
- No OTP display enum exists in the reference; an enum translation constant is
  still not applicable.

### Discrepancies and follow-up tasks

- [x] **P0 — route metadata:** copy the reference `loader` returning
  `{ crumb: 'otp' }` into the target route.
- [x] **P0 — page surface:** reproduce the reference `Main` card appearance in
  a target feature-private wrapper. The target authenticated layout already
  owns the document's only `<main>` element, so use a semantic `<section>` or
  `<div>` rather than nesting an invalid second `<main>`.
- [x] **P0 — component topology:** replace the merged `OtpTableToolbar` with
  the two source-shaped feature components, one for signup OTP and one for
  password-reset OTP. Preserve the shared target table primitive only where
  its public contract replaces the reference primitive.
- [x] **P0 — table state:** match the reference's initial pagination
  (`pageIndex: 0`, `pageSize: 40`); do not reset pagination on ordinary filter
  or sorting changes; reset only the page index on explicit filter reset.
- [x] **P0 — section controls:** match each reference section's heading row,
  refresh icon size, button spacing, `isLoading` disable/spinner condition,
  and callback behavior. The target's icon implementation may use its existing
  icon package, but must render at the same 18px size.
- [x] **P0 — table columns:** use the source-shaped `ColumnDef` declarations
  and cell behavior. In particular, leave username and phone-number cells at
  the shared table default; only national code and hash use `'-'`; date cells
  pass their source value directly to `formatDateTime`.
- [x] **P0 — request contract:** expose source-shaped `OtpListRequest` input
  with required `filters`, default `page`/`size`, and top-level optional
  `sort`/`direction`. Keep the target's mandatory shared query serialization
  helper as the architecture-required adaptation for array filters.
- [x] **P0 — response contracts:** replace permissive common page-response
  use with the source field set: required pagination fields and optional
  `sort`/`pageable` nested objects. Use Zod v4 `.loose()` rather than the
  reference's deprecated `.passthrough()` per target architecture.
- [x] **P0 — service behavior:** rename target API calls to source-shaped
  `listSignupOtps` and `listPasswordResetOtps`; pass `filters`, `sort`, and
  `direction` independently; preserve the 60-second reference timeout and
  validate both request and response boundaries.
- [x] **P1 — query and rendering details:** keep rows memoized as in the
  reference, remove the target-only `hasActiveFilters` prop, and keep source
  query-key part ordering (`pagination`, `filters`, `sort`, `direction`).
- [x] **P1 — verification:** add direct parity tests for source pagination,
  reset behavior, loader metadata, column fallbacks, request shape, timeout,
  response metadata validation, and locale equality; run targeted tests,
  typecheck, lint, and diff validation.

### Architectural adaptations (not discrepancies)

- The target route imports only the OTP feature public API and does not import
  feature internals, as required by `iap-ui` architecture.
- The target authenticated layout already supplies the page's document-level
  `<main>`, so copying the reference `Main` element literally would create
  invalid nested landmark semantics.
- The target uses Zod v4 `.loose()` and `transformApiFilterParams`, which are
  explicit application-architecture requirements replacing the reference's
  legacy `.passthrough()` and direct filter spread.

### Second-audit verification

- Superseded by the third-audit verification below, after the generic OTP table
  abstraction was removed.
- `pnpm --filter iap-admin typecheck` — passed.
- `pnpm --filter iap-admin lint` — passed.
- `git diff --check` — passed.

## Component naming alignment

- [x] Move OTP page-exclusive UI from `features/otp/ui/` to
  `features/otp/components/`, the architecture-approved location for a
  single-route feature's private component group.
- [x] Keep the reference component filenames and default exports for the page
  and its mounted component closure; retain the target feature's public
  `OtpPage` export through `features/otp/index.ts`.
- [x] Update imports and rerun focused tests, typecheck, lint, and diff
  validation.

## Single-route feature placement

- [x] Move `OtpPage` from `features/otp/pages/` directly to `features/otp/`.
  `/otp/` is this feature's only page, so the architecture's single-root-route
  exception avoids an unnecessary `pages/` directory.
- [x] Preserve the feature public API, route URL, component names, and the
  existing `components/`, `model/`, and `services/` ownership boundaries.
- [x] Rerun focused tests, typecheck, lint, and diff validation.

## Third parity audit — component ownership and state model

### Verified inputs

- The target and reference `otp` translation objects are structurally equal.
- Both target API methods use the reference endpoints, request schema names,
  response schema names, and 60-second timeout.
- No application feature currently consumes the target `useTableFilterState`
  hook, so extending its return contract has no existing consumer impact.

### Discrepancies and tasks

- [x] **P0 — state ownership:** replace the target-only generic
  `useOtpTable` abstraction with the reference model: each OTP section owns
  its filter state, pagination, sorting state, and `useQuery` call directly.
- [x] **P0 — shared filter contract:** extend target `useTableFilterState` to
  provide the source-backed `filters`, `setFilters`, `pagination`,
  `setPagination`, `onChange`, `reset`, and `isFiltered` values, while
  retaining any legacy aliases needed by target consumers.
- [x] **P0 — toolbar call shape:** make each OTP toolbar receive the
  source-shaped `filters`, `onChange`, and `onReset` props; adapt only at the
  shared target filter primitive boundary.
- [x] **P1 — cleanup and verification:** remove the now-unused OTP table
  abstraction and its test; add or update focused tests for the direct query
  model, then run all OTP tests, typecheck, lint, and diff validation.

### Third-audit verification

- `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui
  pnpm --dir apps/iap-admin exec vitest run src/features/otp` — passed
  (3 files, 4 tests).
- `pnpm --filter iap-admin typecheck` — passed.
- `pnpm --filter iap-admin lint` — passed.
- `git diff --check` — passed.
