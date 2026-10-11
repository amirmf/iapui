import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Card, CardDescription, CardTitle } from './card'

describe('Card', () => {
  it('uses the shared card-surface styling by default', () => {
    render(<Card>Content</Card>)

    expect(screen.getByText('Content')).toHaveClass(
      'rounded-xl',
      'border',
      'bg-card',
      'text-card-foreground',
      'flex',
      'flex-col',
      'gap-6',
      'py-6',
      'shadow-sm'
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

describe('Card title and description semantics', () => {
  it('preserves defaults and supports reference div tags', () => {
    render(
      <>
        <CardTitle>Default title</CardTitle>
        <CardDescription>Default description</CardDescription>
        <CardTitle as='div'>Reference title</CardTitle>
        <CardDescription as='div'>Reference description</CardDescription>
      </>
    )
    expect(screen.getByText('Default title').tagName).toBe('H2')
    expect(screen.getByText('Default description').tagName).toBe('P')
    expect(screen.getByText('Reference title').tagName).toBe('DIV')
    expect(screen.getByText('Reference description').tagName).toBe('DIV')
  })
})
