import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DatePicker } from './date-picker'
import { DateRangePicker } from './date-range-picker'

describe('DatePicker', () => {
  it('does not invent a clear action when clearable is false', () => {
    render(
      <DatePicker
        clearable={false}
        locale='en'
        onChange={vi.fn()}
        value={new Date('2025-01-15T00:00:00')}
      />
    )
    expect(screen.queryByRole('button', { name: 'Clear date' })).toBeNull()
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
  it('scopes reference range width to its wrapper and uses the compact source trigger', async () => {
    const user = userEvent.setup()
    render(
      <DateRangePicker
        presentation='reference'
        wrapperClassName='sm:w-1/4'
        triggerClassName='lg:w-full'
        fromPlaceholder='Start'
        toPlaceholder='End'
        onChange={vi.fn()}
        value={{}}
      />
    )
    const trigger = screen.getByRole('button', { name: 'Start End' })
    expect(trigger).toHaveClass('h-8', 'lg:w-full')
    expect(trigger.parentElement).toHaveClass('sm:w-1/4')
    expect(trigger.textContent).toBe('Start-End')
    await user.click(trigger)
    expect(
      document.querySelector('[data-radix-popper-content-wrapper] > div')
    ).toHaveClass('w-80', 'p-3')
  })
})
