import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Permission } from './permission'

describe('Permission', () => {
  it('renders its children when the condition is true', () => {
    render(
      <Permission hasPermission>
        <button type='button'>Create request</button>
      </Permission>
    )

    expect(
      screen.getByRole('button', { name: 'Create request' })
    ).toBeInTheDocument()
  })

  it('does not render its children when the condition is false', () => {
    render(
      <Permission hasPermission={false}>
        <button type='button'>Create request</button>
      </Permission>
    )

    expect(
      screen.queryByRole('button', { name: 'Create request' })
    ).not.toBeInTheDocument()
  })
})
