# Shared library

Framework-independent utilities exposed through `@iap/shared-lib`. Both
`iap-admin` and `iap-app` import the package's public entry point.

## Debounce

```ts
import { debounce } from '@iap/shared-lib'

const publishSearch = debounce((query: string) => {
  updateSearch(query)
}, 700)

publishSearch('first')
publishSearch('latest') // Only this call executes after 700 ms of inactivity.
publishSearch.isPending()
publishSearch.cancel() // Clear/reset/disposal: discard unpublished work.
publishSearch.flush() // Execute pending work immediately, at most once.
```

Create one instance per independent operation. The latest arguments and method
receiver (`this`) are preserved. Calls return `void`; `flush()` returns the
callback result, or `undefined` if nothing is pending. Async callbacks are
supported, but this utility does not cancel in-flight requests or handle their
rejections. Delay must be finite and between 0 and 2147483647 milliseconds;
zero still schedules a later timer task. Timers are created only when called.

In React, retain the instance across renders and cancel on unmount. Cancel
before immediately publishing a cleared value, and when controlled values or
filter identifiers change. Do not recreate an event-driven debounce on every
render. `useDebouncedCallback` from `@iap/react-hooks` supplies this lifecycle
adapter for both apps and uses the latest committed callback. Effect-owned search debounces
create their instance in the effect and return `cancel` as cleanup.

Filter delays match the reference in both default and reference presentations:
text/number 1200 ms, facets 1000 ms, dates/date-time 500 ms. Explicit
`debounceMs` configuration overrides these defaults.

The public utility is tested in admin's `src/shared/hooks/debounce.test.ts`.
React adapters are tested beside their owners in `packages/react-hooks`,
alongside admin filter integration tests.
