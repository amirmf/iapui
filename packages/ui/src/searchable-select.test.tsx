import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SearchableSelect } from './searchable-select'
import { SingleSelect } from './single-select'

const items = [
  { label: 'Alpha', value: 'A' },
  { label: 'Beta', value: 'B' },
]

describe('source scalar select behavior', () => {
  it('opts the trigger into source disabled styling without changing default consumers', () => {
    const { rerender } = render(
      <SingleSelect items={items} value='A' onChange={vi.fn()} disabled />
    )
    expect(screen.getByRole('combobox')).not.toHaveClass('disabled:bg-muted')
    rerender(
      <SingleSelect
        items={items}
        value='A'
        onChange={vi.fn()}
        disabled
        presentation='reference'
      />
    )
    expect(screen.getByRole('combobox')).toHaveClass(
      'disabled:bg-muted',
      'disabled:text-muted-foreground',
      'disabled:pointer-events-auto'
    )
    expect(screen.getByRole('combobox')).toBeDisabled()
  })
  it('searches labels locally and emits the unchanged search immediately', () => {
    const onSearch = vi.fn()
    render(
      <SearchableSelect
        items={items}
        value='A'
        onChange={vi.fn()}
        onSearch={onSearch}
        placeholder='Search agreement'
      />
    )
    fireEvent.click(screen.getByRole('combobox'))
    const popup = document.querySelector('[data-slot="popover-content"]')
    expect(popup).toHaveClass(
      'rounded-md',
      'shadow-md',
      'data-[state=open]:zoom-in-95'
    )
    fireEvent.change(screen.getByPlaceholderText('Search agreement'), {
      target: { value: 'Beta' },
    })
    expect(onSearch).toHaveBeenCalledWith('Beta')
    expect(
      screen.queryByRole('option', { name: 'Alpha' })
    ).not.toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Beta' })).toBeInTheDocument()
  })

  it('shows the localized dropdown clear action and emits undefined', () => {
    const onChange = vi.fn()
    render(
      <SearchableSelect
        items={items}
        value='A'
        onChange={onChange}
        clearText='پاک کردن'
      />
    )
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: 'پاک کردن' }))
    expect(onChange).toHaveBeenCalledWith(undefined)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('hides both selectable options and clearing while loading', () => {
    render(
      <SearchableSelect
        items={items}
        value='A'
        onChange={vi.fn()}
        isLoading
        loadingText='Loading reference options'
        clearText='Clear reference'
      />
    )
    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByText('Loading reference options')).toBeInTheDocument()
    expect(
      screen.queryByRole('option', { name: 'Alpha' })
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Clear reference')).not.toBeInTheDocument()
  })

  it('SingleSelect keeps source scalar values and has no search input', () => {
    const onChange = vi.fn()
    render(
      <SingleSelect items={items} onChange={onChange} selectText='انتخاب' />
    )
    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('option', { name: 'Beta' }))
    expect(onChange).toHaveBeenCalledWith('B')
  })
})
