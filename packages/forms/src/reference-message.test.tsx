import { useEffect } from 'react'

import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'

import { Form, FormField, FormItem, FormMessage, TextField } from './index'

function Example(props: {
  presentation?: 'reference'
  message: string
  fallback?: boolean
}) {
  const { presentation, message, fallback = false } = props
  const form = useForm<{ name: string }>({ defaultValues: { name: '' } })
  useEffect(() => {
    form.setError('name', { type: 'server', message })
  }, [form, message])
  return (
    <Form {...form}>
      {fallback ? (
        <FormField
          control={form.control}
          name='name'
          render={() => (
            <FormItem>
              <FormMessage presentation={presentation}>Fallback</FormMessage>
            </FormItem>
          )}
        />
      ) : (
        <TextField
          control={form.control}
          name='name'
          label='Name'
          presentation={presentation}
        />
      )}
    </Form>
  )
}

describe('reference form error presentation', () => {
  it('keeps default alert semantics', () => {
    render(<Example message='Error' />)
    expect(screen.getByText('Error')).toHaveAttribute('role', 'alert')
  })
  it('forwards source markup through TextField', () => {
    render(<Example presentation='reference' message='Error' />)
    expect(screen.getByText('Error')).not.toHaveAttribute('role')
    expect(screen.getByLabelText('Name')).toHaveAttribute(
      'aria-invalid',
      'true'
    )
  })
  it('suppresses fallback children when source has an empty error', () => {
    render(<Example presentation='reference' message='' fallback />)
    expect(screen.queryByText('Fallback')).toBeNull()
  })
})
