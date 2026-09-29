# Doc Types reference-parity re-audit v2

## Scope and evidence

Reference implementation:

- `insurance-ui/src/features/doc-types/`
- `insurance-ui/src/routes/_authenticated/doc-types/`
- `insurance-ui/src/locales/fa.json`

Target implementation:

- `iap-admin/src/features/doc-types/`
- `iap-admin/src/modules/doc-types/`
- `packages/api-types/src/doc-type/`
- `iap-admin/src/app/router/routes/_authenticated/doc-types/`

This document supersedes completion claims in the earlier parity documents. A
task is marked complete only after its source change and the relevant automated
verification both succeed. Reference API operations, schemas, and Persian
translation values are treated as the source of truth; target architecture is
adapted only where `APPLICATION-ARCHITECTURE.md` explicitly requires it.

## Verified implementation tasks

- [x] **P0 — Restore form parity.** Make `DocTypeForm` use complete reference
  defaults on initialisation, edit reset, and post-create reset; use the
  reference mode-specific submit/loading translations; and remove the unsafe
  resolver type cast. Keep the target's Zod-v4 contract and public module API.
- [x] **P0 — Restore builder and sample-submission page parity.** Fetch the
  selected document type with the reference detail query key, show its name,
  use the exact reference back/open-in-new-tab translations, preserve RTL-aware
  back icons, and match the reference iframe card/layout semantics.
- [x] **P0 — Restore row-action accessibility and visual contract.** Use the
  reference `common.openMenu` accessible text and trigger state classes; retain
  the shared Radix dropdown primitive and all six reference actions.
- [x] **P1 — Align list-query composition with the reference.** Use the
  hierarchical page query key, keep the 30-second cache policy, pass a stable
  refetch callback to row actions/dialogs, and make refresh loading behavior
  match the reference unless target shared UI demands a documented equivalent.
- [x] **P1 — Reconcile page/column/dialog visual substitutions.** Compare the
  target `Main`-boundary equivalent, `TwoLineHeader`, long-text cell, JSON
  formatting, direction class, and dropdown width against their reference
  counterparts. Implement only observable parity fixes; record each required
  architecture-preserving substitution below.
- [x] **P1 — Add feature-level behavior coverage.** Test the document-type
  action menu accessible name and navigation/dialog interactions, and test form
  defaults and successful create reset behavior. Existing primitive-only
  dropdown coverage is insufficient for page parity.

## Intentional architecture adaptations (not defects)

- `features/doc-types/model/doc-type-store.ts` owns feature-local UI state in
  Zustand instead of copying the reference React context.
- `modules/doc-types` owns transport logic, consumed only through its public
  entry point. The feature must not recreate the reference service.
- `@iap/api-types` uses Zod v4 `.loose()` and the required
  `createPageRequestSchema` / `createPageResponseSchema` factories. The
  reference's `.passthrough()` and stricter pagination metadata shape cannot be
  copied because they conflict with the target architecture.
- Target table/form/dialog primitives may replace reference internals only when
  their visible behavior and accessibility contract are equivalent.
- The target authenticated application layout is the `Main`-boundary equivalent;
  no target `Main` component exists. `TwoLineHeader` and `LongText` retain the
  reference table's sortable heading and bounded-text behavior, while semantic
  `dir='ltr'` replaces the reference-only `dir-ltr` utility for JSON blocks.

## Architecture audit and remediation task

- [x] **A1 — Audit and remediate `/doc-types` against application architecture
  and project skills.** Verify thin file-based routes; feature/module ownership
  and public imports; validated route search/API boundaries; TanStack Query
  server state; scoped Zustand UI state; shared UI/forms/tables; translated Zod
  form validation; Radix dropdown keyboard/accessibility behavior; component
  prop handling; and avoidable re-renders. Fix confirmed violations and record
  evidence from lint, type checks, tests, and diff validation.
- [x] **A2 — Apply the route-directory convention to `/doc-types`.** Place the
  static list/create pages in their own route directories with an `index.tsx`
  entry. Keep dynamic identifiers out of directory names by using flat TanStack
  route files for edit/builder/submission, then regenerate the route tree.
  Route files remain thin.
- [x] **A3 — Apply the feature page-directory convention to `/doc-types`.**
  Move list, create, edit, builder, and sample-submission page components into
  matching static `features/doc-types/pages/` directories, without creating a
  `$docTypeId` directory. Keep page-only shared layout and embedded-frame
  composition in `pages/shared/`, while retaining reusable UI, model state, and
  module boundaries.
- [x] **A4 — Apply component ownership to `/doc-types`.** Group the complex
  index-page components beneath `pages/index/components/`, keep the shared
  create/edit form in `ui/doc-type-form/`, and colocate focused tests with the
  components they verify. Collapse single-file component directories; retain
  directories only where colocated tests or related implementation artifacts
  make navigation clearer.

## Completion evidence

Record command outcomes here as tasks are completed. No task should be checked
off based only on source inspection.

- `pnpm --filter iap-admin test` — passed: 19 files, 40 tests, including the
  document-type form-default and row-action interaction tests.
- `pnpm --filter @iap/ui test` — passed: 12 files, 37 tests, including Radix
  dropdown interaction coverage.
- `pnpm --filter iap-admin lint` — passed.
- `pnpm --filter iap-admin typecheck` — passed.
- `pnpm --filter @iap/ui typecheck` — passed.
- `git diff --check` — passed.
- `pnpm --filter iap-admin exec vite build` — passed after regenerating the
  route tree; Rollup reported only existing third-party Zod annotation and
  chunk-size warnings.
- The feature page-directory migration passed `pnpm --filter iap-admin
  typecheck`, `pnpm --filter iap-admin lint`, `pnpm --filter iap-admin test`
  (19 files, 40 tests), and `git diff --check`.
- The component-directory migration passed `pnpm --filter iap-admin
  typecheck`, `pnpm --filter iap-admin lint`, `pnpm --filter iap-admin test`
  (19 files, 40 tests), and `git diff --check`.
- A direct locale comparison verified that `common.notAvailable`,
  `common.openMenu`, and `common.openInNewTab` exactly equal the reference
  Persian values.
