import { i18n, i18nReady } from '@shared/i18n/i18n'
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { TableFilterFacetedFilter } from './table-filter-faceted-filter'

const originalScrollIntoView = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView'
)

describe('reference faceted command keyboard interaction', () => {
  beforeAll(async () => {
    await i18nReady
  })
  beforeEach(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
        unobserve() {}
      }
    )
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    })
  })
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    if (originalScrollIntoView)
      Object.defineProperty(
        HTMLElement.prototype,
        'scrollIntoView',
        originalScrollIntoView
      )
    else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
  })

  it('selects with ArrowDown/Enter after the source 1000ms debounce and clears immediately', async () => {
    const onValueChange = vi.fn()
    render(
      <TableFilterFacetedFilter
        presentation='reference'
        debounceMs={1000}
        id='status'
        placeholder='Status'
        options={[
          { label: 'Active', value: 'ACTIVE' },
          { label: 'Draft', value: 'DRAFT' },
        ]}
        values={{}}
        onValueChange={onValueChange}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Status' }))
    const active = await screen.findByRole('option', { name: 'Active' })
    await waitFor(() =>
      expect(active.getAttribute('data-selected')).toBe('true')
    )
    const input = screen.getByRole('combobox')
    expect(input.getAttribute('placeholder')).toBe(
      i18n.t('dataTable.facetedFilter.searchPlaceholder', { title: 'Status' })
    )
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    await waitFor(() =>
      expect(
        screen
          .getByRole('option', { name: 'Draft' })
          .getAttribute('data-selected')
      ).toBe('true')
    )
    vi.useFakeTimers()
    fireEvent.keyDown(input, { key: 'Enter' })
    act(() => {
      vi.advanceTimersByTime(999)
    })
    expect(onValueChange).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('status', ['DRAFT'])
    fireEvent.click(screen.getByRole('option', { name: 'Active' }))
    fireEvent.click(
      screen.getByRole('option', {
        name: i18n.t('dataTable.facetedFilter.clear'),
      })
    )
    expect(onValueChange).toHaveBeenLastCalledWith('status', undefined)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(onValueChange).toHaveBeenCalledTimes(2)
  })
})
