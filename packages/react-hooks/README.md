# React hooks

Reusable React lifecycle adapters shared by iap-admin and iap-app. Import only
from `@iap/react-hooks`. Both debounce hooks use `debounce` from
`@iap/shared-lib`; the framework-independent package does not depend on React.

## Debounced callback

Use for filter events or any side effect that needs explicit cancellation.

```tsx
import { useDebouncedCallback } from '@iap/react-hooks'

const publish = useDebouncedCallback((value: string) => {
  onValueChange(value.trim() || undefined)
}, 1200)

// In an input handler:
publish(nextValue)

// On clear/reset, cancel before publishing the empty value immediately:
publish.cancel()
onValueChange(undefined)
```

The callback exposes `cancel()`, `flush()` and `isPending()`. Its identity stays
stable while the delay is unchanged; pending calls use the latest committed
callback. Changing the delay or unmounting cancels pending work. When the
filter's identity or externally controlled value changes, its owner should
also cancel pending edits. `isPending()` is an imperative query, not reactive
state. Async callbacks do not cancel in-flight requests or handle rejections.

## Debounced value

Use when a query consumes a delayed value:

```tsx
import { useDebouncedValue } from '@iap/react-hooks'

const [search, setSearch] = useState('')
const debouncedSearch = useDebouncedValue(search, 700)
```

The initial value is available immediately. Later values publish after the
configured period of inactivity. An unrelated rerender does not restart the
timer; a new value or delay does. Unmount cancels pending work. Values follow
React's identity comparison: stabilize objects when necessary. Function values
are stored as values and never invoked by the hook.

Use the callback hook when clear/reset needs immediate publication. The value
hook debounces an empty value like any other update. Delay validation and the
trailing execution policy are inherited from the shared debounce function.
