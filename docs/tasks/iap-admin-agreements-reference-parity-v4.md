# Agreements fresh component audit V4

## Scope

Audit the current worktree, not prior completion labels. Source: `/home/sadegh/Android/project/insurance-ui/src/routes/_authenticated/agreements/index.tsx`, its `AgreementsPage` and every mounted branch. Target: `/home/sadegh/.codex/worktrees/iap-admin-agreements`. Preserve architecture owners, kebab-case files, strict request schemas and the approved common page factory. Product behavior and source translation fallbacks are not architectural exceptions.

## Verified tasks (documented before implementation)

| ID | Evidence | Discrepancy / acceptance | Status |
| --- | --- | --- | --- |
| P1 | Source party bulk delete delegates to shared delete-method mutations; target party delete-method lines31–40 | Restore source hard/soft success toast keys, non-awaited invalidation and mutation/global error path. | Complete |
| P2 | Source SearchableSelect lines58–60,134–146; target user search lines45–60 | Popup `common.clear` command and preserve/clear selected values absent from refreshed options. Restore source search placeholder in role select. | Complete |
| P3 | Source party delete lines49–57 and bulk dialog lines99/102/134/137 | Remove invented single-delete icons/error badge; restore preview header colors and mounted content wrappers. Restore source Tabler action glyphs; destructure helper props per target skill. | Complete |
| C1 | Source coverage toolbar and TableFilterInput default1200; target default400 | Explicit source debounce1200. Source Main header offset and Tabler glyphs in coverage controls. | Complete |
| C2 | Source coverage form DatePicker has no onClear; target DatePicker always clearable | Add opt-in public non-clearable dates and use at main/party/coverage form fields and delete date where source has no clear action. | Complete |
| C3 | Source coverage view line113 `t('common.close','Close')`; reference locale lacks key | Preserve literal source fallback `Close` without altering global target translation. | Complete |
| A1 | Source service APIs vs target split party owner | Export and consume exact reference service method names; keep service ownership split and compatibility aliases only where needed. Recheck nested response schemas. | Complete |
| A2 | Coverage full embeds damageCode.pricing; target damage-code pricing regex is stricter than source pricing schema | Restore source ISO acceptance for nested pricing contract and source validation messages; regression tests with optional seconds/timezone. | Complete |
| T1 | Source DataTablePagination vs target shared pagination | Source Persian keys, page sizes10/20/30/40/50/100, compact visibility, counts, dimensions, RTL arrows and first/last responsive visibility. Add opt-in reference presentation so unrelated consumers are preserved. | Complete |
| T2 | Source PaginatedDataTable vs target shared table | Source loading/empty/no-results/selection translation keys, no invented filter-based empty message; source row/status layout and source cell missing-value ASCII `-`. | Complete |
| T3 | Source DataTableColumnHeader uses DropdownMenu/Radix icons and common.asc/desc/reset; target uses Popover/Lucide and English defaults | Restore source keyboard menu, exact keys/icons/sizing via opt-in reference header; propagate through main TwoLineHeader. Copy source-defined asc/desc translations. | Complete |
| F1 | Source TableFilterContent and Shell; target shared filter layout | Source mobile column/sm row, -mx-2/gap-y-2; my-4 shell, secondary compact reset/X, source expand/reset layout. Isolate presentation from unrelated consumers. | Complete |
| F2 | Source filter/table-filter-date-range-filter.tsx default500ms and date-picker/date-range-picker.tsx; target filter immediate updates and DateRangePicker class applied only to popup | Source 500ms local debounce, correctly sized wrapper/trigger h8, ASCII separator, popup p3 and source date labels. Keep dates clearable here (source onClear exists), cancel pending on reset. Opt-in reference presentation. | Complete |
| D1 | Source DeleteMethodDialog lines124–209 vs target package lines133–207 | Source width, two-column grid/gap4, confirmation title/icon/header, date width240, ghost back, grouped footer, primary soft confirmation, reset300ms. Keep mutations/toasts feature-owned; add scoped presentation API if needed. | Complete |
| S1 | Source SearchableSelect lines75–104,122–146 vs target Select lines172–288 | Add opt-in reference select presentation: source trigger/chevron/search/list/option dimensions, popup clear command and retain scalar clearing when option absent. Preserve unrelated consumers. | Complete |
| D2 | Source Dialog lines62–133 vs target UI Dialog lines53–117 | Add opt-in reference dialog presentation: max-height95vh and overflow-auto, padding6/rounded-lg/background, directional close glyph, header/title/description alignment. Preserve unrelated consumers. | Complete |
| U1 | Source components/ui/button.tsx and badge.tsx; mounted facet badges and date-range trigger | Restore source disabled/ghost Button styles and Badge width/overflow/focus styles through opt-in reference presentation, including shared mounted controls. Preserve defaults for other pages. | Complete |
| M1 | Main section/actions/form/view/initialize compared against direct source | Restore exact source Tabler glyphs and missing Main offset; verify every table column/action; main bulk delete has same missing mutation/toast issue as P1. | Complete |
| V1 | Entire closure and shared dependencies | Focused regression tests, all app tests with actual source path, typecheck/lint/architecture/diff/build. Record inventory and remaining verification limits explicitly. | Complete |

