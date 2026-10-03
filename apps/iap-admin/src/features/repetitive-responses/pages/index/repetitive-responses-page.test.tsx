import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { RepetitiveResponsesPage } from './repetitive-responses-page'

vi.mock(
  '@features/repetitive-responses/model/repetitive-response-provider',
  () => ({
    RepetitiveResponseProvider: ({ children }: { children: ReactNode }) => (
      <div data-testid='provider'>{children}</div>
    ),
  })
)
vi.mock(
  '@features/repetitive-responses/pages/index/components/groups/repetitive-response-groups',
  () => ({ default: () => <div data-testid='groups' /> })
)
vi.mock(
  '@features/repetitive-responses/pages/index/components/responses/repetitive-responses-section',
  () => ({ default: () => <div data-testid='responses' /> })
)

describe('RepetitiveResponsesPage', () => {
  it('keeps the reference provider and groups-to-responses composition order', () => {
    const { container } = render(<RepetitiveResponsesPage />)
    const provider = screen.getByTestId('provider')

    expect(provider.contains(screen.getByTestId('groups'))).toBe(true)
    expect(provider.contains(screen.getByTestId('responses'))).toBe(true)
    expect(container.innerHTML.indexOf('data-testid="groups"')).toBeLessThan(
      container.innerHTML.indexOf('data-testid="responses"')
    )
  })
})
