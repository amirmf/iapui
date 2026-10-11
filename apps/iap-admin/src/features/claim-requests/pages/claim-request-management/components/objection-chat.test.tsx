// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ObjectionChat from './objection-chat'

vi.mock('@shared/i18n/i18n', () => ({
  i18n: { language: 'en' },
  useTranslate: () => ({ t: (key: string) => key }),
}))
afterEach(cleanup)

describe('ObjectionChat source presentation', () => {
  it('orders and renders roles with Tehran timestamps and source bubble layout', () => {
    const objections = Object.freeze([
      {
        id: 'two',
        description: 'Agent reply',
        roleType: 'EXPERT' as const,
        createdAt: '2026-10-11T10:00:00Z',
      },
      {
        id: 'one',
        description: 'User request',
        roleType: 'ENDUSER' as const,
        createdAt: '2026-10-11T09:00:00Z',
      },
    ])
    const { container } = render(
      <ObjectionChat objections={[...objections]} presentation='reference' />
    )
    expect(container.textContent?.indexOf('User request')).toBeLessThan(
      container.textContent?.indexOf('Agent reply') ?? -1
    )
    expect(screen.getByText('Oct 11, 2026 12:30')).toBeDefined()
    expect(screen.getByText('objectionChat.user')).toBeDefined()
    expect(screen.getByText('objectionChat.admin')).toBeDefined()
    expect(screen.getByText('User request').parentElement?.className).toContain(
      'rounded-br-none'
    )
    expect(screen.getByText('Agent reply').parentElement?.className).toContain(
      'bg-primary-600'
    )
  })
  it('uses source invalid timestamp failure only for reference consumers', () => {
    const objections = [{ description: 'Invalid', createdAt: 'invalid' }]
    const { unmount } = render(<ObjectionChat objections={objections} />)
    expect(screen.getByText('-', { selector: 'div' })).toBeDefined()
    unmount()
    expect(() =>
      render(<ObjectionChat objections={objections} presentation='reference' />)
    ).toThrow(RangeError)
  })
  it('does not render empty conversations', () => {
    const { container } = render(
      <ObjectionChat objections={null} presentation='reference' />
    )
    expect(container.childElementCount).toBe(0)
  })
})
