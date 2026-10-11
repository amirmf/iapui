---
name: shared-debounce
description: Use the shared IAP debounce function and React hooks when implementing or refactoring delayed filter input, lookup search, or other debounced callbacks in iap-admin and iap-app.
---

# Shared Debounce

## Choose the existing public API

- Framework-independent code uses `debounce` from `@iap/shared-lib`.
- React event handlers use `useDebouncedCallback` from `@iap/react-hooks`.
- Queries consuming delayed state use `useDebouncedValue` from
  `@iap/react-hooks`. Keep query keys and API inputs in the feature.
- Admin pages import table filters from `@shared/tables`; do not copy private
  filter controls or add another debounce around an already debounced control.

Read [the hook contract](../../../packages/react-hooks/README.md) when choosing
between callback and value behavior, and
[the function contract](../../../packages/shared-lib/README.md) for imperative
code. Both hooks use the one shared timer implementation. The shared-lib
package remains independent of React.

## Preserve filter behavior

The user accepted these defaults for **all** admin table-filter presentations:

| Control | Delay |
| --- | --- |
| Text and number range | 1200 ms |
| Faceted selection | 1000 ms |
| Date and date-time range | 500 ms |

`debounceMs` explicitly supplied by a consumer overrides the default. Do not
reuse these defaults for unrelated lookup searches; preserve their verified
source timing. Reference number ranges use a summary trigger and popover, with
independent debounced lower/upper inputs. Default ranges keep inline geometry
but have the same 1200ms timing. Inspect the reference and feature route schema
before choosing keys: reference/grouped numeric keys are `__fromNum`/`__toNum`,
while legacy default keys are `From`/`To`; explicit `fromKey`/`toKey` take priority.

Clear/reset must cancel unpublished work before applying cleared values
immediately. Cancel pending edits when their control ID, query key, or externally
controlled value changes. Global reset remounts filter content to discard
unpublished edits even when no committed value exists. Do not flush on reset or
unmount. Keep each numeric bound independent so editing one does not discard a
pending edit to the other.

## React lifecycle details

The callback hook keeps its identity while the delay is unchanged and invokes
the latest committed callback. It cancels on delay change/unmount; the owner
still handles external-value/key cancellation. Avoid creating `debounce(...)`
during every render. `isPending()` is imperative and does not trigger renders.

The value hook returns the initial value immediately and delays subsequent
updates, including empty values. Use the callback hook for filters that require
immediate clearing. Use stable object identities where relevant. Async
callbacks do not automatically cancel requests or handle rejected promises;
request cancellation stays with the existing query/transport owner.

Do not replace ordinary dialog/animation/focus timers merely because they use
`setTimeout`. Migrate actual debounce behavior, preserving the consumer's
trimming, selected-value and request semantics.

## Verify meaningful transitions

Use fake timers to verify inactivity boundaries, latest values/callbacks,
independent numeric bounds, explicit delays, immediate clear and reset/unmount
cancellation. Check unrelated rerenders do not discard pending work. Reuse the
package hook tests and admin filter regression tests when changing shared code;
typecheck both applications and run the architecture check.