## Initial verified matches

Additional main audit: reference `SingleSelect` defaults `canClear=true`, but target status Select is not clearable. Source table template/location use truthy fallback while target used null-only fallback. Source `TableActionButton` destructive means a ghost red hover action, not a filled destructive button. Add to M1/T2: source clearable status, falsy text fallback, status predicate and scoped ghost action colors. Add to D1: default ConfirmDialog reference text-left header/plain structure via opt-in presentation; no invented icon/badge for party deletion or initialize.

Root `AgreementsPage`/private `AgreementsContent` composition, grid layout, four main dialog mounts and selected first agreement passed to coverage match. Party provider lifecycle, 40-row/minimum-page defaults, content/header/title layout, role lists/order, create payload and query filters match. Main form grouping and field labels, no mounted description, readonly field order and source mutation success sequence match.

M1 route metadata: source route loader returns `{ crumb: 'agreement' }`, target lacks it. Restore source thin route loader alongside target search validation.

## Verification boundary

U1 final primitive evidence: source Button uses disabled:bg-muted/text-muted-foreground and accent ghost hover; target lacks disabled background/text and uses gray ghost hover. Source Badge includes w-fit/overflow-hidden, target omits both. Restore opt-in `presentation='reference'` primitive styles on mounted feature/shared reference controls; default consumers unchanged. Input and ReadonlyItems visible styles already match source.

F1 also includes verified facet keyboard discrepancy: target popup used standalone buttons, source uses cmdk Command navigation/search/groups. Port cmdk through the public UI package rather than duplicating keyboard behavior. Table layout wrapper/header/status geometry is covered by T2 through opt-in reference presentation.

D1 shared AlertDialog evidence: source `components/ui/alert-dialog.tsx` overlay black/50 (line37), content rounded-lg/bg-background/p6/sm:max-w-lg (line55), header center/directional desktop (line72), title text-lg/font-semibold (line103), description text-sm/muted (line116). Target package uses background/80 overlay, rounded-xl/surface-elevated/p5 and unstyled title/description aliases. Port opt-in inherited reference presentation and preserve other consumers.

Source comparison is file-based. Passing tests is not proof of pixel-identical rendering. Browser verification will be recorded only if actually performed. Shared primitives must not be exempted from visible parity merely because they belong to a shared package.

## Compared closure and target ownership

The V3 inventory remains the detailed baseline; this audit rechecked its mounted closure plus the previously mismatching shared primitives. Source paths below are relative to `insurance-ui/src`; target owners are relative to `apps/iap-admin/src/features/agreements` unless stated otherwise.

