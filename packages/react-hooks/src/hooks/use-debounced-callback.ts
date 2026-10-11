import { useEffect, useMemo, useRef } from 'react'

import { debounce } from '@iap/shared-lib'

/** Keep pending work across rerenders while invoking the latest committed callback. */
export function useDebouncedCallback<Args extends unknown[], Result>(
  callback: (...args: Args) => Result,
  waitMs: number
) {
  const callbackRef = useRef(callback)
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])
  const debounced = useMemo(
    () => debounce((...args: Args) => callbackRef.current(...args), waitMs),
    [waitMs]
  )
  useEffect(() => () => debounced.cancel(), [debounced])
  return debounced
}
