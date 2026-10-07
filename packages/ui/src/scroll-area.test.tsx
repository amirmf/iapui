import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ScrollArea } from './scroll-area'

describe('ScrollArea source composition', () => {
  it('retains its viewport and forwards keyboard focus semantics', () => {
    const { container } = render(
      <ScrollArea aria-label='Templates' className='h-40'>
        <button>Response</button>
      </ScrollArea>
    )
    expect(screen.getByLabelText('Templates').getAttribute('data-slot')).toBe(
      'scroll-area'
    )
    expect(
      container.querySelector('[data-slot="scroll-area-viewport"]')
    ).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Response' })).toBeDefined()
  })

  it('preserves the source horizontal viewport presentation when selected', () => {
    const { container } = render(
      <ScrollArea orientation='horizontal'>History</ScrollArea>
    )
    expect(
      container.querySelector('[data-slot="scroll-area-viewport"]')?.className
    ).toContain('overflow-x-auto!')
  })
})
