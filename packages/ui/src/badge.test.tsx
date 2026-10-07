import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Badge } from './badge'

afterEach(cleanup)

describe('Badge composition', () => {
  it('preserves the default span and applies reference classes only when selected', () => {
    const { rerender } = render(<Badge>Default</Badge>)
    expect(screen.getByText('Default').tagName).toBe('SPAN')
    expect(screen.getByText('Default').className).not.toContain(
      'focus-visible:ring-[3px]'
    )
    rerender(<Badge presentation='reference'>Reference</Badge>)
    expect(screen.getByText('Reference').className).toContain(
      'focus-visible:ring-[3px]'
    )
  })

  it('composes a real button without an extra wrapper or leaked asChild attribute', () => {
    const click = vi.fn()
    render(
      <Badge
        asChild
        presentation='reference'
        variant='outline'
        className='capitalize'
      >
        <button type='button' onClick={click}>
          Status
        </button>
      </Badge>
    )
    const button = screen.getByRole('button')
    expect(button.getAttribute('data-slot')).toBe('badge')
    expect(button.hasAttribute('asChild')).toBe(false)
    expect(button.className).toContain('capitalize')
    fireEvent.click(button)
    expect(click).toHaveBeenCalledOnce()
  })
})
