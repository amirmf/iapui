import { StrictMode } from 'react'

import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebouncedValue } from '../index'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('useDebouncedValue', () => {
  it('returns the initial value immediately and waits for inactivity with the latest value', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: 'initial' } }
    )
    expect(result.current).toBe('initial')
    rerender({ value: 'first' })
    act(() => vi.advanceTimersByTime(90))
    rerender({ value: 'latest' })
    act(() => vi.advanceTimersByTime(99))
    expect(result.current).toBe('initial')
    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('latest')
  })
  it('does not restart pending work during an unrelated rerender', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: 'initial', other: 0 } }
    )
    rerender({ value: 'latest', other: 0 })
    act(() => vi.advanceTimersByTime(90))
    rerender({ value: 'latest', other: 1 })
    act(() => vi.advanceTimersByTime(10))
    expect(result.current).toBe('latest')
  })
  it('restarts the delay when wait changes and disposes timers on StrictMode unmount', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, wait }) => useDebouncedValue(value, wait),
      { initialProps: { value: 'initial', wait: 100 }, wrapper: StrictMode }
    )
    rerender({ value: 'latest', wait: 100 })
    act(() => vi.advanceTimersByTime(90))
    rerender({ value: 'latest', wait: 200 })
    act(() => vi.advanceTimersByTime(199))
    expect(result.current).toBe('initial')
    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('latest')
    rerender({ value: 'discarded', wait: 200 })
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
  it('supports object, undefined and function values without invoking functions', () => {
    const initial = vi.fn(() => 'initial')
    const next = vi.fn(() => 'next')
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 10),
      { initialProps: { value: initial } }
    )
    expect(result.current).toBe(initial)
    rerender({ value: next })
    act(() => vi.advanceTimersByTime(10))
    expect(result.current).toBe(next)
    expect(initial).not.toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()

    const object = { value: 1 }
    const other = renderHook(({ value }) => useDebouncedValue(value, 10), {
      initialProps: { value: object as typeof object | undefined },
    })
    expect(other.result.current).toBe(object)
    other.rerender({ value: undefined })
    act(() => vi.advanceTimersByTime(10))
    expect(other.result.current).toBeUndefined()
  })
})
