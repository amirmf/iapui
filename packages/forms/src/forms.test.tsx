import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import {
  Form,
  FormControl,
  FormDescription,
  FormErrorSummary,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSection,
  MultiSelectField,
  NationalCodeField,
  PhoneField,
  RadioGroupField,
  SelectField,
  SwitchField,
  TextField,
  TextareaField,
  focusFirstError,
  mapApiFieldErrors,
} from './index'

type ContactValues = {
  city: LocationOption | undefined
  cities: LocationOption[]
  notes: string
  name: string
  nationalCode: string
  phone: string
  preferredContact: string
  paperCopy: boolean
}

type LocationOption = { id: string; label: string }

const locationOptions: LocationOption[] = [
  { id: 'tehran', label: 'Tehran' },
  { id: 'shiraz', label: 'Shiraz' },
]

function ContactForm(props: { onSubmit?: (values: ContactValues) => void }) {
  const { onSubmit } = props
  const form = useForm<ContactValues>({
    defaultValues: {
      city: undefined,
      cities: [],
      name: '',
      nationalCode: '',
      notes: '',
      phone: '',
      preferredContact: 'phone',
      paperCopy: false,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit?.(values))}>
        <TextField control={form.control} label='Name' name='name' required />
        <PhoneField control={form.control} label='Phone' name='phone' />
        <NationalCodeField
          control={form.control}
          label='National code'
          name='nationalCode'
        />
        <TextareaField control={form.control} label='Notes' name='notes' />
        <RadioGroupField
          control={form.control}
          label='Preferred contact'
          name='preferredContact'
          options={[
            { label: 'Phone', value: 'phone' },
            { label: 'Email', value: 'email' },
          ]}
        />
        <SwitchField
          control={form.control}
          label='Paper copy'
          name='paperCopy'
        />
        <SelectField
          control={form.control}
          label='City'
          labelKey='label'
          name='city'
          options={locationOptions}
          valueKey='id'
        />
        <MultiSelectField
          control={form.control}
          label='Covered cities'
          labelKey='label'
          name='cities'
          options={locationOptions}
          valueKey='id'
        />
        <button type='submit'>Submit</button>
      </form>
    </Form>
  )
}

describe('React Hook Form bindings', () => {
  it('focuses a linked error summary after an invalid submission', async () => {
    function Example() {
      const form = useForm<{ name: string }>({ defaultValues: { name: '' } })

      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(vi.fn())}>
            <FormErrorSummary title='Please correct the following errors.' />
            <FormField
              control={form.control}
              name='name'
              rules={{ required: 'Enter your name.' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button type='submit'>Submit</button>
          </form>
        </Form>
      )
    }

    const user = userEvent.setup()
    render(<Example />)

    expect(
      screen.queryByRole('alert', {
        name: 'Please correct the following errors.',
      })
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    const summary = await screen.findByRole('alert', {
      name: 'Please correct the following errors.',
    })
    await waitFor(() => expect(summary).toHaveFocus())
    const errorLink = screen.getByRole('link', { name: 'Enter your name.' })
    expect(errorLink).toHaveAttribute(
      'href',
      `#${screen.getByLabelText('Name').id}`
    )

    await user.click(errorLink)
    expect(screen.getByLabelText('Name')).toHaveFocus()
  })

  it('connects a field label, description, and inline error accessibly', () => {
    function Example() {
      const form = useForm<{ name: string }>({ defaultValues: { name: '' } })

      return (
        <Form {...form}>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <input {...field} />
                </FormControl>
                <FormDescription>As shown on your ID.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      )
    }

    render(<Example />)

    const input = screen.getByLabelText('Name')
    expect(input).toHaveAttribute('aria-describedby')
    expect(input.getAttribute('aria-describedby')).toContain(
      'form-item-description'
    )
  })

  it('binds text and numeric identity fields to React Hook Form values', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Ava' },
    })
    fireEvent.change(screen.getByLabelText('National code'), {
      target: { value: '۱۲۳a' },
    })
    fireEvent.submit(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Ava', nationalCode: '123' })
      )
    })
  })

  it('uses phone-friendly input semantics', () => {
    render(<ContactForm />)

    const phoneInput = screen.getByRole('textbox', { name: 'Phone' })
    expect(phoneInput).toHaveAttribute('autocomplete', 'tel')
    expect(phoneInput).toHaveAttribute('inputmode', 'tel')
  })

  it('allows a phone autocomplete override', () => {
    function Example() {
      const form = useForm<{ mobile: string }>({
        defaultValues: { mobile: '' },
      })

      return (
        <Form {...form}>
          <PhoneField
            autoComplete='tel-national'
            control={form.control}
            label='Mobile'
            name='mobile'
          />
        </Form>
      )
    }

    render(<Example />)

    expect(screen.getByRole('textbox', { name: 'Mobile' })).toHaveAttribute(
      'autocomplete',
      'tel-national'
    )
  })

  it('binds a textarea field to the form value', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Ava' },
    })
    fireEvent.change(screen.getByLabelText('Notes'), {
      target: { value: 'Needs a call back.' },
    })
    fireEvent.submit(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ notes: 'Needs a call back.' })
      )
    })
  })

  it('connects radio and switch fields to controlled values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Name'), 'Ava')
    await user.click(screen.getByLabelText('Email'))
    await user.click(screen.getByRole('switch', { name: 'Paper copy' }))
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ preferredContact: 'email', paperCopy: true })
      )
    })
  })

  it('renders labelled Select and MultiSelect bindings', () => {
    render(<ContactForm />)

    expect(screen.getByRole('combobox', { name: 'City' })).toBeVisible()
    expect(
      screen.getByRole('combobox', { name: 'Covered cities' })
    ).toBeVisible()
  })

  it('groups related fields in a labelled section', () => {
    render(
      <FormSection description='Use your legal details.' title='Identity'>
        <input aria-label='National code' />
      </FormSection>
    )

    expect(screen.getByRole('group', { name: 'Identity' })).toHaveTextContent(
      'Use your legal details.'
    )
  })

  it('focuses the first registered invalid field', () => {
    const second = document.createElement('input')
    const first = document.createElement('input')
    document.body.append(second, first)

    focusFirstError(
      { first: { type: 'required' }, second: { type: 'required' } },
      { first: first as never, second: second as never }
    )

    expect(document.activeElement).toBe(first)
  })

  it('maps API field messages into form errors', () => {
    const setError = vi.fn()

    mapApiFieldErrors(
      { nationalCode: ['Already registered'], unknown: ['Ignored'] },
      setError,
      ['nationalCode']
    )

    expect(setError).toHaveBeenCalledWith('nationalCode', {
      message: 'Already registered',
      type: 'server',
    })
    expect(setError).toHaveBeenCalledTimes(1)
  })
})
