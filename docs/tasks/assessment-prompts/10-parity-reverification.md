# 10 — Complete closure verification

Status: Completed within the recorded verification boundary (2026-10-06). Priority: P1.

## Scope and source trace

Reference root is insurance-ui. Paths in the reference column are relative to
that root; target paths follow current ownership boundaries rather than copying
the source directory layout.

| Mounted responsibility | Reference | Target/check |
| --- | --- | --- |
| Route/search/breadcrumb | src/routes/_authenticated/assessment-prompts/index.tsx | Thin app route; feature route-adapters; URL tests |
| Page/content/provider | features/assessment-prompts/pages/assessment-prompts-page.tsx; context/assessment-prompt-context.tsx (under src/) | Same page/content/provider/hook names; page/provider tests |
| Main/card/actions | src/components/layout/main.tsx; source page | Technical shared Main; Tabler icons; page test |
| DTO/form/page/request schemas | src/features/assessment-prompts/data/assessment-prompt-schema.ts | Public api-types source names; eight contract tests; direct561 comparison |
| Nested agreement/page schema | Source agreements data schema | Public api-types agreement domain; invalid response tests |
| Service/query/signal | src/features/assessment-prompts/services/assessment-prompt-service.ts; source page | Eight operations, signatures, defaults, query options;13 service tests |
| Agreement search/selected query | Source inline form SearchableSelect and agreements service | Raw immediate search, row-backed selection; six service and form tests |
| Columns/enum labels | src/features/assessment-prompts/components/assessment-prompt-columns.tsx; src/constants/assessment-prompts-constant.ts | Same column semantics/mappings/order; column/constant tests |
| Row actions/tooltips/LongText | Source row-actions; src/components/data-table/table-actions.tsx, table-action-button.tsx; source LongText/Tooltip | Scoped source presentation and delay; rendered action tests |
| Toolbar/text/date/facets | Source assessment-prompts-data-table-toolbar.tsx; src/components/data-table/filter/ | Source labels/keys/geometry and1200/500/1000ms delays; toolbar/filter tests |
| Paginated/table/layout/checkbox/header | src/components/data-table/{paginated-data-table,simple-data-table,data-table-layout,table-checkbox,data-table-column-header}.tsx | Scoped reference classes/control behavior; table/columns tests |
| Pagination/Select | src/components/data-table/data-table-pagination.tsx; src/components/ui/select.tsx | Source count+total, options, icons, RTL; public RadixSelect and table test |
| Form/fields/validation | src/features/assessment-prompts/components/assessment-prompt-form-dialog.tsx and doc-type field | Small feature components; source literal schema/errors; ten form tests |
| SearchableSelect/SingleSelect/Command | src/components/select/; src/components/ui/command.tsx | Public source-named scalar primitives; UI and form tests |
| Document-type query/cache | Source useDocTypesData hook | Module public capability; source key/localStorage/page/stale/gc; three tests |
| Dates/calendar/range/formatting | src/components/date-picker/; source date utility and calendar styling | Scoped source width/icons/clear/mobile/language/theme; date tests; safe invalid fallback disclosed |
| Dialog/Popover/Textarea | src/components/ui/{dialog,popover,textarea}.tsx | Scoped source appearance, default consumers retained; UI/form tests |
| Input/Label/FormItem/Button | Source UI/form primitives used by mounted form | Direct comparison equivalent for this use; retained existing public primitives |
| View/badges | src/features/assessment-prompts/components/assessment-prompt-view-dialog.tsx | Exact mounted fields, nullish fallback, wrapping/classes; two view tests |
| Delete-method/confirmation/date | Source assessment-prompt-delete-method-dialog.tsx; src/components/dialogs/delete-method-dialog.tsx; src/components/ui/alert-dialog.tsx | Scoped source layout/state/timing; selected-only and retry safeguards; five tests |
| Locale closure | src/locales/fa.json |98 copied feature/table/common values compared directly |
| Unmounted/commented capabilities | Source AssessmentPromptBulkDeleteDialog, AgreementSearchSelect, form DialogDescription, fromDate column | Deliberately excluded; no invented child page or unused UI |

## Decisions and limits

- The user's explicit reference-contract decision resolves the former strict
  request/required-content architecture conflict. Source accepted values,
  stripping, names and validation issue order are now preserved.
- Technical ownership, React19 body props, Zustand selectors, public package APIs
  and Tailwind v3 equivalent sizing remain target architecture adaptations.
- Selected-only deletion, failure retry, validated cache and safe invalid date
  behavior are disclosed safeguards in the README, not concealed equivalence.
- Enum constant has been compared line by line: mappings, exported helper names,
  option order and source translation keys match; keeping these together is
  appropriate presentation ownership without duplicating schemas.
- Source normal DialogDescription is commented out and is not mounted.
- No live backend or browser screenshot comparison was run. Class/interaction
  tests and source inspection do not prove pixel-perfect rendering.

## Observed verification — 2026-10-06

- Focused feature/shared table/filter/doc-cache run:16 files /63 tests passed.
- Full admin regression:104 files /238 tests passed.
- Final shared UI:15 files /46 tests passed; forms:2 files /11 tests passed.
  Scoped tooltip tests also verify unrelated defaults remain unchanged.
- Direct read-only schema comparison:17 exported schemas ×33 inputs =561 exact
  parsed-output/error-code/path/message/order comparisons passed.
- Direct source locale comparison:98 values passed. Only copied/mounted keys are
  in scope; commented and unused source keys are intentionally excluded.
- Admin and UI/forms/dialogs/api-types typechecks passed.
- Admin lint and architecture checks passed.
- Final production admin build passed, including the soft-delete DatePicker
  forwarding correction. Dependency annotation and large-chunk warnings remain.
- Formatting and diff checks passed. The final soft-delete date appearance
  integration tests passed (2 tests); all affected typechecks passed again.
- Full admin regression was run before the final mechanical class cleanup and
  soft-delete date forwarding. The affected63-test suite was rerun after class
  cleanup; the deletion integration tests were rerun after date forwarding.

The source-only pagination icon namespace is resolved inside its reference
component, preventing eager imports from breaking unrelated mocked consumers.
