import { debounce } from '@iap/shared-lib'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('shared debounce public API', () => {
  it('waits for inactivity and uses the latest arguments and receiver', () => {
    const callback = vi.fn(function (
      this: { prefix: string },
      value: string,
      count: number
    ) {
      return `${this.prefix}:${value}:${count}`
    })
    const run = debounce(callback, 100)
    run.call({ prefix: 'old' }, 'first', 1)
    vi.advanceTimersByTime(90)
    run.call({ prefix: 'new' }, 'last', 2)
    vi.advanceTimersByTime(99)
    expect(callback).not.toHaveBeenCalled()
    expect(run.isPending()).toBe(true)
    vi.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledExactlyOnceWith('last', 2)
    expect(callback.mock.results[0]?.value).toBe('new:last:2')
    expect(run.isPending()).toBe(false)
  })
  it('cancels, flushes once, and can be reused afterward', () => {
    const callback = vi.fn((value: number) => value * 2)
    const run = debounce(callback, 100)
    run(1)
    run.cancel()
    expect(run.isPending()).toBe(false)
    expect(run.flush()).toBeUndefined()
    vi.runAllTimers()
    expect(callback).not.toHaveBeenCalled()
    run(2)
    expect(run.flush()).toBe(4)
    expect(run.flush()).toBeUndefined()
    vi.runAllTimers()
    expect(callback).toHaveBeenCalledTimes(1)
    run(3)
    vi.advanceTimersByTime(100)
    expect(callback).toHaveBeenLastCalledWith(3)
  })
  it('isolates instances and defers even a zero-delay call', () => {
    const first = vi.fn()
    const second = vi.fn()
    const a = debounce(first, 0)
    const b = debounce(second, 100)
    a()
    b()
    expect(first).not.toHaveBeenCalled()
    vi.advanceTimersByTime(0)
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).not.toHaveBeenCalled()
    a.cancel()
    vi.advanceTimersByTime(100)
    expect(second).toHaveBeenCalledTimes(1)
  })
  it('supports reentrant scheduling and clears state before callback errors', () => {
    const seen: number[] = []
    const run = debounce((value: number) => {
      seen.push(value)
      if (value === 1) run(2)
    }, 10)
    run(1)
    run.flush()
    expect(run.isPending()).toBe(true)
    vi.advanceTimersByTime(10)
    expect(seen).toEqual([1, 2])
    const fails = debounce(() => {
      throw new Error('Failure')
    }, 10)
    fails()
    expect(() => fails.flush()).toThrow('Failure')
    expect(fails.isPending()).toBe(false)
    expect(vi.getTimerCount()).toBe(0)
  })
  it('returns the actual promise from flush for async callbacks', async () => {
    const run = debounce(async (value: number) => value + 1, 20)
    run(1)
    await expect(run.flush()).resolves.toBe(2)
  })
  it.each([-1, NaN, Infinity, 2_147_483_648])(
    'rejects unsupported delay %s',
    (delay) => {
      expect(() => debounce(vi.fn(), delay)).toThrow(RangeError)
    }
  )
})
