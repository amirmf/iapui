import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Card } from './card'

describe('Card', () => {
  it('uses the shared card-surface styling by default', () => {
    render(<Card>Content</Card>)

    expect(screen.getByText('Content')).toHaveClass(
      'rounded-xl',
      'border',
      'border-border/35',
      'bg-card',
      'text-card-foreground',
      'shadow-sm',
      'shadow-primary/5'
    )
  })

  it('allows a caller to override the default card border', () => {
    render(<Card className='border-primary'>Content</Card>)

    expect(screen.getByText('Content')).toHaveClass('border-primary')
    expect(screen.getByText('Content')).not.toHaveClass('border-border/35')
  })

  it('preserves aside semantics when requested', () => {
    render(<Card as='aside'>Content</Card>)

    expect(screen.getByRole('complementary')).toHaveClass('shadow-sm')
  })
})
