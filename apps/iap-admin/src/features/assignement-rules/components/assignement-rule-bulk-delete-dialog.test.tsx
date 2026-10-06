// @vitest-environment jsdom
import { AssignementRuleBulkDeleteDialog } from '@features/assignement-rules/components/assignement-rule-bulk-delete-dialog'
import { useAssignementRuleStore } from '@features/assignement-rules/context/store/assignement-rule-store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@iap/dialogs', () => ({
  ConfirmDialog: ({
    onConfirm,
    open,
    title,
  }: {
    onConfirm: () => void
    open: boolean
    title: React.ReactNode
  }) =>
    open ? (
      <div>
        <span>{title}</span>
        <button onClick={onConfirm} type='button'>
          confirm-bulk-delete
        </button>
      </div>
    ) : null,
}))

const { mockBulkDelete } = vi.hoisted(() => ({
  mockBulkDelete: vi.fn(),
}))
vi.mock(
  '@features/assignement-rules/services/assignement-rule-service',
  () => ({
    assignementRuleService: {
      bulkDelete: mockBulkDelete,
    },
    default: {
      bulkDelete: mockBulkDelete,
    },
  })
)

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('AssignementRuleBulkDeleteDialog', () => {
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

  it('renders and triggers bulk delete on confirmation', async () => {
    const refetch = vi.fn()
    mockBulkDelete.mockResolvedValueOnce(undefined as never)

    useAssignementRuleStore.setState({
      open: 'bulkDelete',
      openDialog: 'bulkDelete',
      rowSelection: { 'rule-1': true, 'rule-2': true },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <AssignementRuleBulkDeleteDialog
          ids={['rule-1', 'rule-2']}
          refetch={refetch}
        />
      </QueryClientProvider>
    )

    const deleteBtn = screen.getByRole('button', {
      name: 'confirm-bulk-delete',
    })
    fireEvent.click(deleteBtn)

    await waitFor(() => {
      expect(mockBulkDelete).toHaveBeenCalledWith(['rule-1', 'rule-2'])
      expect(refetch).toHaveBeenCalled()
      expect(useAssignementRuleStore.getState().open).toBeNull()
      expect(useAssignementRuleStore.getState().rowSelection).toEqual({})
    })
  })
})
