# iap-admin branches reference re-audit

## Scope and source closure

- Target route: `apps/iap-admin/src/app/router/routes/_authenticated/branches/index.tsx`
- Target page: `apps/iap-admin/src/features/branches/pages/index/branches-page.tsx`
- Reference route: `insurance-ui/src/routes/_authenticated/branches/index.tsx`
- Reference page: `insurance-ui/src/features/branches/pages/branches-page.tsx`
- Reference closure reviewed file-by-file:
  - `components/branch-columns.tsx`
  - `components/branch-data-table-toolbar.tsx`
  - `components/branch-delete-dialog.tsx`
  - `components/branch-form-dialog.tsx`
  - `components/branch-row-actions.tsx`
  - `components/branch-sync-button.tsx`
  - `context/branch-context.tsx`
  - `hooks/useBranchesData.ts`
  - `services/branch-service.ts`
  - `data/branch-schema.ts`
  - mounted `branches` namespace in `src/locales/fa.json`

## Confirmed parity already present

- Route path, `crumb` loader, endpoint paths/methods, mutation payload keys, response field schemas, and mounted Persian `branches` namespace match the reference.
- The target service validates all reference request and response boundaries through `@iap/api-types`; this is a required target-architecture adaptation.
- The reference has no enum-display field or enum translation mapping in this page closure. No branches enum constant should be added.

## Discrepancy backlog

| Priority | Reference evidence | Current target discrepancy | Required target change | Status |
| --- | --- | --- | --- | --- |
| P0 | `use-sync-query-params-table-filter.ts` uses `page`, `size`, `sort`, `direction` and defaults to page size `40`; `use-table-filter-query-params.ts` resets all search keys and only resets an existing page value during filter edits. | Target used the shared `pageSize`/`sortDirection` keys and default `20`, and initially wrote default pagination/sort keys while filtering. | Add feature-owned table URL state and filter adapter using exactly the reference public query keys/default and reset/edit behavior. | Complete |
| P0 | `BranchesPage` is a `BranchProvider` + `BranchesContent`; `useBranchesData` owns the query with key `['branches', pagination, filters]`. | Target query lived directly in the page and used a different key shape. | Restore the source responsibility split under the target feature architecture, keeping the source query key, defaults, and refetch policy. | Complete |
| P0 | The reference wraps header, filters, and table in its `Main` card surface; the toolbar is inside the scroll wrapper immediately before the table. | Target had no equivalent page card and placed the toolbar outside the scroll wrapper. | Add a page-scoped equivalent visual surface using target semantics (not a nested `<main>`), and move the toolbar to the reference position. | Complete |
| P1 | Reference header actions are always clickable; refresh has no pending disable/spinner and buttons use `space-x-2`. | Target added pending disable/spinner behavior and different layout classes. | Match source action layout and interaction behavior while retaining accessible icon semantics from target primitives. | Complete |
| P1 | Reference columns render code with `|| '-'`; `unitName` and `tel` use raw table values; action-cell class order/content is source-specific. | Target replaced all nullish values with `–` and changed action-cell presentation metadata. | Match reference column output and action-cell class contract. | Complete |
| P1 | Reference create/edit form has separate mutations, no required indicators, no pending disable, and resets only after successful create. | Target combined mutations, added required indicators, disabled the submit/close path during mutation, and reset each time create opened. | Restore the reference form lifecycle and field presentation; preserve target `@iap/forms` primitives only where equivalent. | Complete |
| P1 | Reference delete dialog is destructive without a status icon. | Target `ConfirmDialog` could express a destructive action only through `variant='error'`, which adds a status icon absent from the reference. | Add the minimal `@iap/dialogs` public capability for a destructive confirm button without a status icon; consume it from the branches dialog. | Complete |
| P1 | `branch-delete-dialog.tsx` does not pass mutation pending state to the reference ConfirmDialog. | Target passed `isLoading`, disabling close/cancel/confirm while deletion was pending. | Do not pass pending state from the branches delete dialog. | Complete |
| P2 | Reference uses Tabler icon sizes (18px for header/sync, 16px for actions) and explicit tooltip strings. | Target used default Lucide sizing and relied on default tooltip text. | Normalize icon sizing and make tooltip text explicit. | Complete |
| P2 | Source `BranchProvider` resets transient dialog state when the page unmounts. | Target had an equivalent cleanup directly in `BranchesPage`. | Keep the behavior but restore the provider/content component boundary to match the reference closure. | Complete |

## Completion criteria

- All P0/P1 discrepancies are implemented and verified against the listed reference files.
- Tests cover the reference URL contract, query key/defaults, API placement and schema failure, translations, and visible action/form behavior.
- `pnpm --filter iap-admin test`, `typecheck`, `lint`, and `git diff --check` pass with `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui` for reference-locale tests (42 files, 97 tests).