| Source owner | Compared React components / behavior | Target owner |
| --- | --- | --- |
| `routes/_authenticated/agreements/index.tsx`, `features/agreements/pages/agreements-page.tsx` | `AgreementsPage`, private `AgreementsContent`, thin route metadata; two-column main/party layout, first selected agreement coverage input, four dialog mounts | Root `agreements-page.tsx`; thin application route |
| `features/agreements/components` | `AgreementsSection`, `AgreementDataTableToolbar`, agreement columns, `AgreementRowActions`, `AgreementFormDialog`, `AgreementViewDialog`, `AgreementDeleteMethodDialog`, `AgreementCoverageInitializeDialog` | `components/` |
| `features/agreements/pages/agreement-party-appls-page.tsx` and party components | `AgreementPartyApplsContent`, `AgreementPartyApplsContentPanel`, `AgreementPartyApplsTitle`, `AgreementPartyApplsActions`, `AgreementPartyApplDataTableToolbar`, party columns, `AgreementPartyApplRowActions`, `AgreementPartyApplFormDialog`, `AgreementPartyApplBulkCreateDialog`, `AgreementPartyApplViewDialog`, `AgreementPartyApplDeleteDialog`, `AgreementPartyApplDeleteMethodDialog`, `AgreementUserAccountSearchSelect` | `components/agreement-party-appls/` |
| `features/agreement-coverage-appls/components` | `AgreementCoverageApplsSection`, private content, `AgreementCoverageDataTableToolbar`, coverage columns/inline editing, `AgreementCoverageApplRowActions`, `AgreementCoverageApplFormDialog`, `AgreementCoverageApplViewDialog`, `AgreementCoverageApplDeleteMethodDialog` | `components/agreement-coverage-appls/` |
| Feature context files | Agreement, party and coverage providers/store lifecycle, query keys, selections and dialog resets | `context/provider/`, `context/store/`; URL integration in `route-adapters/` |
| `components/data-table` and filter children | Paginated/simple tables, column header/two-line cells, action button, pagination, filter shell/text/facet/date range/reset/URL state | Application `shared/tables/`; scoped reference presentation preserves other consumers |
| `components/ui`, `components/select`, date-picker and common dialog components | Button, Badge, Input, ReadonlyItems, Select, Dialog/AlertDialog, ConfirmDialog/DeleteMethodDialog, DatePicker/DateRangePicker; audit flow remains shared | Public `@iap/ui` and `@iap/dialogs` APIs |
| `constants/agreements-constant.ts`, `locales/fa.json` | Status map/colors/order and role map; seven creation roles versus nine filter roles; exact mounted translations and absent-key fallbacks | `constants/`; application Persian locale |
| Agreement and coverage data/services | API names, verbs/paths/payload/query placement, validation and full nested responses | Feature `services/`; public schemas in `@iap/api-types` |

## Source-backed contract checkpoints

- Main source: `features/agreements/services/agreement-service.ts`, `data/agreement-schema.ts`. GET `/agreements/page` and `/agreements/page-full`; POST `/agreements`; PUT `/agreements/:id` includes body `id`; PUT `/agreements/soft-delete` uses an ID-array body and optional query `thruDate`; DELETE `/agreements/bulk-delete` uses an ID-array body. Canonical response names include `agreementSchema`, `pageAgreementSchema`, `pageAgreementFullSchema`.
- Party source: the same reference service and `data/agreement-party-appl-schema.ts`. GET `/agreement-party-appls/page-full` retains singular public arguments `agreementId`/`userAccountId` and serialized `__in` queries; POST `/agreement-party-appls/bulk-create` and `/bulk-create-with-role`; PUT `/agreement-party-appls/soft-delete`; DELETE `/agreement-party-appls/bulk-delete`. Exact canonical methods are consumed despite the separate target service owner. Canonical responses include `agreementPartyApplSchema`, `pageAgreementPartyApplSchema`, `pageAgreementPartyApplFullSchema`.
- Coverage source: `features/agreement-coverage-appls/services/agreement-coverage-appl-service.ts` and `data/agreement-coverage-appl-schema.ts`. GET `/agreement-coverage-appls/page-full`; POST `/agreement-coverage-appls`; PATCH `/agreement-coverage-appls/:id` includes body `id`; POST `/agreement-coverage-appls/initialize` uses `{ agreementId }`; PUT `/agreement-coverage-appls/soft-delete`; DELETE `/agreement-coverage-appls/bulk-delete`. Canonical responses include `agreementCoverageApplSchema`, `pageAgreementCoverageApplFullSchema`.
- Nested coverage/damage-code/pricing response validation, optional dates/numbers/IDs and invalid calendar-date cases are covered by contract tests. Outgoing request strictness and tolerant page metadata remain explicitly approved architecture adaptations; source names and field behavior are not replaced with invented contracts.

