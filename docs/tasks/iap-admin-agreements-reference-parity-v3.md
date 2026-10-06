# Agreements mounted-component parity audit V3

> Historical audit. The fresh component and shared-primitive audit in `iap-admin-agreements-reference-parity-v4.md` supersedes this document's completion labels and verification counts.

## Scope and evidence

Reference root: `/home/sadegh/Android/project/insurance-ui/src/routes/_authenticated/agreements/index.tsx` and `src/features/agreements/pages/agreements-page.tsx`.
Target root: `apps/iap-admin/src/features/agreements/agreements-page.tsx` in `codex/iap-admin-agreements`.

Every item below is based on inspected reference source. Commented JSX is not mounted behavior. Earlier audit completion labels do not establish parity for this audit. Reference names and behavior are retained while providers/stores, route adapters, shared primitives, and API contracts stay in target architecture owners.

## Tasks

| ID | Components / reference evidence | Verified discrepancy and acceptance criteria | Status |
| --- | --- | --- | --- |
| M1 | `AgreementsSection.tsx`, `components/layout/main.tsx`, `use-sync-query-params-table-filter.ts` | Restore card wrapper, default page size 40, minimum page count 1, compact pagination and destructive delete styling. Move URL parsing/navigation from component to feature route adapter; forward sorting to the API as the reference does. | Complete |
| M2 | `agreement-columns.tsx`, `agreement-row-actions.tsx` | Add exact named `AgreementRowActions`, remove extra view action, restore edit/initialize/audit actions and five hidden accessor columns. Verify actions and column IDs. | Complete |
| M3 | `agreement-data-table-toolbar.tsx`, shared reference filter components | Supply status filter title and display all eight filters by default (reference default visible count 10). Use reference size/direction control keys. | Complete |
| M4 | `agreement-form-dialog.tsx` | Restore `sm:max-w-xl`, left header, scrollable three field groups, status placeholder, no mounted description (reference description is commented), reference default reset and translated schema validation. | Complete |
| M5 | `agreement-view-dialog.tsx` | Restore `sm:max-w-lg`, reference readonly two-column field layout and explicit detail date format, without inventing ACTIVE for absent status. | Complete |
| M6 | `agreement-coverage-initialize-dialog.tsx` | Restore sparkles title and prevent closing during pending initialization. | Complete |
| P1 | `agreement-party-appls-content-panel.tsx`, `pages/agreement-party-appls-page.tsx`, party context | Restore `AgreementPartyApplProvider`/`AgreementPartyApplsContent`, configurable content props, store reset lifecycle, 40-row default, reference pagination/filter/selection behavior, query IDs distinct from UUID-valid creation IDs, null empty query keys, minimum page count and card wrapper/common.noResults. | Complete |
| P2 | Party toolbar and role constants | Restore displayName `__like`, seven visible filters (reference default 10), source widths/debounce and all nine filter roles separately from seven allowed creation roles. | Complete |
| P3 | Party form and user search select | Restore translated create schema resolver, `agreementIdsCreate` prop, empty-selection submit guard, immediate reset/close, pending close-icon behavior, flex-1 footer controls, searchable non-clearable role and actual `AgreementUserAccountSearchSelect` with reference lookup/query behavior. | Complete |
| P4 | Party single/bulk deletion and view/columns/actions | Restore single-delete refetch/toast/close order and missing-ID guard; bulk empty-selection guard; displayName truthy fallback, raw role in view, reference PPpp date display and no invented footer; destructive delete styling/icons. | Complete |
| C1 | Coverage section/context | Restore named provider and private content, reset/toggle lifecycle, section-local row selection, reference card/actions, page size 40 and filter reset/edit semantics. Sorting remains disabled as in the reference table default. | Complete |
| C2 | Coverage inline update | Require all five reference IDs before submitting; restore non-awaited invalidation/toast/clear sequence. | Complete |
| C3 | Coverage form | Restore open/onOpenChange/currentRow/defaultAgreementId props and distinct create/edit mounts, 520px width, one-column lookups, numeric/date two-column groups, only common.update/common.save submit, source defaults/clearable lookup/query keys/loading settings and no invented success toast. | Complete |
| C4 | Coverage view/delete/columns/toolbar | Restore 520px view width, PPpp dates, 500ms cleanup; explicit delete props and empty selection guard/500ms reset; reference div widths and direct column headers; localized reset labels. Existing twelve view fields and visible column order already match. | Complete |
| A1 | Agreement services/schema | Restore default page size 30, update body id, optional text/numeric preprocessing and translated form schema factory; use reference ISO regex allowing no timezone/compact offset. | Complete |
| A2 | Party/coverage services/schema | Restore party optional non-null UUID id/plain audit dates; coverage nullable form numbers/dates/plain string IDs/plain response dates, reference stripping behavior, coverage patch body id; restore exact public reference schema/type names. | Complete |
| A3 | Constants/mounted translations | Restore status ordering and full party filter role list; verify all mounted keys and actual reference fallback behavior, including keys absent in reference. Copy only source-defined Persian values. Common tolerant page factory remains an explicit target architecture adaptation. | Complete |
| V1 | Entire mounted closure | Focused contract and behavior tests, typecheck, lint, diff check, production build; record remaining variance explicitly. | Complete |

