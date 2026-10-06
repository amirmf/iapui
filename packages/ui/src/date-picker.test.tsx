import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DatePicker } from './date-picker'
import { DateRangePicker } from './date-range-picker'

describe('DatePicker', () => {
  it('uses the source range-date clear control when reference clearing is enabled', async () => {
    const onChange = vi.fn()
    render(
      <DatePicker
        presentation='reference'
        clearLabel='پاک کردن'
        onChange={onChange}
        value={new Date('2026-01-01T00:00:00')}
      />
    )
    const clear = screen.getByRole('button', { name: 'پاک کردن' })
    expect(clear).toHaveClass('left-3')
    expect(clear).not.toHaveClass('size-11')
    await userEvent.setup().click(clear)
    expect(onChange).toHaveBeenCalledWith(undefined)
  })
  it('supports the reference form appearance without adding a source-absent clear control', () => {
    render(
      <DatePicker
        presentation='reference'
        showClear={false}
        onChange={vi.fn()}
        value={new Date('2026-01-01T00:00:00')}
      />
    )
    expect(
      screen.queryByRole('button', { name: 'Clear date' })
    ).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('pr-10', 'pl-10')
  })
  it('clears a controlled value through its accessible clear control', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <DatePicker
        clearLabel='Clear appointment date'
        locale='en'
        onChange={onChange}
        value={new Date('2025-01-15T00:00:00')}
      />
    )

    await user.click(
      screen.getByRole('button', { name: 'Clear appointment date' })
    )

    expect(onChange).toHaveBeenCalledWith(undefined)
  })

  it('renders a labelled range trigger', () => {
    render(
      <DateRangePicker
        fromPlaceholder='Start date'
        locale='en'
        onChange={vi.fn()}
        toPlaceholder='End date'
        value={{}}
      />
    )

    expect(
      screen.getByRole('button', { name: 'Start date End date' })
    ).toBeVisible()
  })
})
