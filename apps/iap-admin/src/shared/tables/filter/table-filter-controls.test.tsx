import { i18n, i18nReady } from '@shared/i18n/i18n'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
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
import { TableFilterInput } from './table-filter-input'
import { TableFilterState } from './table-filter-state'
import type { TableFilterValues } from './types'
import { useTableFilterState } from './use-table-filter-state'

function StatefulFilters() {
  const state = useTableFilterState<TableFilterValues>({
    filters: { committed: 'existing' },
    pagination: { pageIndex: 0, pageSize: 40 },
    sorting: [],
  })
  return (
    <>
      <TableFilterState
        onValuesChange={state.onFiltersChange}
        textFilters={[{ id: 'title', placeholder: 'Title', debounceMs: 1200 }]}
        values={state.filters}
      />
      <output>{JSON.stringify(state.filters)}</output>
    </>
  )
}

describe('Reference table filter controls', () => {
  beforeAll(async () => {
    await i18nReady
  })
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('does not publish initial text, debounces typing, and clears immediately without stale updates', () => {
    const onValueChange = vi.fn()
    render(
      <TableFilterInput
        debounceMs={1200}
        id='title'
        onValueChange={onValueChange}
        placeholder='Title'
        value='initial'
      />
    )
    act(() => {
      vi.advanceTimersByTime(1200)
    })
    expect(onValueChange).not.toHaveBeenCalled()
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'pending' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Clear input' }))
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('title', undefined)
    act(() => {
      vi.advanceTimersByTime(1200)
    })
    expect(onValueChange).toHaveBeenCalledTimes(1)
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: ' next ' },
    })
    act(() => {
      vi.advanceTimersByTime(1199)
    })
    expect(onValueChange).toHaveBeenCalledTimes(1)
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(onValueChange).toHaveBeenLastCalledWith('title', 'next')
  })

  it('cancels pending text when the controlled value resets', () => {
    const onValueChange = vi.fn()
    const { rerender } = render(
      <TableFilterInput
        id='title'
        onValueChange={onValueChange}
        placeholder='Title'
        value='initial'
      />
    )
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'pending' },
    })
    rerender(
      <TableFilterInput
        id='title'
        onValueChange={onValueChange}
        placeholder='Title'
        value=''
      />
    )
    act(() => {
      vi.advanceTimersByTime(1200)
    })
    expect(onValueChange).not.toHaveBeenCalled()
    expect(
      (screen.getByPlaceholderText('Title') as HTMLInputElement).value
    ).toBe('')
  })

  it('global reset cancels pending changes even for a field with no committed value', () => {
    render(<StatefulFilters />)
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'pending' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }))
    expect(
      (screen.getByPlaceholderText('Title') as HTMLInputElement).value
    ).toBe('')
    act(() => {
      vi.advanceTimersByTime(1200)
    })
    expect(screen.getByRole('status').textContent).toBe('{}')
  })

  it('keeps title and selected badges, preserves pending selection through unrelated updates, and clears immediately', () => {
    const onValueChange = vi.fn()
    const options = [
      { label: 'Active', value: 'ACTIVE' },
      { label: 'Draft', value: 'DRAFT' },
    ]
    const props = {
      debounceMs: 1000,
      id: 'status',
      onValueChange,
      options,
      placeholder: 'Status',
    }
    const { rerender } = render(
      <TableFilterFacetedFilter {...props} values={{}} />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Status' }))
    fireEvent.click(screen.getByRole('button', { name: 'Active' }))
    rerender(
      <TableFilterFacetedFilter {...props} values={{ title: 'unrelated' }} />
    )
    expect(screen.getByRole('button', { name: /Status.*Active/ })).toBeTruthy()
    act(() => {
      vi.advanceTimersByTime(999)
    })
    expect(onValueChange).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('status', ['ACTIVE'])
    fireEvent.click(screen.getByRole('button', { name: 'Draft' }))
    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.t('dataTable.facetedFilter.clear'),
      })
    )
    expect(onValueChange).toHaveBeenLastCalledWith('status', undefined)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(onValueChange).toHaveBeenCalledTimes(2)
  })

  it('renders source translated search and empty text and cancels selection on external reset', () => {
    const onValueChange = vi.fn()
    const props = {
      debounceMs: 1000,
      id: 'status',
      onValueChange,
      options: [{ label: 'Active', value: 'ACTIVE' }],
      placeholder: 'Status',
    }
    const { rerender } = render(
      <TableFilterFacetedFilter {...props} values={{ status: ['ACTIVE'] }} />
    )
    fireEvent.click(screen.getByRole('button', { name: /Status.*Active/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Active' }))
    rerender(<TableFilterFacetedFilter {...props} values={{}} />)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(onValueChange).not.toHaveBeenCalled()
    fireEvent.change(
      screen.getByPlaceholderText(
        i18n.t('dataTable.facetedFilter.searchPlaceholder', { title: 'Status' })
      ),
      { target: { value: 'missing' } }
    )
    expect(
      screen.getByText(i18n.t('dataTable.facetedFilter.noResults'))
    ).toBeTruthy()
  })
})

describe('shared filter debounce defaults', () => {
  beforeAll(async () => {
    await i18nReady
  })
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it.each(['default', 'reference'] as const)(
    'uses 1200ms text timing in %s presentation',
    (presentation) => {
      const onValueChange = vi.fn()
      render(
        <TableFilterInput
          id='title'
          placeholder='Title'
          presentation={presentation}
          onValueChange={onValueChange}
        />
      )
      fireEvent.change(screen.getByPlaceholderText('Title'), {
        target: { value: 'query' },
      })
      act(() => vi.advanceTimersByTime(1199))
      expect(onValueChange).not.toHaveBeenCalled()
      act(() => vi.advanceTimersByTime(1))
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('title', 'query')
    }
  )

  it('uses 1000ms facet timing by default and clears without restoring pending selections', () => {
    const onValueChange = vi.fn()
    render(
      <TableFilterFacetedFilter
        id='status'
        placeholder='Status'
        values={{}}
        options={[{ value: 'open', label: 'Open' }]}
        onValueChange={onValueChange}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Status' }))
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    act(() => vi.advanceTimersByTime(999))
    expect(onValueChange).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('status', ['open'])
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.t('dataTable.facetedFilter.clear'),
      })
    )
    act(() => vi.advanceTimersByTime(1000))
    expect(onValueChange.mock.calls).toEqual([
      ['status', ['open']],
      ['status', undefined],
    ])
  })
})
