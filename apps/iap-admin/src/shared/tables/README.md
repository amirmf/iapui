# Admin table foundation

`src/shared/tables` is admin-local technical infrastructure. Features own their
columns, API request, query key, filter names, route validation, and product
empty states.

- Use `@iap/ui` table primitives for semantic markup only.
- Use `DataTable` with a caller-owned TanStack Table instance.
- Use `useServerTableState` for server-driven pagination, sorting, and filters.
- At a typed route boundary, use `parseServerTableSearch` and
  `toServerTableSearch`; validate the route search before parsing it.
- `TableFilters` is controlled. A feature owns its values and connects them to
  its server table state or route search.
- `PivotTable` is for local aggregation and browser CSV/PDF downloads. Feature
  code owns any domain-specific PDF layout, font, and export authorization.
