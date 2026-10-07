# Grouped table URL filters

## Scope and reference

Port `insurance-ui/src/components/data-table/filter/grouped-table-filter-query-params.tsx`
into `apps/iap-admin/src/shared/tables/filter`, using existing admin controls and
TanStack Router. Public consumers import `GroupedTableFilterQueryParams` and
`TableFilterGroup` from `@shared/tables`. No page or route integration is requested.

## Verified behavior and adaptations

- Preserve caller-supplied group and filter order, group headings, responsive
  one-to-five-column grid, two initially visible filters per group, and one
  expansion action for all groups.
- Support text, numeric range, date range, date-time range and faceted controls.
  Preserve `__like`, `__fromNum` / `__toNum`, and `__from` / `__to` URL keys.
  Explicit query/range keys take precedence. Date-time items force date-time mode.
- Reuse current control configuration types: facets use `placeholder` and
  `multiple` instead of reference `title` and `singleSelect`; locale and debounce
  configuration remain available. Reference presentation is the grouped default.
- Reuse the current numeric range control (two inline inputs), rather than
  introducing the reference numeric popover. Date and facet controls reuse the
  existing shared primitives. This is an intentional toolkit adaptation, not
  a claim of pixel-identical rendering.
- URL edits replace history, preserve unrelated search fields, and return pages
  above one to page one. Search updates clone prior state instead of mutating it.
- Ignore pagination, sorting and caller-ignored keys when detecting active filters.
  Like the reference, explicit reset clears all search fields, including ignored
  fields. Reset remounts controls to cancel unpublished debounce work.
- Persian `common.more`, `common.collapse` and `common.resetFilter` values match
  the reference locale exactly; caller labels may override them.
- Unique generated heading IDs avoid collisions between component instances.
  Existing controls provide focus handling; the expansion button exposes its state.
- Add an optional facet `triggerClassName` without changing existing consumers.

## Completion criteria and verification

Focused tests cover order, expansion, like/numeric keys, custom keys, pagination,
immutable URL changes, reset debounce cancellation, filter detection, date-mode
rendering and facet publication. Required checks: filter tests, admin typecheck,
admin lint, architecture check and whitespace check. Browser screenshots and live
backend verification are outside this standalone component task.

## Completed verification

- All 24 filter tests across eight files passed, including seven new grouped-filter tests.
- `pnpm --filter iap-admin typecheck` passed.
- `pnpm --filter iap-admin lint` passed.
- `pnpm architecture:check` passed.
- `git diff --check` passed; changed source files passed Prettier checks.
- The three Persian shell label values were compared programmatically with the reference.
- No route files or existing checkout changes were modified.

## Accepted follow-up decision

The user explicitly cancelled relocation of the three new components into a
`components/` directory. Their existing placement remains a scoped exception,
recorded in `docs/architecture/ADMIN-TABLES.md`. Reusable consumer guidance is
in `apps/iap-admin/src/shared/tables/README.md`; a new skill is unnecessary for
this small capability because the existing parity and UI skills already cover
its implementation workflow.
