// @vitest-environment jsdom
import type { ReactNode } from 'react'

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AgentClaimRequestAccountNotFoundDialog } from './agent-claim-request-account-not-found-dialog'

const mockNavigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@iap/dialogs', () => ({
  ConfirmDialog: (props: {
    open: boolean
    title: ReactNode
    description: ReactNode
    confirmLabel: ReactNode
    footerChildren: ReactNode
    onConfirm: () => void
    onOpenChange: (open: boolean) => void
  }) =>
    props.open ? (
      <div data-testid='not-found-dialog'>
        <div data-testid='dialog-title'>{props.title}</div>
        <div data-testid='dialog-desc'>{props.description}</div>
        <button onClick={props.onConfirm}>{props.confirmLabel}</button>
        {props.footerChildren}
      </div>
    ) : null,
}))

describe('AgentClaimRequestAccountNotFoundDialog', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders title, description and actions when open', () => {
    const handleOpenChange = vi.fn()
    render(
      <AgentClaimRequestAccountNotFoundDialog
        open={true}
        onOpenChange={handleOpenChange}
      />
    )

    expect(screen.getByTestId('not-found-dialog')).toBeDefined()
    expect(screen.getByTestId('dialog-title').textContent).toBe(
      'agent.claimRequests.create.accountNotFound.title'
    )
    expect(
      screen.getByText('agent.claimRequests.create.accountNotFound.understood')
    ).toBeDefined()
    expect(
      screen.getByText(
        'agent.claimRequests.create.accountNotFound.registerInsured'
      )
    ).toBeDefined()
  })

  it('calls onOpenChange(false) when confirm understood is clicked', () => {
    const handleOpenChange = vi.fn()
    render(
      <AgentClaimRequestAccountNotFoundDialog
        open={true}
        onOpenChange={handleOpenChange}
      />
    )

    fireEvent.click(
      screen.getByText('agent.claimRequests.create.accountNotFound.understood')
    )
    expect(handleOpenChange).toHaveBeenCalledWith(false)
  })

  it('navigates to /agent/users/create/ when register insured button is clicked', () => {
    const handleOpenChange = vi.fn()
    render(
      <AgentClaimRequestAccountNotFoundDialog
        open={true}
        onOpenChange={handleOpenChange}
      />
    )

    fireEvent.click(
      screen.getByText(
        'agent.claimRequests.create.accountNotFound.registerInsured'
      )
    )
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/agent/users/create/' })
  })

  it('does not render when open is false', () => {
    const handleOpenChange = vi.fn()
    render(
      <AgentClaimRequestAccountNotFoundDialog
        open={false}
        onOpenChange={handleOpenChange}
      />
    )

    expect(screen.queryByTestId('not-found-dialog')).toBeNull()
  })
})
