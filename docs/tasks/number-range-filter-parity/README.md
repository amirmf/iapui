# Number range filter component parity

Status: historical implementation evidence. The latest timing audit is recorded
in `docs/tasks/shared-debounce/README.md`; its all-presentation timing decision
supersedes the original immediate-default notes below.
Priority: high. Owner: iap-admin shared table filters.

## Source evidence

- Reference: `insurance-ui/src/components/data-table/filter/table-filter-number-range-input.tsx`, `table-filter-input.tsx`, and `table-filter-content.tsx`.
- Target: `apps/iap-admin/src/shared/tables/filter/table-filter-number-range-input.tsx`, `table-filter-content.tsx`, and `grouped-table-filter-item.tsx`.
- Consumers: Claim Requests grouped filters and Assignment Rules toolbar.

The target rendered two inline inputs instead of the reference summary button
and popover. It published immediately, omitted individual clear controls, and
ignored reference presentation in both filter composition paths. Assignment
Rules did not opt into reference presentation.

## Completion criteria and implementation

Restore the reference compact summary, comma formatting, muted empty labels,
360px popover, 32px inputs, independent clear controls and 1200ms debounce.
Forward reference presentation through ordinary and grouped filters; preserve
full-width grouped triggers. Honor explicit range keys and optional debounce,
input and popover classes. Opt Assignment Rules into reference presentation.
Keep legacy default consumers and their immediate inline inputs unchanged.

Use public workspace primitives and the existing cancellable TableFilterInput
adapter. Clearing and reset/unmount cancel unpublished updates; this retains
the target's existing protection against stale filter restoration. API services
and feature-owned URL adapters remain unchanged.

## Verification

Passed:

- Focused filter and Assignment Rules toolbar suite: 32 tests in 11 files.
- Admin TypeScript check and full admin lint.
- Architecture check and `git diff --check`.
- Focused lint for the two updated integration/toolbar tests.

Tests cover summary formatting, debounce, digit normalization, clear
cancellation, explicit keys/delay, reset remount, both composition paths and
unchanged defaults. Existing grouped-range tests now open the popover and
verify delayed publication instead of expecting immediate inline inputs.

An earlier test command accidentally ran the broader admin suite and was
stopped. It exposed unrelated failures in branch page-content requirements,
bank-account response-field expectations and medical-center null-content
expectations. Those files were unchanged; the complete admin suite is not
claimed to pass.

No browser screenshot comparison or live-backend verification was performed;
source and DOM tests do not establish pixel-identical rendering.