## Constants review

Enum translation keys are centralized, typed against public schema-inferred enums, and consumed via option builders. Source status order is `ACTIVE`, `INACTIVE`, `DRAFT`, `EXPIRED`, `TERMINATED`. The distinct creation-role subset is deliberate source behavior, not duplicate inconsistent translation storage. No translated labels are persisted in stores. Compatibility aliases retain existing public names without duplicating map values.

## Verification evidence — 2026-10-06

- Parallel implementation ownership: party controls/dialogs (P1–P3/D1), coverage/Select/Dialog/date-range (C1–C3/S1/D2/F2), contracts/services (A1–A2) and sorting regression tests (T3). Parent owned main UI, shared table/filter capabilities and integration. Shared-file changes were sequenced to avoid overlapping edits.
- Entire iap-admin suite with the actual reference path: **109 files / 257 tests passed**. Includes request verb/path/body/query assertions, nested invalid schema cases, provider/selection lifecycle, pending deletion/error behavior, form validation, literal fallback labels, column actions and URL state.
- Entire UI package: **13 files / 43 tests passed**. After the final shared Button/Badge propagation, shared filter/table regression tests were rerun: **6 files / 20 tests passed**, followed by the entire UI suite again (**43 passed**).
- App TypeScript and ESLint passed; UI/dialogs/api-types/shared-lib typechecks passed. Architecture checker and `git diff --check` passed. Scoped Prettier verification passed. Final production build, including TypeScript build, passed after the last shared-control changes.
- A direct programmatic comparison of the actual reference Persian JSON, target Persian JSON and recorded fixture verified **161 entries / zero mismatches**. Source-absent keys deliberately retain source fallbacks; coverage view's literal `Close` is intentional even though the application-wide target locale has `common.close`.
- Source translation keys, option order and enum colors were retained. Shared reference-only presentation is opt-in; unrelated consumers keep existing defaults. Lockfile formatting was normalized so its change contains only the required icon dependencies.
- Browser inventory was attempted. No authenticated page was available; Chrome connection returned `Codex auth token is unavailable`. **No screenshot comparison or live backend end-to-end verification was performed.** Code/contract parity is verified within the audited closure; pixel-identical rendering is not claimed.
- Existing dependency annotation and large-chunk build warnings are nonfatal. No unrelated bundle restructuring was introduced. This evidence describes the pre-integration audit on `codex/iap-admin-agreements`; final handoff is recorded below.

## Reusable guidance and handoff preparation

Integration task H1 — Complete: current main `2a7fe09` changed
`useTableFilterState` to a structured initial state and transition callbacks.
Adapt the party/coverage consumers and the filter test harness to this public
API. Source `components/data-table/filter/use-table-filter-state.ts` preserves
the current page on ordinary filter changes but resets to page zero on explicit
reset. The user explicitly selected the current main-branch contract for this
integration issue: filter changes reset pagination to page zero. Keep 40-row
defaults, use main's public callbacks unchanged, and do not introduce a hook
option to bypass this behavior. Add a feature regression and rerun integrated
tests and quality gates. This is an accepted variance from the reference.

Final integration evidence: the combined branch includes main `2a7fe09` and
feature commit `2d7b444`. The shared `useTableFilterState` implementation is
identical to main; only its feature consumers and test harness were adapted.
The coverage regression verifies page/selection reset on filter change.
After the user's main-precedence decision, the entire admin suite passed
**110 files / 258 tests**, UI passed **13 files / 43 tests**, and app
typecheck/lint, architecture checks, diff checks and production build passed.
The 161-entry translation comparison still reports zero mismatches. Both
updated skills passed the skill validator. Browser/live-backend verification
limitations above remain unchanged.

- Added `docs/architecture/REFERENCE-PAGE-CONTROLS.md` to explain the scoped public capabilities and source-backed behavioral pitfalls for subsequent pages.
- Updated the existing `reference-page-parity` and `shared-dialogs` skills rather than creating overlapping skills. Historical task documents now point directly at V4.
- User authorized commit, local main integration, worktree removal and task-owned server cleanup on 2026-10-06. Revalidate the combined branch against the current main before removal; do not close unrelated listeners or remove unrelated worktrees.
