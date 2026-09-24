# Admin table architecture

## Ownership

`apps/iap-admin/src/shared/tables` owns reusable table infrastructure that is
specific to the admin application. It composes the semantic primitives from
`@iap/ui` with TanStack Table. `@iap/ui` remains independent of TanStack,
server-state, routing, exports, and application localization.

Features own column definitions, API request functions, query keys, route
search validation, filter identifiers, permissions, and product-specific empty
states. They import only the public `@shared/tables` entry point.

## Components

- `DataTable` renders a caller-owned TanStack Table instance, including loading,
  empty, no-result, selection, and two-column row states.
- `DataTablePagination`, `DataTableColumnHeader`, `DataTableViewOptions`,
  `TableActions`, `TableActionButton`, and selection helpers are reusable admin
  composition utilities.
- `TableFilters` is controlled. A feature supplies its values and connects its
  updater to `useServerTableState` or a validated route search state.
- `PivotTable` aggregates client-provided rows and supports browser CSV and PDF
  export. Feature code still owns report-specific fonts and export
  authorization when those requirements exceed the generic export.

## Server-driven tables

For backend-paginated data, a feature uses `useServerTableState` and gives the
same pagination and sorting state to both its query and TanStack Table with
manual pagination, filtering, and sorting enabled. Do not apply client-side
filtering to an incomplete server page.

At a TanStack Router boundary, validate search parameters first. Then use
`parseServerTableSearch` and `toServerTableSearch` to convert only the standard
table keys. Feature filter names pass through unchanged.
