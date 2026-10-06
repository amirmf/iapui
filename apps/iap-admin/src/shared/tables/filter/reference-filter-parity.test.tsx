import { i18n, i18nReady } from '@shared/i18n/i18n'
import { TableFilterDateRangeFilter } from '@shared/tables/filter/table-filter-date-range-filter'
import { TableFilterFacetedFilter } from '@shared/tables/filter/table-filter-faceted-filter'
import { TableFilterInput } from '@shared/tables/filter/table-filter-input'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('reference filter presentation', () => {
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
  it('commits trimmed text after exactly 1200ms and clears immediately', () => {
    vi.useFakeTimers()
    const change = vi.fn()
    render(
      <TableFilterInput
        id='title'
        onValueChange={change}
        presentation='reference'
      />
    )
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '  Rule  ' },
    })
    act(() => vi.advanceTimersByTime(1199))
    expect(change).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(change).toHaveBeenLastCalledWith('title', 'Rule')
    fireEvent.click(screen.getByRole('button', { name: 'Clear input' }))
    expect(change).toHaveBeenLastCalledWith('title', undefined)
    expect(change).toHaveBeenCalledTimes(2)
  })
  it('renders the source dashed facet title and translated search, debounce and clear', () => {
    vi.useFakeTimers()
    const change = vi.fn()
    render(
      <TableFilterFacetedFilter
        id='status'
        onValueChange={change}
        options={[{ value: 'ACTIVE', label: 'Active' }]}
        placeholder='Status'
        presentation='reference'
        values={{}}
      />
    )
    const trigger = screen.getByRole('button', { name: 'Status' })
    expect(trigger.className).toContain('border-dashed')
    fireEvent.click(trigger)
    expect(
      screen.getByPlaceholderText(
        i18n.t('dataTable.facetedFilter.searchPlaceholder', { title: 'Status' })
      )
    ).toBeTruthy()
    fireEvent.click(screen.getByRole('option', { name: 'Active' }))
    act(() => vi.advanceTimersByTime(999))
    expect(change).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(change).toHaveBeenLastCalledWith('status', ['ACTIVE'])
    fireEvent.click(
      screen.getByRole('option', {
        name: i18n.t('dataTable.facetedFilter.clear'),
      })
    )
    expect(change).toHaveBeenLastCalledWith('status', undefined)
  })
  it('puts date widths on the trigger wrapper, not on its popover', () => {
    render(
      <TableFilterDateRangeFilter
        id='thruDate'
        onValueChange={vi.fn()}
        presentation='reference'
        values={{}}
        wrapperClassName='w-full sm:w-1/4'
        className='lg:w-full'
      />
    )
    const trigger = screen.getByRole('button')
    expect(trigger.parentElement?.className).toContain('sm:w-1/4')
    expect(trigger.className).toContain('h-8')
    expect(trigger.className).toContain('lg:w-full')
  })
})
