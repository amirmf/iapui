# Admin table architecture

## Ownership

`apps/iap-admin/src/shared/tables` owns reusable table infrastructure that is
specific to the admin application. It composes the semantic primitives from
`@iap/ui` with TanStack Table. `@iap/ui` remains independent of TanStack,
server-state, routing, exports, and application localization.

Features own column definitions, API request functions, query keys, route
search validation, filter identifiers, permissions, and product-specific empty
states. They import only the public `@shared/tables` entry point.

`shared/tables/index.ts` is deliberately the only public entry point.
Implementation is organized by capability: `data-table/` owns base table
composition and server state, `filter/` owns URL/filter adapters, and
`pivot-table/` owns local aggregation/export behavior. This keeps table-only
concerns out of the application `shared` root while retaining a stable feature
import.

## Components

- `SimpleDataTable` renders a caller-owned TanStack Table instance, including
  loading, empty, no-result, selection, and two-column row states.
- `PaginatedDataTable` owns TanStack Table composition for controlled,
  server-driven pagination, sorting, selection, and column visibility.
- `DataTablePagination`, `DataTableColumnHeader`, `TableActions`,
  `TableActionButton`, and selection helpers are reusable admin composition
  utilities.
- `TableFilterState` is controlled. `TableFilterQueryParams` is the optional
  route-search adapter; a feature supplies its values or validated route state.
- `PivotTable` aggregates client-provided rows and supports browser CSV and PDF
  export. Feature code still owns report-specific fonts and export
  authorization when those requirements exceed the generic export.

## Server-driven tables

For backend-paginated data, a feature uses `useServerTableState` and gives the
same pagination and sorting state to both its query and TanStack Table with
manual pagination, filtering, and sorting enabled. Do not apply client-side
filtering to an incomplete server page.

At a TanStack Router boundary, validate search parameters first with a strict,
feature-owned schema that declares its pagination, sorting, and filter keys.
Then use `parseTableFilterSearch` and `toTableFilterSearch` from the filter
module to convert only the standard table keys. Feature filter names pass
through unchanged. Read URL-synced search through `useRouterState`; do not read
`router.state` directly, so the feature subscribes explicitly to navigation.
