import { useEffect, useState } from 'react'

import { useDebouncedCallback } from './use-debounced-callback'

/** Return the initial value immediately, then publish the latest value after inactivity. */
export function useDebouncedValue<Value>(value: Value, waitMs: number): Value {
  const [debouncedValue, setDebouncedValue] = useState(() => value)
  const publish = useDebouncedCallback(
    (next: Value) => setDebouncedValue(() => next),
    waitMs
  )

  useEffect(() => {
    publish(value)
    return publish.cancel
  }, [value, publish])

  return debouncedValue
}
