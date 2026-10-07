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
| `@shared/tables` | `PaginatedDataTable`, `SimpleDataTable`, `DataTablePagination`: `presentation` | Reference locale keys, compact pagination, page sizes, loading/empty state text props (`loadingText`, `emptyStateText`), and row/status layout. Feature still owns query inputs, sorting policy and permissions. |
| `@shared/tables` | `TableActionButton`: `presentation`, `variant` | Action button variants (`info`, `success`, `primary`, `destructive`, `default`) matching reference hover and color tokens (e.g. `text-blue-700 hover:bg-blue-100` for `variant='info'`). |
| `@shared/tables` | `DataTableColumnHeader`, `TwoLineHeader`: `presentation` | Reference translated Radix sorting menu; pass presentation through both lines. |
| `@shared/tables` | `TwoLineCell`: `emptyValue` | Use source ASCII `'-'` only where required; preserve meaningful zero values and do not invent status labels. |
| `@shared/tables` | `TableFilterState`, `TableFilterQueryParams`: `presentation` | Propagates reference filter layout and command keyboard behavior. Reset remounts controls to cancel unpublished debounce updates. |

## Behavioral pitfalls

- Medical Center adds opt-in `SearchableSelect` / `SingleSelect`
  `presentation='reference'` for its trigger, `Table presentation='reference'`, and
  date formatting `invalidDate='throw'`. These preserve existing defaults;
  use them only when verified source behavior requires them.
- The Medical Center single-facet control uses
  `deferSingleSelection=true` so its displayed selection follows the
  published URL value until the debounce completes. Other consumers retain
  their existing selection timing.
- The reusable admin file capability is exposed by `@modules/files`; import
  its public API rather than copying upload/viewer internals into features.
  File contracts belong to `@iap/api-types`. Read the Medical Center audit for
  automatic upload, HEIC, lazy download and viewer behavior evidence.

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

## Form and transport parity evidence

For large source forms, preserve the verified field order, names, defaults and
validation semantics while extracting field groups under a FormProvider.
Source form schemas may normalize UI strings and strip unknown form fields;
validate the mapped wire payload separately with strict transport schemas in
`@iap/api-types`. Keep numeric conversion, trimming, parent-ID fallbacks and
omitted fields in the service, verified with request-boundary tests.

A component filename or passing typecheck does not prove functional parity.
Verify rendered field order/defaults, create versus edit behavior, failed
confirmations remaining open, original row IDs, and toast/invalidation sequencing.
Do not replace a source form with a generic single-input adapter, truncated
object details, or an empty export. Record source-backed completion evidence in
the owning task document and mark superseded audits historical.

## Claim Requests integration lessons

The Claim Requests second audit is recorded in
[its task inventory](../tasks/claim-requests-re-audit-v2/README.md). Future ports
should trace alternative feature branches and detail inspectors recursively;
a reduced summary cannot replace a mounted source information list. Readonly
assessment cards still mount adjustments, floating coverage lookups,
calculation-result queries, skeletons and overflow descriptions. Do not infer
that readonly mode removes those dependencies.

- `@iap/ui` now exposes `SheetContent presentation='reference'`. Its context
  scopes the source overlay, content, header and title/description presentation
  to this sheet; default sheets retain their existing behavior.
- `Button size='xs'` preserves the source compact secondary navigation action.
- `TwoLineCell presentation='reference'` restores secondary normal font weight
  and truncation on the inner secondary element. Forward it at the caller.
- Reference confirmations forward open changes during loading; default
  confirmations retain their pending guard. Feature-specific pending rules
  remain owned by the inspected feature.
- Query keys must identify the cached value shape. The reusable doc-type
  content lookup uses `['doc-types', 'page', 0, 100, 'content']`, distinct from
  page-response caches. Sharing an endpoint does not make the shapes identical.
- Keep enum translation keys and colors centralized, with source order and
  literal-key fallbacks. Translation coverage should start from source mounted
  files so target omissions do not disappear from a target-only scan.

Architecture adaptations to strict transport objects, common nullish page
metadata and public domain-prefixed exports remain explicitly listed in the
[contract audit](../tasks/claim-requests-re-audit-v2/02-contracts.md). They are
not evidence of identical whole-schema validation semantics. Source/unit
verification, screenshot comparison and live backend verification must remain
separate claims.
