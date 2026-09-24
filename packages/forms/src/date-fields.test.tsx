import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import { Form } from './components/form'
import { DatePickerField } from './fields/date-picker-field'
import { DateRangePickerField } from './fields/date-range-picker-field'

type Values = {
  appointment?: Date
  period: { from?: Date; to?: Date }
}

function DateFieldsForm(props: { onSubmit: (values: Values) => void }) {
  const { onSubmit } = props
  const form = useForm<Values>({
    defaultValues: {
      appointment: new Date('2025-01-15T00:00:00'),
      period: {},
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DatePickerField
          clearLabel='Clear appointment'
          control={form.control}
          label='Appointment'
          locale='en'
          name='appointment'
        />
        <DateRangePickerField
          control={form.control}
          fromPlaceholder='Start'
          label='Period'
          locale='en'
          name='period'
          toPlaceholder='End'
        />
        <button type='submit'>Submit</button>
      </form>
    </Form>
  )
}

describe('date field bindings', () => {
  it('connects labels and controlled values to React Hook Form', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<DateFieldsForm onSubmit={onSubmit} />)

    expect(screen.getByLabelText('Appointment')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Period' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Clear appointment' }))
    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled()
    })
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
      expect(onSubmit.mock.calls[0]?.[0]).toEqual(
        expect.objectContaining({ appointment: undefined })
      )
    })
  })
})
