import { TableFilterDateRangeFilter } from '@shared/tables/filter/table-filter-date-range-filter'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@shared/i18n/i18n', () => ({
  useTranslate: () => ({ t: (key: string) => key }),
}))
vi.mock('@iap/ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@iap/ui')>()),
  DateRangePicker: (props: {
    onChange: (range: { from?: Date; to?: Date }) => void
    value: { from?: Date; to?: Date }
  }) => (
    <>
      <button
        onClick={() =>
          props.onChange({
            ...props.value,
            from: new Date('2025-01-15T00:00:00'),
          })
        }
      >
        From
      </button>
      <button
        onClick={() =>
          props.onChange({
            ...props.value,
            to: new Date('2025-01-16T00:00:00'),
          })
        }
      >
        To
      </button>
    </>
  ),
}))

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})
describe('reference date range filter', () => {
  it('publishes both reference keys only after 500 ms', () => {
    vi.useFakeTimers()
    const onValueChange = vi.fn()
    render(
      <TableFilterDateRangeFilter
        presentation='reference'
        id='thruDate'
        values={{}}
        onValueChange={onValueChange}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'From' }))
    fireEvent.click(screen.getByRole('button', { name: 'To' }))
    act(() => vi.advanceTimersByTime(499))
    expect(onValueChange).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(onValueChange.mock.calls).toEqual([
      ['thruDate__from', '2025-01-15'],
      ['thruDate__to', '2025-01-16'],
    ])
  })
  it('cancels pending updates when reset remounts the content', () => {
    vi.useFakeTimers()
    const onValueChange = vi.fn()
    const props = {
      presentation: 'reference' as const,
      id: 'thruDate',
      values: {},
      onValueChange,
    }
    const { rerender } = render(
      <TableFilterDateRangeFilter key={0} {...props} />
    )
    fireEvent.click(screen.getByRole('button', { name: 'From' }))
    rerender(<TableFilterDateRangeFilter key={1} {...props} />)
    act(() => vi.advanceTimersByTime(500))
    expect(onValueChange).not.toHaveBeenCalled()
  })
})

describe('shared date filter timing', () => {
  it.each(['date', 'date-time'] as const)(
    'debounces default %s controls for 500ms',
    (mode) => {
      vi.useFakeTimers()
      const onValueChange = vi.fn()
      render(
        <TableFilterDateRangeFilter
          id='date'
          mode={mode}
          values={{}}
          onValueChange={onValueChange}
        />
      )
      fireEvent.click(screen.getByRole('button', { name: 'From' }))
      act(() => vi.advanceTimersByTime(499))
      expect(onValueChange).not.toHaveBeenCalled()
      act(() => vi.advanceTimersByTime(1))
      expect(onValueChange.mock.calls.map(([key]) => key)).toEqual([
        'dateFrom',
        'dateTo',
      ])
    }
  )
  it('honors explicit delay instead of silently ignoring it', () => {
    vi.useFakeTimers()
    const onValueChange = vi.fn()
    render(
      <TableFilterDateRangeFilter
        id='date'
        values={{}}
        debounceMs={25}
        onValueChange={onValueChange}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'From' }))
    act(() => vi.advanceTimersByTime(24))
    expect(onValueChange).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(onValueChange).toHaveBeenCalledTimes(2)
  })
})
