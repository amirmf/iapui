import { useAssessmentPrompt } from '@features/assessment-prompts/context/store/assessment-prompt-store'
import { assessmentPromptService } from '@features/assessment-prompts/services/assessment-prompt-service'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { SortingState, Updater } from '@tanstack/react-table'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AssessmentPromptsPage } from './assessment-prompts-page'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  superAdmin: true,
  search: { page: '3', size: '40', status: ['ACTIVE'] },
  table: vi.fn(),
}))
vi.mock('@iap/auth', () => ({
  useAuthSession: () => ({ user: { roles: [] } }),
  isSuperAdminRole: () => mocks.superAdmin,
}))
vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({ navigate: mocks.navigate }),
  useRouterState: (props: { select: (state: unknown) => unknown }) =>
    props.select({ location: { search: mocks.search } }),
}))
vi.mock(
  '@features/assessment-prompts/services/assessment-prompt-service',
  () => ({ assessmentPromptService: { getPage: vi.fn() } })
)
vi.mock(
  '@features/assessment-prompts/components/assessment-prompt-form-dialog',
  () => ({ AssessmentPromptFormDialog: () => null })
)
vi.mock(
  '@features/assessment-prompts/components/assessment-prompt-view-dialog',
  () => ({ AssessmentPromptViewDialog: () => null })
)
vi.mock(
  '@features/assessment-prompts/components/assessment-prompt-delete-method-dialog',
  () => ({ AssessmentPromptDeleteMethodDialog: () => null })
)
vi.mock(
  '@features/assessment-prompts/components/assessment-prompts-data-table-toolbar',
  () => ({ AssessmentPromptsDataTableToolbar: () => null })
)
vi.mock('@shared/tables', async (importOriginal) => {
  const original = await importOriginal<typeof import('@shared/tables')>()
  return {
    ...original,
    PaginatedDataTable: (props: {
      onSortingChange: (updater: Updater<SortingState>) => void
    }) => {
      mocks.table(props)
      return (
        <button
          onClick={() => props.onSortingChange([{ id: 'title', desc: true }])}
        >
          sort test
        </button>
      )
    },
  }
})

describe('AssessmentPromptsPage reference composition', () => {
  beforeEach(async () => {
    await i18nReady
    vi.clearAllMocks()
    mocks.superAdmin = true
    useAssessmentPrompt.getState().reset()
    vi.mocked(assessmentPromptService.getPage).mockResolvedValue({
      content: [],
      totalPages: 0,
      totalElements: 0,
    })
  })
  afterEach(cleanup)
  function mount() {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    return render(
      <QueryClientProvider client={client}>
        <AssessmentPromptsPage />
      </QueryClientProvider>
    )
  }
  it('renders the source card/actions and retains page number when sorting', async () => {
    const { container } = mount()
    expect(container.querySelector('main')?.className).toContain(
      'rounded-[20px]'
    )
    expect(container.querySelector('main')?.className).toContain('sm:px-8')
    expect(
      screen.getByRole('heading', { name: i18n.t('assessmentPrompts.title') })
    ).toBeTruthy()
    expect(
      (
        screen.getByRole('button', {
          name: i18n.t('assessmentPrompts.bulkDelete.button'),
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'sort test' }))
    expect(mocks.navigate).toHaveBeenCalledWith(
      expect.objectContaining({
        search: expect.objectContaining({
          page: '3',
          size: '40',
          sort: 'title',
          direction: 'desc',
        }),
      })
    )
    await waitFor(() =>
      expect(assessmentPromptService.getPage).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
          size: 40,
          filters: { status: ['ACTIVE'] },
          signal: expect.any(AbortSignal),
        })
      )
    )
    expect(mocks.table).toHaveBeenCalledWith(
      expect.objectContaining({
        presentation: 'reference',
        tableWrapperClassName: 'max-h-[520px]',
      })
    )
  })
  it('hides selected deletion for non-superadmins and resets state on unmount', () => {
    mocks.superAdmin = false
    const view = mount()
    expect(
      screen.queryByRole('button', {
        name: i18n.t('assessmentPrompts.bulkDelete.button'),
      })
    ).toBeNull()
    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('assessmentPrompts.create') })
    )
    expect(useAssessmentPrompt.getState().open).toBe('create')
    view.unmount()
    expect(useAssessmentPrompt.getState().open).toBeNull()
  })
})
