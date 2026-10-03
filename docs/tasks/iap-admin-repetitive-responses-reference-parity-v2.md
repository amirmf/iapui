# Repetitive responses reference parity v2

## Status

Audit complete; implementation in progress. This document supersedes the
completion claim in `iap-admin-repetitive-responses-page-parity.md` for UI
parity. The reference is authoritative for behavior, API usage, schemas, and
mounted Persian translations.

## Compared closure

- `insurance-ui/src/routes/_authenticated/repetitive-responses/index.tsx`
- Every file under `insurance-ui/src/features/repetitive-responses/`
- `insurance-ui/src/locales/fa.json`: only `repetitiveResponses` and
  `repetitiveResponseGroups`

## Confirmed parity

- [x] The target authenticated route is thin and exports
  `RepetitiveResponsesPage` from the owning feature.
- [x] Persian locale namespaces are copied verbatim and have a source-value
  parity test.
- [x] Endpoint names, HTTP verbs, default sizes (20 response / 30 group),
  request placement, and request/response fields are service-tested against
  the reference.
- [x] Public Zod schemas use target-required strict request wrappers and loose
  response objects, preserving all verified source fields and nullish values.

## Concrete discrepancies

### P0 — visible behavior

- [ ] `RepetitiveResponsesPage` renders an additional page-level
  `RepetitiveResponseFormDialog`; reference mounts it inside
  `RepetitiveResponsesSection`. Move it so the page closure and dialog
  lifecycle match reference exactly.
- [ ] `RepetitiveResponsesSection` is missing the source-owned local sorting
  state and lacks `onSortingChange`, `sorting`, and `manualFiltering` table
  wiring.
- [ ] Response selection is not cleared on pagination change and delete close,
  unlike the reference.
- [ ] Response delete opens for any selected row; reference first resolves the
  selected response into the feature current row before opening the dialog.
- [ ] Response view close must clear `currentRow` after the source delay;
  target only closes its modal state.
- [ ] Group table must follow the source lifecycle: current selected group is
  synchronized only when no group dialog is open, and selection is cleared at
  source-equivalent transitions.
- [ ] Group and response destructive actions are missing source
  `useIsSuperAdmin` permission gating. Port the target-equivalent permission
  hook/guard without changing source-visible action availability.

### P1 — forms and dialogs

- [ ] `RepetitiveResponseFormDialog` is not source-equivalent: it uses local
  component state instead of the translated Zod/RHF form, does not reset from
  the current row, does not load/display the selected group, does not show
  source create/update errors, and does not preserve the source close/reset
  semantics.
- [ ] `RepetitiveResponseGroupFormDialog` must reset when its row/open mode
  changes; its resolver currently uses an unsafe cast and lacks source create/
  update error feedback and source close/reset behavior.
- [ ] `RepetitiveResponseViewDialog` must query and display the group title;
  current target omits the group section entirely.
- [ ] Delete dialogs must use the source entity labels, no-selection error
  behavior, success feedback, and targeted query invalidation sequencing.

### P1 — textarea and table integration

- [ ] `RepetitiveResponseTextarea` is only a textarea wrapper. Port the
  reference’s debounced suggestion query: focus gating, minimum query length
  3, 700 ms debounce, maximum 20 results, loading/error/empty states, popover
  width measurement, keyboard-safe focus/blur behavior, and selection callback.
- [ ] Mount `RepetitiveResponseTextarea` as the response description field in
  the RHF dialog, including its controlled `onValueChange` behavior.
- [ ] Table filters must use the target filter adapter to retain source table
  behavior while stripping undefined/UI-only filter keys before service calls.

### P2 — component and quality parity

- [ ] Split compressed one-line JSX in every target component into the small,
  readable source-equivalent units; preserve source component export names.
- [ ] Match source column metadata (`sticky`, action width) and per-cell
  classes.
- [ ] Add missing focused tests: store lifecycle, response/group row actions,
  group selection filtering, response selection/deletion lifecycle, form
  defaults and mutations, textarea threshold/debounce/selection, and page
  composition order.

## Completion criteria

- Each item above is checked only after a focused test passes.
- The target route/page and every source-named mounted component has a
  file-by-file parity review.
- Run `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui
  pnpm --filter iap-admin test`, `typecheck`, `lint`, and `git diff --check`.
