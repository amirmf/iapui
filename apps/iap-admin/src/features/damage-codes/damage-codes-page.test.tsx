import { useDamageCodeStore } from '@features/damage-codes/model/store/damage-code-store'
import { i18nReady } from '@shared/i18n/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DamageCodesPage } from './damage-codes-page'

const { pricingSection } = vi.hoisted(() => ({
  pricingSection: vi.fn(() => <div data-testid='pricing-section' />),
}))

vi.mock(
  '@features/damage-codes/components/pricings/damage-code-pricings-section',
  () => ({ DamageCodePricingsSection: pricingSection })
)
vi.mock(
  '@features/damage-codes/components/damage-code-table/damage-code-columns',
  () => ({
    useDamageCodeColumns: () => [],
  })
)
vi.mock(
  '@features/damage-codes/components/damage-code-table/damage-code-data-table-tools',
  () => ({
    DamageCodeDataTableTools: () => null,
  })
)
vi.mock(
  '@features/damage-codes/components/damage-code-dialogs/damage-code-delete-method-dialog',
  () => ({
    DamageCodeDeleteMethodDialog: () => null,
  })
)
vi.mock(
  '@features/damage-codes/components/damage-code-dialogs/damage-code-form-dialog',
  () => ({
    DamageCodeFormDialog: () => null,
  })
)
vi.mock(
  '@features/damage-codes/components/pricings/damage-code-pricing-dialog',
  () => ({
    DamageCodePricingDialog: () => null,
  })
)
vi.mock(
  '@features/damage-codes/components/damage-code-dialogs/damage-code-view-dialog',
  () => ({
    DamageCodeViewDialog: () => null,
  })
)
vi.mock('@features/damage-codes/services/damage-code-service', () => ({
  damageCodeService: { getPage: vi.fn() },
}))
vi.mock('@iap/auth', () => ({
  isSuperAdminRole: () => true,
  useAuthSession: () => ({ user: { roles: ['SUPER_ADMIN'] } }),
}))
vi.mock('@iap/ui', () => ({
  Button: (props: React.ComponentProps<'button'>) => <button {...props} />,
  Permission: ({ children }: { children: React.ReactNode }) => children,
  cn: (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(' '),
}))
vi.mock('@shared/tables', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@shared/tables')>()),
  PaginatedDataTable: () => null,
}))
vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useQuery: () => ({
    data: {
      content: [
        {
          code: 'D-1',
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'ACTIVE',
          title: 'ویزیت',
        },
      ],
      totalElements: 1,
      totalPages: 1,
    },
    isLoading: false,
    refetch: vi.fn(),
  }),
}))
vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({ navigate: vi.fn() }),
  useRouterState: () => ({}),
}))

describe('DamageCodesPage', () => {
  beforeEach(async () => {
    await i18nReady
    pricingSection.mockClear()
    useDamageCodeStore.getState().reset()
    useDamageCodeStore.setState({
      currentRow: {
        code: 'D-1',
        id: '550e8400-e29b-41d4-a716-446655440000',
        status: 'ACTIVE',
        title: 'ویزیت',
      },
      openDialog: 'pricing',
      rowSelection: { 0: true },
    })
  })

  it('keeps the pricing section mounted and passes the reference summary while pricing is open', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <DamageCodesPage />
      </QueryClientProvider>
    )

    expect(screen.getByTestId('pricing-section')).toBeTruthy()
    expect(pricingSection).toHaveBeenCalledWith(
      {
        damageCode: {
          code: 'D-1',
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'ویزیت',
        },
      },
      undefined
    )
  })
})
