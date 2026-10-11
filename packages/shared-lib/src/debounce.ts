export type DebouncedFunction<
  Args extends unknown[],
  Result,
  Context = unknown,
> = {
  (this: Context, ...args: Args): void
  /** Discard scheduled work and release its arguments and receiver. */
  cancel: () => void
  /** Execute scheduled work now; returns undefined when nothing is pending. */
  flush: () => Result | undefined
  isPending: () => boolean
}

/**
 * Trailing debounce: run once with the latest arguments and `this` after waitMs
 * of inactivity. Calls return void; flush returns the callback result.
 * Each instance has its own timer. Owners must cancel when disposing it.
 * A zero delay still schedules execution on a later timer task.
 */
export function debounce<Args extends unknown[], Result, Context = unknown>(
  callback: (this: Context, ...args: Args) => Result,
  waitMs: number
): DebouncedFunction<Args, Result, Context> {
  if (!Number.isFinite(waitMs) || waitMs < 0 || waitMs > 2_147_483_647) {
    throw new RangeError(
      'Debounce delay must be between 0 and 2147483647 milliseconds'
    )
  }

  let timer: ReturnType<typeof setTimeout> | undefined
  let pendingCall: { args: Args; context: Context } | undefined

  const cancel = () => {
    clearTimeout(timer)
    timer = undefined
    pendingCall = undefined
  }
  const flush = (): Result | undefined => {
    const call = pendingCall
    cancel()
    // Clear before invoking so the callback can safely schedule another call.
    if (call) return callback.apply(call.context, call.args)
  }
  const debounced = function (this: Context, ...args: Args) {
    cancel()
    pendingCall = { args, context: this }
    timer = setTimeout(flush, waitMs)
  }

  return Object.assign(debounced, {
    cancel,
    flush,
    isPending: () => pendingCall !== undefined,
  })
}
