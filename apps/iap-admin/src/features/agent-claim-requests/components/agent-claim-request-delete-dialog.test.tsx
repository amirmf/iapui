// @vitest-environment jsdom
import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useAgentClaimRequestStore } from '../context/claim-request-context'
import { agentClaimRequestService } from '../services/agent-claim-request-service'
import { AgentClaimRequestDeleteDialog } from './agent-claim-request-delete-dialog'

const mockDelete = vi.hoisted(() => vi.fn())

vi.mock('../services/agent-claim-request-service', () => {
  const service = { delete: mockDelete }
  return {
    agentClaimRequestService: service,
    default: service,
  }
})

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>()
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  }
})

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@iap/dialogs', () => ({
  ConfirmDialog: (props: {
    open: boolean
    isLoading: boolean
    onConfirm: () => void
    onOpenChange: (open: boolean) => void
    confirmLabel: string
    title: ReactNode
    description: string
  }) =>
    props.open ? (
      <div data-testid='confirm-dialog'>
        <span>{props.title}</span>
        <span>{props.description}</span>
        <button disabled={props.isLoading} onClick={props.onConfirm}>
          {props.confirmLabel}
        </button>
        <button onClick={() => props.onOpenChange(false)}>cancel</button>
      </div>
    ) : null,
}))

describe('AgentClaimRequestDeleteDialog', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    useAgentClaimRequestStore.getState().reset()
    vi.clearAllMocks()
  })

  afterEach(cleanup)

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it('renders nothing when currentRow is null', () => {
    const { container } = render(<AgentClaimRequestDeleteDialog />, { wrapper })
    expect(container.firstChild).toBeNull()
  })

  it('renders confirmation dialog when open and currentRow is set', () => {
    useAgentClaimRequestStore.setState({
      open: 'delete',
      currentRow: { id: 'req-1' } as never,
    })

    render(<AgentClaimRequestDeleteDialog />, { wrapper })
    expect(
      screen.getByText('common.dialog.deleteDialog.permanentTitle')
    ).toBeDefined()
    expect(
      screen.getByText('common.dialog.deleteDialog.confirmMessage')
    ).toBeDefined()
  })

  it('calls delete service on confirm click', async () => {
    vi.mocked(agentClaimRequestService.delete).mockResolvedValueOnce(undefined)
    useAgentClaimRequestStore.setState({
      open: 'delete',
      currentRow: { id: 'req-123' } as never,
    })

    render(<AgentClaimRequestDeleteDialog />, { wrapper })
    const confirmButton = screen.getByRole('button', { name: 'common.delete' })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(agentClaimRequestService.delete).toHaveBeenCalledWith('req-123')
    })
  })
})
