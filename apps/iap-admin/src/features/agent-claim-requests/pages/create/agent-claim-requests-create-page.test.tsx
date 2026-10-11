// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AgentClaimRequestsCreatePage } from './agent-claim-requests-create-page'

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}))

vi.mock('./components', () => ({
  AgentClaimRequestForm: () => (
    <div data-testid='claim-request-form'>Form Content</div>
  ),
}))

describe('AgentClaimRequestsCreatePage', () => {
  afterEach(cleanup)

  it('renders Card and AgentClaimRequestForm inside max-w-3xl container', () => {
    const { container } = render(<AgentClaimRequestsCreatePage />)

    const wrapper = container.querySelector('.max-w-3xl')
    expect(wrapper).toBeDefined()
    expect(screen.getByTestId('claim-request-form')).toBeDefined()
  })
})
