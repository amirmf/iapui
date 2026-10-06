import { i18n, i18nReady } from '@shared/i18n/i18n'
import { TableFilterFacetedFilter } from '@shared/tables/filter/table-filter-faceted-filter'
import { TableFilterInput } from '@shared/tables/filter/table-filter-input'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(async () => {
  await i18nReady
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
  Element.prototype.scrollIntoView = vi.fn()
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})
describe('Medical Center source filter details', () => {
  it('hides whitespace-only clear, uses physical left geometry and cancels unpublished text on clear', () => {
    vi.useFakeTimers()
    const change = vi.fn()
    render(
      <TableFilterInput
        id='documentNumber'
        presentation='reference'
        onValueChange={change}
      />
    )
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('pe-8')
    fireEvent.change(input, { target: { value: '  ' } })
    expect(screen.queryByRole('button', { name: 'Clear input' })).toBeNull()
    fireEvent.change(input, { target: { value: '123' } })
    const clear = screen.getByRole('button', { name: 'Clear input' })
    expect(clear.className).toContain('left-2')
    fireEvent.click(clear)
    act(() => vi.advanceTimersByTime(1200))
    expect(change).toHaveBeenCalledExactlyOnceWith('documentNumber', undefined)
  })
  it('single state selection stays on committed value until the source debounce publishes', () => {
    vi.useFakeTimers()
    const change = vi.fn()
    const props = {
      id: 'state',
      multiple: false,
      deferSingleSelection: true,
      placeholder: 'State',
      presentation: 'reference' as const,
      options: [
        { value: 'CREATED', label: 'Created' },
        { value: 'FAILED', label: 'Failed' },
      ],
      onValueChange: change,
    }
    const { rerender } = render(
      <TableFilterFacetedFilter {...props} values={{ state: 'CREATED' }} />
    )
    fireEvent.click(screen.getByRole('button', { name: 'State Created' }))
    fireEvent.click(screen.getByRole('option', { name: 'Failed' }))
    expect(screen.getByRole('button', { name: 'State Created' })).toBeTruthy()
    act(() => vi.advanceTimersByTime(999))
    expect(change).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(change).toHaveBeenCalledExactlyOnceWith('state', 'FAILED')
    rerender(
      <TableFilterFacetedFilter {...props} values={{ state: 'FAILED' }} />
    )
    expect(screen.getByRole('button', { name: 'State Failed' })).toBeTruthy()
    fireEvent.click(
      screen.getByRole('option', {
        name: i18n.t('dataTable.facetedFilter.clear'),
      })
    )
    expect(change).toHaveBeenLastCalledWith('state', undefined)
    act(() => vi.advanceTimersByTime(1000))
    expect(change).toHaveBeenCalledTimes(2)
  })
})
