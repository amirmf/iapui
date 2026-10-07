import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Button, buttonVariants } from './button'

describe('Button', () => {
  it('preserves an explicit native submit type', () => {
    render(<Button type='submit'>Continue</Button>)

    expect(screen.getByRole('button', { name: 'Continue' })).toHaveAttribute(
      'type',
      'submit'
    )
  })

  it('allows a ghost button to override its horizontal padding', () => {
    render(
      <Button className='px-0' variant='ghost'>
        Change number
      </Button>
    )

    const button = screen.getByRole('button', { name: 'Change number' })
    expect(button).toHaveClass('px-0')
    expect(button).not.toHaveClass('px-4')
  })

  it('preserves default ghost hover colors for components and variant consumers', () => {
    render(<Button variant='ghost'>Default ghost</Button>)

    expect(screen.getByRole('button', { name: 'Default ghost' })).toHaveClass(
      'hover:bg-gray-100',
      'hover:text-gray-900',
      'dark:hover:bg-gray-700',
      'dark:hover:text-gray-50'
    )
    expect(buttonVariants({ variant: 'ghost' }).split(' ')).toContain(
      'dark:hover:text-gray-50'
    )
  })

  it('uses reference ghost colors without a dark hover text override', () => {
    render(
      <Button presentation='reference' variant='ghost'>
        Reference ghost
      </Button>
    )

    const button = screen.getByRole('button', { name: 'Reference ghost' })
    expect(button).toHaveClass(
      'hover:bg-accent',
      'hover:text-accent-foreground',
      'dark:hover:bg-accent/50'
    )
    expect(button).not.toHaveClass('dark:hover:text-gray-50')
  })

  it('preserves the Support header hover text override in reference presentation', () => {
    render(
      <Button
        presentation='reference'
        variant='ghost'
        className='text-primary-foreground hover:text-primary-foreground'
      >
        Close Support
      </Button>
    )

    const button = screen.getByRole('button', { name: 'Close Support' })
    expect(button).toHaveClass('hover:text-primary-foreground')
    expect(button).not.toHaveClass(
      'hover:text-accent-foreground',
      'dark:hover:text-gray-50'
    )
  })
})
