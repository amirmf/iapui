# iap-admin repetitive responses page reference parity

## Status

Implemented in `codex/iap-admin-repetitive-responses`; full-suite verification
is recorded below. The remaining source-parity gaps are tracked explicitly
under the implementation tasks.

## Source of truth

- Reference route:
  `insurance-ui/src/routes/_authenticated/repetitive-responses/index.tsx`
- Reference feature:
  `insurance-ui/src/features/repetitive-responses/`
- Reference Persian locale namespaces: `repetitiveResponses` and
  `repetitiveResponseGroups` in `insurance-ui/src/locales/fa.json`

## Component availability audit

The target already provides reusable application primitives for forms, tables,
table filters, dialogs, confirmation/delete flows, buttons, permissions,
translations, TanStack Query, and Zod. The following page-specific owners do
not exist in `iap-admin` and must be implemented from source-backed behavior.
Their exported component names are locked to the reference; target folders may
differ only to follow the feature and page ownership rules.

- `RepetitiveResponsesPage`, `RepetitiveResponseGroups`, and
  `RepetitiveResponsesSection`.
- `useRepetitiveResponseGroupColumns`,
  `RepetitiveResponseGroupDataTableToolbar`,
  `RepetitiveResponseGroupRowActions`, `RepetitiveResponseGroupFormDialog`,
  `RepetitiveResponseGroupViewDialog`, and
  `RepetitiveResponseGroupDeleteMethodDialog`.
- `useRepetitiveResponseColumns`, `RepetitiveResponseDataTableToolbar`,
  `RepetitiveResponseRowActions`, `RepetitiveResponseFormDialog`,
  `RepetitiveResponseTextarea`, `RepetitiveResponseViewDialog`, and
  `RepetitiveResponseDeleteMethodDialog`.
- `RepetitiveResponseProvider`, `useRepetitiveResponseStore`,
  `useRepetitiveResponse`, and `useRepetitiveResponseGroup`.
- Repetitive-response and response-group API services, public Zod contracts,
  query/cache wiring, route search state, and mounted locale closure.

## Implementation tasks

- [x] Create public API contracts for repetitive responses and response groups,
  including paged responses and strict request objects.
- [x] Add service tests first, then implement every source-backed endpoint with
  validated request/response boundaries.
- [x] Add the feature model: translated form schemas, URL table state, and
  feature-scoped dialog/selection state.
- [x] Port the exact mounted Persian locale keys and add a source-value parity
  test.
- [x] Implement the response-group table, filters, actions, dialogs, and
  mutations with focused UI tests.
- [x] Complete response-textarea suggestion parity: source debounces at 700 ms,
  searches only at three characters, and displays at most 20 saved responses.
- [x] Add focused UI tests for response/group action, dialog, table-filter, and
  mutation behavior, including source row-action transitions, response
  selection-to-delete behavior, provider cleanup, form reset, and textarea
  threshold/debounce/selection.
- [x] Compose the public page and thin authenticated route; register navigation
  only after verifying a matching target navigation location.
- [x] Run full targeted verification and record the commands/results here.

## Verification evidence

2026-10-03:

- `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui pnpm --filter iap-admin test` — 64 files, 140 tests passed.
- `pnpm --filter iap-admin typecheck` — passed.
- `pnpm --filter iap-admin lint` — passed.
- `git diff --check` — passed.

## Baseline evidence

On 2026-10-03, the unmodified iap-admin test suite completed with five failed
translation-parity tests because their reference repositories are not present
at their assumed paths. The affected tests belong to claim requests, branches,
coverages, and bank accounts. This page's verification will set
`INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui`.

## Completion criteria

- All source-backed page behaviors, API contracts, and mounted translations
  are covered by passing focused tests.
- The authenticated route is thin and the feature follows documented ownership
  boundaries.
- iap-admin typecheck, lint, relevant tests, and `git diff --check` succeed.
