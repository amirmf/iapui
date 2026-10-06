import { i18n, i18nReady } from '@shared/i18n/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { SortingState, Updater } from '@tanstack/react-table'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AiAssessmentRulesPage } from './ai-assessment-rules-page'
import { useAiAssessmentRuleStore } from './context/store/ai-assessment-rule-store'
import { aiAssessmentRuleService } from './services/ai-assessment-rule-service'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  search: { page: '1', size: '30' },
  table: vi.fn(),
}))

vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({ navigate: mocks.navigate }),
  useRouterState: (props: { select: (state: unknown) => unknown }) =>
    props.select({ location: { search: mocks.search } }),
}))

vi.mock('./services/ai-assessment-rule-service', () => ({
  aiAssessmentRuleService: {
    bulkDelete: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    getById: vi.fn(),
    list: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock(
  './components/ai-assessment-rule-form-dialog/ai-assessment-rule-form-dialog',
  () => ({
    AiAssessmentRuleFormDialog: () => null,
  })
)

vi.mock('./components/ai-assessment-rule-delete-dialog', () => ({
  AiAssessmentRuleDeleteDialog: () => null,
}))

vi.mock('./components/ai-assessment-rule-bulk-delete-dialog', () => ({
  AiAssessmentRuleBulkDeleteDialog: () => null,
}))

vi.mock('./components/ai-assessment-rules-data-table-toolbar', () => ({
  AiAssessmentRulesDataTableToolbar: () => null,
}))

vi.mock('./components/ai-assessment-rule-inspector', () => ({
  AiAssessmentRuleInspector: () => <div data-testid='inspector'>Inspector</div>,
}))

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
          onClick={() => props.onSortingChange([{ desc: true, id: 'title' }])}
        >
          sort test
        </button>
      )
    },
  }
})

describe('AiAssessmentRulesPage', () => {
  let queryClient: QueryClient

  beforeEach(async () => {
    await i18nReady
    vi.clearAllMocks()
    useAiAssessmentRuleStore.getState().reset()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.mocked(aiAssessmentRuleService.list).mockResolvedValue({
      content: [],
      empty: true,
      first: true,
      last: true,
      number: 0,
      numberOfElements: 0,
      size: 30,
      totalElements: 0,
      totalPages: 0,
    })
  })

  afterEach(cleanup)

  function mount() {
    return render(
      <QueryClientProvider client={queryClient}>
        <AiAssessmentRulesPage />
      </QueryClientProvider>
    )
  }

  it('renders page title and description', () => {
    mount()
    expect(screen.getByText(i18n.t('aiAssessmentRules.title'))).toBeTruthy()
    expect(
      screen.getByText(i18n.t('aiAssessmentRules.description'))
    ).toBeTruthy()
    expect(screen.getByTestId('inspector')).toBeTruthy()
  })

  it('triggers create dialog when create action is clicked', () => {
    mount()
    const createButton = screen.getByRole('button', {
      name: new RegExp(i18n.t('aiAssessmentRules.actions.create')),
    })
    fireEvent.click(createButton)
    expect(useAiAssessmentRuleStore.getState().open).toBe('create')
  })

  it('handles sorting interaction through table state', () => {
    mount()
    const sortButton = screen.getByText('sort test')
    fireEvent.click(sortButton)
    expect(mocks.navigate).toHaveBeenCalledWith(
      expect.objectContaining({
        search: expect.objectContaining({
          direction: 'desc',
          sort: 'title',
        }),
      })
    )
  })
})
