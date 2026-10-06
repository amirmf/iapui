# Admin table foundation

`src/shared/tables` is admin-local technical infrastructure. Its root is only
the public API. `data-table/` owns TanStack table composition; `filter/` owns
reusable filter controls, their local state, and URL adapters; `pivot-table/`
owns local aggregation and browser exports. Features own their columns, API
request, query key, filter names, route validation, and product empty states.

- Use `@iap/ui` table primitives for semantic markup only.
- Use `SimpleDataTable` with a caller-owned TanStack Table instance.
- Use `PaginatedDataTable` for server-driven result pages. It receives controlled
  pagination, sort, selection, and column visibility state from the feature; it
  does not own API calls or route state. Its default empty and loading labels
  use `common.noRecords` and `common.loading`; pass `labels` only to override
  those defaults for a specific table.
- Use `useTableFilterState` for local filter, pagination, and sorting state.
- Use `useTableFilterQueryParams` when table state is URL-synced. Features own
  their route-search parser and serializer under `route-adapters/`; the shared
  hook only applies table transitions and Router navigation.
- `parseTableFilterSearch` and `toTableFilterSearch` in `filter-utils` support
  the default `page`/`pageSize`/`sort`/`sortDirection` URL contract. Features
  with a different contract keep their own parser and serializer.
- `TableFilterState`/`TableFilters` is controlled. `TableFilterQueryParams` is
  a convenience component for filter-only URL toolbars; do not combine it with
  `TableFilterState` for the same filter values.
- `PivotTable` is for local aggregation and browser CSV/PDF downloads. Feature
  code owns any domain-specific PDF layout, font, and export authorization.
