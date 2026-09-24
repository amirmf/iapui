import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DatePicker } from './date-picker'
import { DateRangePicker } from './date-range-picker'

describe('DatePicker', () => {
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
