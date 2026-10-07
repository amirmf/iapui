# Admin table architecture

## Ownership

`apps/iap-admin/src/shared/tables` owns reusable table infrastructure that is
specific to the admin application. It composes the semantic primitives from
`@iap/ui` with TanStack Table. `@iap/ui` remains independent of TanStack,
server-state, routing, exports, and application localization.

Features own column definitions, API request functions, query keys, route
search validation, filter identifiers, permissions, and product-specific empty
states. URL-synchronized table state and its validation live in the owning
page's `route-adapters/` directory (or in the feature's `route-adapters/`
directory for a single-root-route feature). They import only the public
`@shared/tables` entry point.

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

Table/filter reference presentation is opt-in and preserves feature ownership
of API inputs and route state. See
[Reference-page controls](REFERENCE-PAGE-CONTROLS.md) for pagination, sorting,
filter reset and debounce behavior added during the Agreements port.

For backend-paginated data, a feature uses `useTableFilterState` (local state)
or `useTableFilterQueryParams` (URL state) and gives the
same pagination and sorting state to both its query and TanStack Table with
manual pagination, filtering, and sorting enabled. Do not apply client-side
filtering to an incomplete server page.

At a TanStack Router boundary, validate search parameters first with a strict,
feature-owned schema that declares its pagination, sorting, and filter keys.
Then use `parseTableFilterSearch` and `toTableFilterSearch` from the public
table API for the default URL contract, or a feature-owned parser/serializer
for source-specific keys such as Agreements `size` and `direction`. Feature
filter names pass through unchanged. Read URL-synced search through
`useRouterState`; do not read
`router.state` directly, so the feature subscribes explicitly to navigation.

`useTableFilterState` accepts `{ filters, pagination, sorting }` and returns
`onFiltersChange`, `onPaginationChange`, `onSortingChange`, and `resetFilters`.
Filter changes reset the page, following the current main-branch contract.
`resetFilters` also returns to the first page and retains the chosen page size.

## Grouped filter file-placement exception

The grouped URL-filter port retains its three React components directly under
`shared/tables/filter/`, matching the existing filter capability layout. After
reviewing the discrepancy with the general `components/` convention, the user
explicitly requested that this placement remain unchanged. This exception is
limited to `grouped-table-filter-query-params.tsx`,
`grouped-table-filter-group.tsx` and `grouped-table-filter-item.tsx`; it does not
relax the component-placement rule for future implementations. Feature consumers
still import the public `@shared/tables` API. The table README documents usage
and URL/reset semantics for subsequent page implementations.
