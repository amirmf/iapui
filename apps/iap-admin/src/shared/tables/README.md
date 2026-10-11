# Admin table foundation

`src/shared/tables` is admin-local technical infrastructure. Its root is only
the public API. `data-table/` owns TanStack table composition; `filter/` owns
reusable filter controls, their local state, and URL adapters; `pivot-table/`
owns local aggregation and browser exports. Features own their columns, API
request, query key, filter names, route validation, and product empty states.

- Use `@iap/ui` table primitives for semantic markup only.
- Use `SimpleDataTable` with a caller-owned TanStack Table instance.
- Use the exported `DataTablePresentation` type when a component accepts the
  `default` or `reference` presentation; keep presentation-specific classes
  composed through `cn` from `@iap/ui`.
- Use `PaginatedDataTable` for server-driven result pages. It receives controlled
  pagination, sort, selection, and column visibility state from the feature; it
  does not own API calls or route state. Its default empty and loading labels
  use `common.noRecords` and `common.loading`; pass `labels` only to override
  those defaults for a specific table.
- Use `useTableFilterState` for local filter, pagination, and sorting state.
  Supply `{ filters, pagination, sorting }`; consume `onFiltersChange`,
  `onPaginationChange` and `resetFilters`. Filter updates reset pagination to
  the first page, following the current main-branch contract.
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

## Grouped URL filter toolbars

Import `GroupedTableFilterQueryParams` and `TableFilterGroup` from
`@shared/tables`. Use this component for a filter toolbar whose controls are
organized into named groups. Keep group definitions and route-search validation
in the owning feature; the component performs no API requests.

```tsx
import {
  GroupedTableFilterQueryParams,
  type TableFilterGroup,
} from '@shared/tables'

const groups: readonly TableFilterGroup[] = [
  {
    id: 'identity',
    title: 'Identity', // Supply a translated feature-owned label.
    filters: [
      { type: 'text', config: { id: 'name', asLike: true, placeholder: 'Name' } },
      {
        type: 'faceted',
        config: {
          id: 'status',
          placeholder: 'Status',
          multiple: false,
          options: [], // Supply the feature's actual lookup options.
        },
      },
    ],
  },
]

// Render inside the feature's validated Router boundary.
<GroupedTableFilterQueryParams groups={groups} />
```

The discriminated `type` values are `text`, `numberRange`, `dateRange`,
`dateTimeRange` and `faceted`. The component preserves supplied order and shows
up to two filters per group initially. `defaultVisibleFilterCount` changes that
limit; expansion applies to all groups. `className` customizes the responsive
grid, while `classNameContainer` customizes the shell.

- Text `asLike` uses `<id>__like`; `queryKey` overrides that key.
- Numeric ranges use `<id>__fromNum` / `<id>__toNum`.
- Date and date-time ranges use `<id>__from` / `<id>__to`.
  Range `fromKey` / `toKey` override those defaults. Date-time items force the
  existing date control into date-time mode.
- Facets use the current `placeholder` / `multiple` configuration, rather than
  the reference's `title` / `singleSelect` names.
- Search edits preserve other fields and replace history. They set `page` to
  `'1'` when its current value exceeds one, otherwise omit it. Validate these
  keys in the feature's route-search schema; use a feature adapter for different
  pagination contracts.
- `ignoreQueryParams` affects active-filter detection only. Reset clears **all**
  search parameters, including ignored fields, sorting and page size, and
  cancels pending control updates. Do not use it when a page requires reset to
  preserve unrelated search state without a feature-specific adapter.
- `presentation` defaults to `'reference'`; reference numeric ranges show a
  summary button and two inputs inside a popover. Grouped triggers fill their
  allocated width.
- `showReset`, `labels`, `expandButtonLabel` and `collapseButtonLabel` customize
  shell actions. Default labels use existing translated common keys.

Do not mount a second filter-state owner for the same URL fields. See
[the port evidence](../../../../../docs/tasks/grouped-table-filter-query-params.md)
for tests, reference adaptations and the accepted file-placement exception.

## Debounce and reference timing

All filter controls use the shared callback hook from `@iap/react-hooks`, backed
by the single `debounce` implementation in `@iap/shared-lib`. Text and both
numeric bounds default to 1200ms, facets to 1000ms, and date/date-time ranges
to 500ms in every presentation. An explicit `debounceMs` overrides these values.
Do not debounce the toolbar's `onValueChange` again.

Reference numeric ranges format committed amounts in their summary trigger.
Each bound has independent draft text, a clear action and a cancellable timer.
Default numeric controls retain inline geometry and legacy range keys. Clear
applies immediately; clear, controlled-value/key changes and content remount
on global reset discard unpublished edits. Unmount also cancels them.

For lookup searches outside the table controls, use `useDebouncedValue` when a
query consumes delayed state and `useDebouncedCallback` when explicit immediate
clear/cancel behavior is needed. Preserve the source-specific lookup delay.
See [the hook API](../../../../../packages/react-hooks/README.md) for examples.
