import { useAssessmentPrompt } from '@features/assessment-prompts/context/store/assessment-prompt-store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AssessmentPromptDeleteMethodDialog } from './assessment-prompt-delete-method-dialog'

const mocks = vi.hoisted(() => ({
  hard: vi.fn(),
  soft: vi.fn(),
  success: vi.fn(),
}))
vi.mock(
  '@features/assessment-prompts/services/assessment-prompt-service',
  () => ({
    assessmentPromptService: {
      bulkDelete: mocks.hard,
      softDeleteBulk: mocks.soft,
    },
  })
)
vi.mock('@shared/i18n/i18n', () => ({
  useTranslate: () => ({ t: (key: string) => key }),
}))
vi.mock('sonner', () => ({ toast: { success: mocks.success } }))
vi.mock('@iap/dialogs', () => ({
  DeleteMethodDialog: (props: {
    open: boolean
    onDelete: (method: 'soft' | 'hard', date?: string) => Promise<void>
    onOpenChange: (open: boolean) => void
  }) =>
    props.open ? (
      <>
        <button
          onClick={() =>
            void props
              .onDelete('hard')
              .then(() => props.onOpenChange(false))
              .catch(() => {})
          }
        >
          hard
        </button>
        <button
          onClick={() =>
            void props
              .onDelete('soft', '2026-10-06T00:00:00.000Z')
              .then(() => props.onOpenChange(false))
              .catch(() => {})
          }
        >
          soft
        </button>
      </>
    ) : null,
}))

describe('assessment prompt selected deletion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAssessmentPrompt.getState().reset()
    useAssessmentPrompt.getState().setOpen('bulkDelete')
    useAssessmentPrompt.getState().setRowSelection({ '0': true, '1': false })
  })
  afterEach(cleanup)
  function mount() {
    const client = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
    const invalidate = vi.spyOn(client, 'invalidateQueries')
    render(
      <QueryClientProvider client={client}>
        <AssessmentPromptDeleteMethodDialog
          assessmentPrompts={[{ id: 'selected' }, { id: 'unselected' }]}
        />
      </QueryClientProvider>
    )
    return invalidate
  }
  it.each(['hard', 'soft'] as const)(
    'deletes only selected IDs through %s and clears selection after success',
    async (method) => {
      mocks.hard.mockResolvedValue(undefined)
      mocks.soft.mockResolvedValue([])
      const invalidate = mount()
      fireEvent.click(screen.getByRole('button', { name: method }))
      await waitFor(() =>
        expect(useAssessmentPrompt.getState().open).toBeNull()
      )
      if (method === 'hard')
        expect(mocks.hard).toHaveBeenCalledWith(['selected'])
      else
        expect(mocks.soft).toHaveBeenCalledWith(
          ['selected'],
          '2026-10-06T00:00:00.000Z'
        )
      expect(invalidate).toHaveBeenCalledWith({
        queryKey: ['assessment-prompts'],
      })
      expect(useAssessmentPrompt.getState().rowSelection).toEqual({})
    }
  )
  it('retains selection and does not invalidate after a failed request', async () => {
    mocks.hard.mockRejectedValue(new Error('failed'))
    const invalidate = mount()
    fireEvent.click(screen.getByRole('button', { name: 'hard' }))
    await waitFor(() => expect(mocks.hard).toHaveBeenCalled())
    expect(invalidate).not.toHaveBeenCalled()
    expect(mocks.success).not.toHaveBeenCalled()
    expect(useAssessmentPrompt.getState().open).toBe('bulkDelete')
    expect(useAssessmentPrompt.getState().rowSelection).toEqual({
      '0': true,
      '1': false,
    })
  })
})
