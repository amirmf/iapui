# Medical Center table and page fresh audit

Scope: `apps/iap-admin/src/features/medical-center`, reference `insurance-ui/src/features/medical-center`. Previous completion reports do not substitute for this source review.

## Findings and tasks

- [x] T01: Toolbar reset renders literal `Reset filters`; source `components/data-table/filter/table-filter-shell.tsx` calls `t('common.resetFilter')`. Supply the exact key at the feature boundary.
- [x] T02: Shared reference text filter uses `pe-9`, end-relative enlarged clear control, and shows it for whitespace. Source `table-filter-input.tsx` uses `pe-8`, physical left positioning, and hides clear when trimmed text is empty. Restore scoped reference geometry; preserve cancellation on clear/reset/unmount as required by the parity skill.
- [x] T03: Single facet badge/options display unpublished local selection before the 1000 ms debounce. Source `table-filter-faceted-filter.tsx` resolves single selection from external URL value. Add opt-in source selection timing for this feature; preserve other consumers.
- [x] T04: URL sorting currently serializes page/size even if absent and updates on external URL changes. Source `use-sync-query-params-table-filter.ts` changes only sort/direction, keeps page/size untouched, initializes sorting once. Port source transitions into the feature route adapter while retaining thin routes.

- [x] T05: Date formatter silently substitutes `'-'` for invalid nonempty dates, whereas source throws `RangeError`. Added opt-in `invalidDate: 'throw'` and supplied it in columns; default consumers keep their original handling.
- [x] T06: Mounted Table primitive wrapper omitted source `relative`; cells omitted `whitespace-nowrap`; loading/empty and header rows inherited default hover/padding. Added scoped reference wrapper and restored reference row/cell styles.

## Verified closure

`MedicalCenterInvoicesPage` composition, heading, actions, refresh/error/retry, table loading/empty labels, four dialogs, pagination totals and columns match source JSX through public reference presentations. All six column IDs, literal `'-'`, amount formatting, disabled action conditions, state translation/color mapping and sticky left actions match. Created-at formatter passes host language and disables timezone normalization, matching source Tehran formatting for valid dates; scoped invalid-date handling also reproduces the source exception.

`Main` class list matches source. `PaginatedDataTable`, `SimpleDataTable`, `DataTableLayout`, reference pagination, sort header, table actions, tooltip, Input and facet command closure were inspected. Reference pagination copies source sizes `[10,20,30,40,50,100]`, literal English navigation labels, total-zero `'-'`, page indicator, RTL arrows and responsive buttons. Source sorting fallbacks are `common.asc` → `Asc`, `common.desc` → `Desc`, `common.reset` → `Reset`; page calls `common.retry` without a literal fallback. No date filter is mounted by this toolbar; date controls in dialogs belong to the dialog audit.

Architecture-only differences: named public feature export, package imports, `cn` conditional classes, shared reference presentations, semantic section/nav/aria labels, debounce cancellation. They preserve the architecture and accessible behavior rather than duplicate reference ownership.

## Validation

Verified: 19 affected admin tests (page, route adapter, filters, shared table), 2 date-format tests, 1 table-wrapper test; the 6 shared table tests were rerun after the final wrapper/cell changes. Admin typecheck and scoped lint passed; `git diff --check` passed. Final class-composition cleanup was submitted to the parent for integrated checks. Browser rendering and real backend checks are excluded by the user's previously accepted scope.
