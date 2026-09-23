import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MultiSelect } from './multi-select'
import { Select, selectedOptionClassName } from './select'

const options = [
  { id: 'tehran', label: 'Tehran' },
  { id: 'shiraz', label: 'Shiraz' },
  { id: 'tabriz', label: 'Tabriz' },
]

describe('Select', () => {
  it('shows the selected value and uses the semantic selected option background', () => {
    render(
      <Select
        defaultValue={options[0]!}
        labelKey='label'
        options={options}
        valueKey='id'
      />
    )

    expect(screen.getByRole('combobox')).toHaveTextContent('Tehran')
    expect(selectedOptionClassName).toContain(
      'data-[checked=true]:bg-primary-subtle'
    )
  })

  it('hides search by default and renders it when requested', () => {
    const { rerender } = render(
      <Select labelKey='label' options={options} valueKey='id' />
    )

    fireEvent.click(screen.getByRole('combobox'))
    expect(
      screen.queryByRole('combobox', { name: 'Options' })
    ).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('combobox'))

    rerender(
      <Select labelKey='label' options={options} showSearch valueKey='id' />
    )
    fireEvent.click(screen.getByRole('combobox'))

    expect(screen.getByRole('combobox', { name: 'Options' })).toBeVisible()
  })
})

describe('MultiSelect', () => {
  it('renders dismissible selected chips and marks selected list options', () => {
    render(
      <MultiSelect
        defaultValue={[options[0]!, options[1]!]}
        labelKey='label'
        maxVisibleItems={2}
        options={options}
        valueKey='id'
      />
    )

    expect(screen.getByRole('button', { name: 'Remove Tehran' })).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'Remove Tehran' }))
    expect(
      screen.queryByRole('button', { name: 'Remove Tehran' })
    ).not.toBeInTheDocument()
  })

  it('opens when the field body is clicked, not only the chevron icon', () => {
    render(
      <MultiSelect
        labelKey='label'
        options={options}
        placeholder='Choose cities'
        valueKey='id'
      />
    )

    fireEvent.click(screen.getByText('Choose cities'))

    expect(screen.getByRole('listbox', { name: 'Suggestions' })).toBeVisible()
  })
})
