# iap-admin DocTypesPage reference parity

## Scope

- Target: `apps/iap-admin/src/features/doc-types/pages/index/doc-types-page.tsx`
- Reference: `/home/sadegh/Android/project/insurance-ui/src/features/doc-types/pages/doc-types-page.tsx`
- Mounted closure reviewed: table toolbar, columns, row actions, inline edit,
  details/delete/bulk-delete dialogs, route search, document-type service,
  API schemas, and Persian `docTypes` translations.

## Verified reference facts

- The page synchronizes `page`, `size`, `sort`, `direction`, and filters in the
  URL. `page` is one-based in the URL, while the table state is zero-based.
- Its default table page size is `40`.
- The page query includes the effective filter state, including sort and
  direction when present, and sends those values to `GET /doc-types/page`.
- The reference mounts the same columns, actions, dialogs, inline edit flow,
  permission-gated bulk delete, refresh control, and empty-state translation.
- The target's `docTypes` Persian translation object is byte-for-byte equal to
  the reference object after canonical JSON sorting.
- The target endpoint methods, paths, request placement, form-field behavior,
  and response fields are equivalent to the reference. The target intentionally
  validates these contracts in `@iap/api-types` with Zod v4 and uses
  `transformApiFilterParams`, as required by the workspace architecture.

## Discrepancies and implementation tasks

### DT-1 — Restore the document-types URL contract (P0)

The target currently uses the shared table keys `pageSize` and `sortDirection`.
The reference uses `size` and `direction`. This prevents reference-compatible
deep links and makes the target route schema inconsistent with the reference.

**Completion criteria**

- A feature-local parser/serializer owns the reference URL keys.
- The route accepts only `docType`, `page`, `size`, `sort`, and `direction`.
- Tests cover defaults, parsing, and serialization.

**Status: completed.** `doc-type-table-state.ts` owns the reference keys and
the focused model and route-schema tests cover parsing, defaults, and strict
route validation.

### DT-2 — Restore reference pagination and sort request behavior (P0)

The target defaults to 20 rows and removes sorting from the API request and
React Query key. The reference defaults to 40 rows and sends URL sorting as
`sort` and `direction` with the page query.

**Completion criteria**

- The page defaults to 40 rows.
- Changing sort or a filter changes the query key and request input.
- Filter changes reset the page to the first page without replacing reference
  URL key names.
- API service tests verify request path, query placement, and sort values.

**Status: completed.** The page query now derives `sort`/`direction` from the
table state, includes them in its cache key, and uses the reference default
page size. The service test verifies the exact page endpoint query placement.

### DT-3 — Keep table controls aligned with the feature-local URL state (P1)

`TableFilterQueryParams` is intentionally shared around another URL contract.
Using it here emits the target-only table key names. The document-types toolbar
must instead remain a small feature component backed by the DT-1 state.

**Completion criteria**

- The toolbar renders the reference `docType` filter and reset behavior.
- It reads and writes the DT-1 URL state and preserves filter accessibility.
- No shared table contract is changed for unrelated pages.

**Status: completed.** The toolbar is controlled by the feature-local state;
the shared table URL adapter remains unchanged for its existing consumers.
Its public component name is `DocTypeDataTableToolbar`, matching the reference,
while its page-exclusive placement remains aligned with the target architecture.

### DT-4 — Align remaining page-component names with the reference (P1)

The target had retained two architecture-era aliases: `DocTypeToolbar` and
`DocTypeDetailsDialog`. Their responsibilities match the reference's
`DocTypeDataTableToolbar` and `DocTypeViewDialog`, respectively.

**Status: completed.** Both components and their imports now use the reference
names, without moving page-exclusive UI out of `pages/index/components`.

## Explicit non-tasks

- Do not change the matching Persian `docTypes` translations.
- Do not weaken Zod v4 schemas or bypass boundary validation to copy the
  reference project's deprecated Zod APIs.
- Do not move behavior into route files or alter unrelated shared table users.

## Verification plan

- Focused document-type model/service/page tests.
- `pnpm --filter iap-admin typecheck`
- `pnpm --filter iap-admin lint`
- `pnpm --filter iap-admin test`
- `git diff --check`

## Verification evidence

- Focused document-type model, route-schema, and service tests passed.
- `pnpm --filter iap-admin typecheck` passed.
- `pnpm --filter iap-admin lint` passed.
- `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui pnpm --filter iap-admin test` passed: 38 files, 88 tests.
- `pnpm exec prettier --check ...` and `git diff --check` passed.
