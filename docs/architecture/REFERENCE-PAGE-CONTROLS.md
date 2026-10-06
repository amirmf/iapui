# Reference-page controls

## Scope and decision

The Agreements and Assessment Prompts ports share opt-in reference presentations. Use
these capabilities when the inspected source page requires their behavior;
they are not a redesign mandate for other pages. The reference remains the
evidence for labels, timing, field optionality and mounted actions. Existing
default consumers retain their presentation.

Keep product behavior in features, admin table composition in
`@shared/tables`, shared primitives in `@iap/ui` and common confirmation/delete
flows in `@iap/dialogs`. Import only public APIs. This supplements
`APPLICATION-ARCHITECTURE.md`, `SHARED-UI.md` and `ADMIN-TABLES.md`.

## Available public capabilities

| Owner | Capability | Use and boundary |
| --- | --- | --- |
| `@iap/ui` | `Button`, `Badge`: `presentation='reference'` | Source disabled/ghost styles and badge sizing/focus styles; opt in on mounted shared controls as well as feature buttons. |
| `@iap/ui` | `DialogContent`, `AlertDialogContent`: `presentation='reference'` | Source geometry, scrolling, overlay and inherited header typography; nested primitives derive the presentation from their content host. |
| `@iap/ui` | `Select`: `presentation`, `selectedValue`, `clearLabel` | Preserve the scalar selection when async options no longer contain it. The localized popup clear command still clears it. Supply source loading/empty labels and do not expose selectable options during loading. |
| `@iap/ui` / `@iap/forms` | `DatePicker` / `DatePickerField`: `clearable` | Set `false` only when the source has no clear callback; date-range filters can remain clearable. The form adapter forwards the primitive contract. |
| `@iap/ui` | `DateRangePicker`: `presentation`, `wrapperClassName`, `triggerClassName`, `className` | Wrapper and trigger geometry are separate from popup geometry (`className`). Reference presentation restores the compact trigger and source date-label pipeline. |
| `@iap/dialogs` | `ConfirmDialog`, `DeleteMethodDialog`: `presentation` | Source confirmation layout without replacing feature-owned operations, invalidation or toasts. Delete flow accepts `resetDelay`; operation rejection keeps it open. |
| `@shared/tables` | `PaginatedDataTable`, `SimpleDataTable`, `DataTablePagination`: `presentation` | Reference locale keys, compact pagination, page sizes and row/status layout. Feature still owns query inputs, sorting policy and permissions. |
| `@shared/tables` | `DataTableColumnHeader`, `TwoLineHeader`: `presentation` | Reference translated Radix sorting menu; pass presentation through both lines. |
| `@shared/tables` | `TwoLineCell`: `emptyValue` | Use source ASCII `'-'` only where required; preserve meaningful zero values and do not invent status labels. |
| `@shared/tables` | `TableFilterState`, `TableFilterQueryParams`: `presentation` | Propagates reference filter layout and command keyboard behavior. Reset remounts controls to cancel unpublished debounce updates. |

## Behavioral pitfalls

- Audit shared primitives as well as the page's direct JSX. A matching component
  name does not prove equivalent loading, empty, pending or keyboard behavior.
- Preserve source debounce per control. In the Agreements closure, text filters
  use 1200 ms, faceted controls use their configured source delay, and date
  ranges use 500 ms. Do not extrapolate these values to unrelated pages.
- Clear/reset must not allow a scheduled stale update to restore an old filter.
  Test cancellation with fake timers and actual reset/remount behavior.
- Keep URL/control state out of backend services. Use the feature's route
  adapter and public filter serialization; preserve explicit source range keys
  before adapting them to backend filters.
- Current local table state uses `useTableFilterState({ filters, pagination,
  sorting })`. Copy source defaults explicitly (Agreements uses 40 rows).
  Filter transitions reset pagination under the current main-branch contract.
  During Agreements integration, the user explicitly chose main over the
  reference's page-preserving filter behavior. Explicit `resetFilters` also
  resets the page without changing its size; do not add a parity-specific
  bypass for this accepted architecture behavior.
- For async lookups, option objects are transient but selected scalar IDs may
  remain valid. A refreshed option list must not prevent clearing that value.
- Copy date interpretation from the source at the appropriate caller boundary.
  `formatLocalDateTime` from `@iap/shared-lib` is available for local calendar
  date serialization; do not replace it with UTC ISO truncation or globally
  change unrelated formatting.
- Keep strict outgoing request schemas and approved common page factories while
  verifying source field optionality, aliases and nested responses. Document
  these architecture adaptations rather than presenting them as exact source
  schema identity.
  Exception: the explicitly accepted Assessment Prompts and AI Assessment Rules source contracts use
  stripping requests and domain-specific schemas. Read
  `ASSESSMENT-PROMPTS-REFERENCE-CONTRACT.md` and `AI-ASSESSMENT-RULES-REFERENCE-CONTRACT.md`; do not apply their exceptions
  to Agreements or other pages without explicit user requirement.
- Source-absent locale keys may intentionally show English fallback text.
  Extract actual Persian values and compare them programmatically; do not
  invent translations or assume an existing target key gives source parity.
- Keep mutation feedback and invalidation in the feature. Do not await
  invalidation when the source intentionally closes immediately. Test both
  success sequencing and rejected operations.
- Forward reference presentation through tooltips, popovers and nested date
  controls. DateRangePicker accepts `formatLabel` and `separator` for inspected
  source labels; DatePicker also supports `showClear` for existing callers.
  Reference text/facet defaults are 1200/1000 ms; an explicit delay overrides
  them. Default presentation retains its original timing.

## Verification and examples

The Agreements components provide a concrete consumer example, not a product
template to copy indiscriminately. Focused regression examples live beside:

- `shared/tables/data-table/reference-table-parity.test.tsx`;
- `shared/tables/filter/reference-faceted-keyboard.test.tsx`;
- `shared/tables/filter/table-filter-date-range-filter.test.tsx`;
- `features/agreements/components/agreement-delete-parity.test.tsx`;
- `features/agreements/services/reference-translations.fixture.json`;
- `packages/ui/src/select.test.tsx` and `date-picker.test.tsx`.

Application paths above are relative to `apps/iap-admin/src`; package paths are
relative to the repository root. Update task evidence after integration with
the current main branch. Report browser/screenshot and live-backend coverage
separately from source comparisons, unit tests, typechecks and builds.
