# Repetitive responses reference parity v2

## Status

Audit complete; implementation complete. This document supersedes the
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

- [x] `RepetitiveResponsesPage` mounts `RepetitiveResponseFormDialog` only
  through `RepetitiveResponsesSection`, preserving the reference composition
  and dialog lifecycle.
- [x] `RepetitiveResponsesSection` owns the source-equivalent sorting state,
  `onSortingChange`, `sorting`, and `manualFiltering` table wiring.
- [x] Response selection is cleared on pagination changes and after delete
  dialog close.
- [x] Response delete resolves the selected response into feature state before
  opening the dialog.
- [x] Response view close clears `currentRow` after the reference delay.
- [x] The group table synchronizes the selected group only while no group
  dialog is open and clears selection at source-equivalent transitions.
- [x] Group and response destructive actions use target-equivalent
  super-admin permission gating.

### P1 — forms and dialogs

- [x] `RepetitiveResponseFormDialog` uses a translated Zod/RHF form, resets
  from the current row, displays the selected group, and keeps source create/
  update feedback and close/reset semantics.
- [x] `RepetitiveResponseGroupFormDialog` resets when its row or open mode
  changes, uses the typed resolver pattern, and preserves source feedback and
  close/reset behavior.
- [x] `RepetitiveResponseViewDialog` queries and displays the group title.
- [x] Delete dialogs use the source entity labels, no-selection error
  behavior, success feedback, and targeted query invalidation sequencing.

### P1 — textarea and table integration

- [x] `RepetitiveResponseTextarea` implements the
  reference’s debounced suggestion query: focus gating, minimum query length
  3, 700 ms debounce, maximum 20 results, loading/error/empty states, popover
  width measurement, keyboard-safe focus/blur behavior, and selection callback.
- [x] `RepetitiveResponseTextarea` is mounted as the response description field in
  the RHF dialog, including its controlled `onValueChange` behavior.
- [x] Table filters use the target filter adapter to retain source table
  behavior while stripping undefined/UI-only filter keys before service calls.

### P2 — component and quality parity

- [x] Compressed one-line JSX is split into small,
  readable source-equivalent units; preserve source component export names.
- [x] Source column metadata (`sticky`, action width) and per-cell classes are
  preserved.
- [x] Focused tests cover store lifecycle, group selection filtering, group
  form reset, textarea threshold/debounce/selection, service contracts,
  translations, columns, and page composition order.

## Completion criteria

- Each item above was checked through a file-by-file reference review and the
  focused test suite; behavior with existing shared UI primitives follows the
  target architecture.
- The target route/page and every source-named mounted component has a
  file-by-file parity review.
- Run `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui
  pnpm --filter iap-admin test`, `typecheck`, `lint`, and `git diff --check`.
