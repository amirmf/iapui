# Shared debounce and filter timing

Status: complete. Owner: shared technical utilities and admin table filters.

## Result

The workspace now has one framework-independent trailing-debounce function in
`@iap/shared-lib`, with React lifecycle adapters in `@iap/react-hooks`. Both
apps declare the hook package dependency and consume only public package APIs.
No external runtime library or route was added.

Admin text, numeric, date/date-time and faceted filters use the shared callback
hook. Debounced lookup searches use the shared value hook or callback hook;
local timer-based search implementations were removed. Clear/reset and
controlled-value/key changes cancel unpublished filter work. Unmount and delay
changes cancel work through the hook lifecycle.

## Public contracts

- `debounce` preserves typed arguments and `this`, isolates instances, and
  exposes `cancel`, `flush` and `isPending`. Stored arguments are released on
  completion/cancellation. Calls return void; flush returns the callback result.
- `useDebouncedCallback` retains its identity while the delay is unchanged and
  invokes the latest committed callback. `isPending` is imperative.
- `useDebouncedValue` returns the initial value immediately and delays later
  changes, including empty values. Function-valued state is stored without
  invoking it; unrelated rerenders do not restart the timer.
- Owners must cancel before immediate clear/reset publication. These helpers
  do not cancel in-flight requests or handle async rejection.

Usage lives in [the function README](../../../packages/shared-lib/README.md)
and [the hook README](../../../packages/react-hooks/README.md). Future page
implementations can use the repository
[shared-debounce skill](../../../.agents/skills/shared-debounce/SKILL.md).

## Reference-backed filter timing and presentation

Source: `insurance-ui/src/components/data-table/filter/`.

| Reference component | Default delay |
| --- | --- |
| `table-filter-input.tsx` | 1200 ms |
| `table-filter-number-range-input.tsx` | 1200 ms |
| `table-filter-faceted-filter.tsx` | 1000 ms |
| `table-filter-date-range-filter.tsx` | 500 ms |
| `table-filter-date-time-range-filter.tsx` | 500 ms |

The user explicitly requested these delays in every table-filter presentation
on 2026-10-11. Explicit `debounceMs` values override the defaults. This replaces
the earlier 400ms text default and immediate numeric/facet/date defaults. Date
controls now honor their declared debounce option.

Reference numeric ranges show a compact summary button with formatted
committed values and a 360px popover containing two 32px inputs. Both ordinary
and grouped composition forward reference presentation. Grouped triggers fill
their allocated width; Assignment Rules opts into reference presentation.
Inline default numeric ranges retain their geometry and legacy keys, with
independent debounced text adapters and clear actions for each bound.

Feature route adapters retain ownership of keys and API parameters. Explicit
`fromKey`/`toKey` override default keys; grouped/reference numeric suffixes are
`__fromNum`/`__toNum`, while legacy inline defaults use `From`/`To`. Query keys,
request placement, digit normalization and trimming remain consumer-owned.

## Migrated lookup consumers

- Assignment Rules agreement search.
- User-account selection and branch-location search.
- Agreement-party user-account search.
- Claim management agreement search.
- Assessment Items text search.
- AI Assessment Rules agreement search.
- Support Questions related-question search.
- Repetitive Responses suggestion search.

A source scan found no remaining independent filter/search debounce timers or
RxJS debounce implementation. Remaining timers handle dialog cleanup, animation
or focus transitions. Customer filter forms use apply/selection behavior and
have no old debounced search to migrate. Source-specific lookup delays remain
unchanged; table-filter defaults are not applied to arbitrary searches.

## Verification

The final implementation is covered by:

- Six shared React hook tests, including StrictMode lifecycle, delay changes,
  callback freshness and object/function/undefined values.
- Nine public debounce utility tests, including latest arguments/receiver,
  cancel/flush, instance independence, zero delay, reentrancy and invalid delay.
- 37 filter tests in ten files, including exact timing boundaries, independent
  bounds, custom keys/delays, immediate clear, controlled reset and unmount.
- 23 affected consumer tests in six files covering Medical Center filter
  behavior, Assignment Rules toolbar, Claim Requests route adapters and
  Repetitive Responses search.

All listed tests passed. Shared-library and shared-hook typechecks, both app
typechecks, admin lint, hook-package lint, architecture check and diff whitespace
check passed during implementation. The commit hooks run workspace-wide
TypeScript and lint checks again before creating the commit.

An earlier accidentally broad admin test run exposed unrelated existing
failures in branch page-content requirements, bank-account response-field
expectations and medical-center null-content expectations; the whole admin
suite is not claimed to pass. No browser screenshot comparison or live-backend
verification was performed. Source/DOM tests do not prove pixel identity.
