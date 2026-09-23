import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Button } from './button'

describe('Button', () => {
  it('preserves an explicit native submit type', () => {
    render(<Button type='submit'>Continue</Button>)

    expect(screen.getByRole('button', { name: 'Continue' })).toHaveAttribute(
      'type',
      'submit'
    )
  })
})
