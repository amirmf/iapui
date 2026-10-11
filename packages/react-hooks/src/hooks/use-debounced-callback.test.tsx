import { StrictMode } from 'react'

import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebouncedCallback } from '../index'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('debounce React lifecycle', () => {
  it('keeps pending arguments across rerenders and invokes the latest callback', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { result, rerender } = renderHook(
      ({ callback }) => useDebouncedCallback(callback, 100),
      { initialProps: { callback: first } }
    )
    const original = result.current
    act(() => result.current('value'))
    rerender({ callback: second })
    expect(result.current).toBe(original)
    act(() => vi.advanceTimersByTime(100))
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledExactlyOnceWith('value')
  })
  it('cancels the old timer when delay changes and on unmount in StrictMode', () => {
    const callback = vi.fn()
    const { result, rerender, unmount } = renderHook(
      ({ wait }) => useDebouncedCallback(callback, wait),
      { initialProps: { wait: 100 }, wrapper: StrictMode }
    )
    act(() => result.current('old'))
    rerender({ wait: 200 })
    act(() => vi.advanceTimersByTime(100))
    expect(callback).not.toHaveBeenCalled()
    act(() => result.current('new'))
    unmount()
    act(() => vi.advanceTimersByTime(200))
    expect(callback).not.toHaveBeenCalled()
  })
})
