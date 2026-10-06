// @vitest-environment jsdom
import { AssignementRulesPage } from '@features/assignement-rules/assignement-rules-page'
import { i18nReady } from '@shared/i18n/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock(
  '@features/assignement-rules/components/assignement-rule-bulk-delete-dialog',
  () => ({
    AssignementRuleBulkDeleteDialog: () => null,
  })
)
vi.mock(
  '@features/assignement-rules/components/assignement-rule-delete-dialog',
  () => ({
    AssignementRuleDeleteDialog: () => null,
  })
)
vi.mock(
  '@features/assignement-rules/components/assignement-rule-form-dialog',
  () => ({
    AssignementRuleFormDialog: () => null,
  })
)
vi.mock(
  '@features/assignement-rules/components/assignement-rule-columns',
  () => ({
    useAssignementRuleColumns: () => [],
  })
)
vi.mock(
  '@features/assignement-rules/components/assignement-rule-data-table-toolbar',
  () => ({
    AssignementRuleDataTableToolbar: () => <div data-testid='toolbar' />,
  })
)
vi.mock(
  '@features/assignement-rules/services/assignement-rule-service',
  () => ({
    assignementRuleService: {
      getPage: vi.fn().mockResolvedValue({
        content: [],
        number: 0,
        size: 40,
        totalElements: 0,
        totalPages: 0,
      }),
    },
  })
)
vi.mock('@shared/tables', () => ({
  PaginatedDataTable: () => <div role='table' />,
}))
vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({ navigate: vi.fn() }),
  useRouterState: () => ({}),
}))

describe('AssignementRulesPage', () => {
  let queryClient: QueryClient

  beforeEach(async () => {
    await i18nReady
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
  })

  it('renders the page title, management actions, toolbar, and table', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AssignementRulesPage />
      </QueryClientProvider>
    )

    expect((await screen.findByRole('heading', { level: 2 })).textContent).toBe(
      'قوانین ارجاع'
    )
    expect(screen.getByRole('button', { name: 'بروزرسانی' })).toBeDefined()
    expect(
      screen.getByRole('button', { name: 'ایجاد قانون ارجاع' })
    ).toBeDefined()
    expect(
      (
        screen.getByRole('button', {
          name: 'حذف انتخاب‌شده‌ها',
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
    expect(screen.getByTestId('toolbar')).toBeDefined()
    expect(screen.getByRole('table')).toBeDefined()
  })
})