## Final shared-control discrepancies

Final date audit: reference `utils/format-date.ts` parses timezone-less strings with `new Date(raw)`, whereas target shared formatting normalizes them to UTC. M5 also covers passing parsed Dates at agreement table/view call sites (coverage view is already corrected) without changing unrelated shared formatting.

| ID | Source evidence | Acceptance criteria | Status |
| --- | --- | --- | --- |
| S1 | Reference `components/data-table/filter/table-filter-faceted-filter.tsx` | Keep filter title visible with selected badges, dashed compact trigger, translated search/empty/clear commands; clear immediately and cancel stale debounce. Retain target public UI primitives. | Complete |
| S2 | Reference `components/data-table/filter/table-filter-input.tsx` | Clear immediately without waiting for typing debounce; avoid transport updates on mount and cancel stale pending typing on reset. | Complete |
| S3 | Reference `components/select/searchable-select.tsx` | Coverage clearable lookups use translated `common.clear` command in popup, closing after clear, with no selectable options during loading. Add opt-in public Select capability without changing unrelated consumers. | Complete |

## Architectural adaptations and verification limits

The single-route feature retains its root page. Components use target kebab-case filenames but reference React names. Providers/stores and URL adapters remain in their target architecture owners. Schemas/types are exported publicly from `@iap/api-types`; party service ownership is separate. Request validation is stricter at the target service boundary. The accepted common page-response factory tolerates missing pagination metadata rather than requiring all reference metadata. Zod v4 `.loose()` replaces `.passthrough()` only where unknown keys are retained in the source; stripping schemas remain stripping.

Target shared UI primitives and theme tokens remain in use. Source-backed layout, labels, mounted controls and tested interactions have been ported; no browser screenshot or pixel comparison was performed, so this document does not claim pixel-identical rendering. No child routes are introduced.

## Completion evidence — 2026-10-06

- Parallel ownership: P1–P4 party UI, C1–C4 coverage UI, A1–A3 contracts/services/translations; main UI and integration owned by the parent. Shared filter fixes were isolated into S1–S2 afterward.
- Entire iap-admin test suite: 104 files / 235 tests passed with `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui`.
- Agreements suite: 16 files / 55 tests passed. Shared filter controls: 5 regression tests passed, including reset during pending debounce.
- Final combined Agreements/shared-filter run: 19 files / 66 tests passed after integration.
- UI package: 12 files / 39 tests passed, including localized popup clearing and non-selectable loading options.
- App production build (including TypeScript build) passed. App ESLint, architecture checker and `git diff --check` passed. UI, shared-lib and api-types typechecks passed.
- Actual reference and target Persian JSON compared against 150 recorded fixture entries: zero mismatches. Missing source keys deliberately retain reference fallback behavior.
- Build emits dependency annotation and large-chunk warnings; these do not fail the build. No unrelated bundle restructuring was introduced.

## Compared mounted component groups

- Root: `AgreementsPage`, private `AgreementsContent`, `AgreementProvider`, `AgreementsSection`.
- Main table/dialogs: `AgreementDataTableToolbar`, columns, `AgreementRowActions`, `AgreementFormDialog`, `AgreementViewDialog`, `AgreementDeleteMethodDialog`, `AgreementCoverageInitializeDialog`.
- Party panel: `AgreementPartyApplProvider`, `AgreementPartyApplsContentPanel`, `AgreementPartyApplsContent`, `AgreementPartyApplsTitle`, `AgreementPartyApplsActions`, toolbar, columns, row actions, form, bulk-create, view, single-delete and delete-method dialogs, `AgreementUserAccountSearchSelect`.
- Coverage panel: provider/private content, `AgreementCoverageApplsSection`, toolbar, columns, row actions, inline update, form, view and delete-method dialogs.
- Shared reference dependencies in scope: table filter text/facet/reset behavior, lookup selection/loading/clearing, readonly items, audit and confirmation dialogs, date formatting, pagination, status/role constants, schemas/services and mounted translations.
