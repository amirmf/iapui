// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useAssignementRuleStore } from '../context/store/assignement-rule-store'
import { AssignementRuleDeleteDialog } from './assignement-rule-delete-dialog'

vi.mock('@iap/dialogs', () => ({
  ConfirmDialog: ({
    onConfirm,
    open,
    title,
  }: {
    onConfirm: () => void
    open: boolean
    title: string
  }) =>
    open ? (
      <div>
        <span>{title}</span>
        <button onClick={onConfirm} type='button'>
          confirm-delete
        </button>
      </div>
    ) : null,
}))

const { mockDelete } = vi.hoisted(() => ({
  mockDelete: vi.fn(),
}))
vi.mock('../services/assignement-rule-service', () => ({
  assignementRuleService: {
    delete: mockDelete,
  },
  default: {
    delete: mockDelete,
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('AssignementRuleDeleteDialog', () => {
  let queryClient: QueryClient

  afterEach(cleanup)

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    useAssignementRuleStore.getState().reset()
    vi.clearAllMocks()
  })

  it('renders and triggers delete on confirmation', async () => {
    const refetch = vi.fn()
    mockDelete.mockResolvedValueOnce(undefined as never)

    useAssignementRuleStore.setState({
      currentRow: { id: 'rule-to-delete', title: 'Target Rule' },
      open: 'delete',
      openDialog: 'delete',
    })

    render(
      <QueryClientProvider client={queryClient}>
        <AssignementRuleDeleteDialog refetch={refetch} />
      </QueryClientProvider>
    )

    expect(screen.getByText('assignementRules.dialog.delete')).toBeDefined()

    const deleteBtn = screen.getByRole('button', { name: 'confirm-delete' })
    fireEvent.click(deleteBtn)

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('rule-to-delete')
      expect(refetch).toHaveBeenCalled()
      expect(useAssignementRuleStore.getState().open).toBeNull()
    })
  })
})
