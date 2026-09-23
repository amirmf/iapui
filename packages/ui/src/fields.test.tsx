import { createRef } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Input } from './input'
import { Label } from './label'
import { Switch } from './switch'

describe('form controls', () => {
  it('connects a label and preserves invalid semantics', () => {
    render(
      <>
        <Label htmlFor='phone'>Phone</Label>
        <Input aria-invalid='true' id='phone' />
      </>
    )

    expect(screen.getByLabelText('Phone')).toHaveAttribute(
      'aria-invalid',
      'true'
    )
  })

  it('uses the destructive focus ring for an invalid input', () => {
    render(<Input aria-invalid='true' />)

    expect(screen.getByRole('textbox')).toHaveClass(
      'aria-[invalid=true]:focus-visible:ring-destructive'
    )
  })

  it('accepts a React 19 ref prop without a forwardRef wrapper', () => {
    const ref = createRef<HTMLInputElement>()

    render(<Input ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('uses a subdued semantic color for placeholder text', () => {
    render(<Input placeholder='Example input' />)

    expect(screen.getByPlaceholderText('Example input')).toHaveClass(
      'placeholder:text-muted-foreground/90'
    )
  })

  it('normalizes Persian digits and non-numeric characters for numerical input', () => {
    const onChange = vi.fn()
    render(<Input numerical onChange={onChange} />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '۱۲.۳a' },
    })

    expect(screen.getByRole('textbox')).toHaveAttribute('inputmode', 'numeric')
    expect(onChange.mock.calls[0]?.[0].target.value).toBe('123')
  })

  it('formats numberWithComma values while reporting an unformatted value', () => {
    const onChange = vi.fn()
    render(
      <Input
        numberWithComma
        onChange={(event) => onChange(event.target.value)}
        value='1200'
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('1,200')

    fireEvent.change(input, { target: { value: '12,300' } })

    expect(onChange).toHaveBeenCalledWith('12300')
  })

  it('does not emit a numerical change that exceeds maxLength', () => {
    const onChange = vi.fn()
    render(<Input maxLength={3} numerical onChange={onChange} />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '1234' },
    })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('exposes switch checked state', async () => {
    const user = userEvent.setup()
    render(<Switch aria-label='Paper delivery' />)

    await user.click(screen.getByRole('switch', { name: 'Paper delivery' }))

    const control = screen.getByRole('switch', { name: 'Paper delivery' })
    expect(control).toHaveAttribute('data-state', 'checked')
    expect(control).toHaveClass('h-8', 'w-12')
  })

  it('supports a compact visual switch while preserving its semantic control', () => {
    render(<Switch aria-label='Compact paper delivery' size='sm' />)

    const control = screen.getByRole('switch', {
      name: 'Compact paper delivery',
    })

    expect(control).toHaveAttribute('data-size', 'sm')
    expect(control).toHaveClass('h-7', 'w-11')
  })

  it('supports an extra-compact visual switch for dense settings', () => {
    render(<Switch aria-label='Extra compact paper delivery' size='xs' />)

    const control = screen.getByRole('switch', {
      name: 'Extra compact paper delivery',
    })

    expect(control).toHaveAttribute('data-size', 'xs')
    expect(control).toHaveClass('h-5', 'w-9')
  })
})
