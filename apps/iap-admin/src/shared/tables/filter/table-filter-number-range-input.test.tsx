import { GroupedTableFilterItem } from '@shared/tables/filter/grouped-table-filter-item'
import { TableFilterContent } from '@shared/tables/filter/table-filter-content'
import { TableFilterNumberRangeInput } from '@shared/tables/filter/table-filter-number-range-input'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@shared/i18n/i18n', () => ({
  useTranslate: () => ({ t: (key: string) => key }),
}))
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})
const config = {
  id: 'amount',
  fromPlaceholder: 'Minimum',
  toPlaceholder: 'Maximum',
  numberWithComma: true,
}
function open() {
  fireEvent.click(screen.getByRole('button', { name: 'Minimum - Maximum' }))
}
describe('reference number range filter', () => {
  it('renders a compact summary and formats committed bounds', () => {
    render(
      <TableFilterNumberRangeInput
        {...config}
        presentation='reference'
        values={{ amount__fromNum: '1000', amount__toNum: '2000' }}
        onValueChange={vi.fn()}
      />
    )
    expect(screen.queryByRole('textbox')).toBeNull()
    expect(
      screen.getByRole('button', { name: '1,000 - 2,000' }).className
    ).toContain('h-8')
  })
  it('debounces each bound, normalizes digits and cancels a pending update on clear', () => {
    vi.useFakeTimers()
    const onValueChange = vi.fn()
    render(
      <TableFilterNumberRangeInput
        {...config}
        presentation='reference'
        values={{}}
        onValueChange={onValueChange}
      />
    )
    open()
    fireEvent.change(screen.getByPlaceholderText('Minimum'), {
      target: { value: '۱۲۳۴' },
    })
    fireEvent.change(screen.getByPlaceholderText('Maximum'), {
      target: { value: '5678' },
    })
    act(() => vi.advanceTimersByTime(1199))
    expect(onValueChange).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(onValueChange.mock.calls).toEqual([
      ['amount__fromNum', '1234'],
      ['amount__toNum', '5678'],
    ])
    fireEvent.change(screen.getByPlaceholderText('Minimum'), {
      target: { value: '9000' },
    })
    fireEvent.click(screen.getAllByRole('button', { name: 'Clear input' })[0]!)
    act(() => vi.advanceTimersByTime(1200))
    expect(onValueChange.mock.calls).toHaveLength(3)
    expect(onValueChange).toHaveBeenLastCalledWith('amount__fromNum', undefined)
  })
  it('honors explicit keys and delay and cancels pending edits on reset remount', () => {
    vi.useFakeTimers()
    const onValueChange = vi.fn()
    const props = {
      ...config,
      presentation: 'reference' as const,
      fromKey: 'lower',
      toKey: 'upper',
      debounceMs: 25,
      values: {},
      onValueChange,
    }
    const { rerender } = render(
      <TableFilterNumberRangeInput key={0} {...props} />
    )
    open()
    fireEvent.change(screen.getByPlaceholderText('Maximum'), {
      target: { value: '20' },
    })
    act(() => vi.advanceTimersByTime(25))
    expect(onValueChange).toHaveBeenLastCalledWith('upper', '20')
    fireEvent.change(screen.getByPlaceholderText('Minimum'), {
      target: { value: '10' },
    })
    rerender(<TableFilterNumberRangeInput key={1} {...props} />)
    act(() => vi.advanceTimersByTime(25))
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })
  it('forwards reference presentation through ordinary and grouped filters', () => {
    const { unmount } = render(
      <TableFilterContent
        numberRangeFilters={[config]}
        presentation='reference'
        expanded
        values={{}}
        onValueChange={vi.fn()}
      />
    )
    expect(
      screen.getByRole('button', { name: 'Minimum - Maximum' })
    ).toBeTruthy()
    unmount()
    render(
      <GroupedTableFilterItem
        filter={{ type: 'numberRange', config }}
        presentation='reference'
        values={{}}
        onValueChange={vi.fn()}
      />
    )
    expect(
      screen.getByRole('button', { name: 'Minimum - Maximum' }).className
    ).toContain('lg:w-full')
  })
  it('debounces inline default controls for 1200ms while retaining legacy keys', () => {
    vi.useFakeTimers()
    const onValueChange = vi.fn()
    render(
      <TableFilterNumberRangeInput
        {...config}
        values={{}}
        onValueChange={onValueChange}
      />
    )
    expect(screen.queryByRole('button')).toBeNull()
    fireEvent.change(screen.getByPlaceholderText('Minimum'), {
      target: { value: '10' },
    })
    act(() => vi.advanceTimersByTime(1199))
    expect(onValueChange).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(onValueChange).toHaveBeenLastCalledWith('amountFrom', '10')
  })
})
