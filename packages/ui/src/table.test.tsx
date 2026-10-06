import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Table } from './table'

afterEach(cleanup)
describe('table wrapper reference presentation', () => {
  it('keeps existing defaults and opts into source positioning', () => {
    const { rerender } = render(<Table aria-label='invoices' />)
    expect(screen.getByRole('table').parentElement?.className).not.toContain(
      'relative'
    )
    rerender(<Table aria-label='invoices' presentation='reference' />)
    expect(screen.getByRole('table').parentElement?.className).toContain(
      'relative'
    )
    expect(screen.getByRole('table').hasAttribute('presentation')).toBe(false)
  })
})
