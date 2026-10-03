import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PersonSpecialDiseasesPage } from './person-special-diseases-page'

vi.mock(
  '@features/person-special-diseases/components/person-special-disease-bulk-delete-dialog',
  () => ({
    PersonSpecialDiseaseBulkDeleteDialog: () => null,
  })
)
vi.mock(
  '@features/person-special-diseases/components/person-special-disease-columns',
  () => ({
    usePersonSpecialDiseaseColumns: () => [],
  })
)
vi.mock(
  '@features/person-special-diseases/components/person-special-disease-delete-dialog',
  () => ({
    PersonSpecialDiseaseDeleteDialog: () => null,
  })
)
vi.mock(
  '@features/person-special-diseases/components/person-special-disease-form-dialog',
  () => ({
    PersonSpecialDiseaseFormDialog: () => null,
  })
)
vi.mock('@modules/person-special-diseases', () => ({
  personSpecialDiseaseService: {
    getPage: vi.fn().mockResolvedValue({
      content: [],
      number: 0,
      size: 40,
      totalElements: 0,
      totalPages: 0,
    }),
  },
}))
vi.mock('@iap/ui', () => ({
  Button: (props: React.ComponentProps<'button'>) => <button {...props} />,
  cn: (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(' '),
}))
vi.mock('@shared/tables', () => ({
  PaginatedDataTable: () => <div role='table' />,
}))
vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({ navigate: vi.fn() }),
  useRouterState: () => ({}),
}))

describe('PersonSpecialDiseasesPage', () => {
  it('renders the reference page title and management actions', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <PersonSpecialDiseasesPage />
      </QueryClientProvider>
    )

    expect((await screen.findByRole('heading', { level: 2 })).textContent).toBe(
      'بیماری‌های خاص اشخاص'
    )
    expect(screen.getByRole('button', { name: 'بروزرسانی' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'ایجاد' })).toBeTruthy()
    expect(
      (screen.getByRole('button', { name: 'حذف' }) as HTMLButtonElement)
        .disabled
    ).toBe(true)
    expect(screen.getByRole('table')).toBeTruthy()
  })
})
