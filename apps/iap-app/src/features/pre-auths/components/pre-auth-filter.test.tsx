import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PreAuthFilter } from './pre-auth-filter'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'myiap.preAuths.filters.insuredPerson': 'شخص تحت پوشش',
        'myiap.preAuths.filters.policy': 'بیمه‌نامه',
        'myiap.preAuths.filters.selectInsuredPerson':
          'شخص تحت پوشش را انتخاب کنید',
        'myiap.preAuths.filters.selectPolicy': 'بیمه‌نامه را انتخاب کنید',
      }
      return translations[key] ?? key
    },
  }),
}))

vi.mock('@modules/insurance-policies', () => ({
  useGetMyInsurancePolicy: () => ({
    data: [
      { id: 10, planId: 1, title: 'بیمه‌نامه طلایی درمان' },
      { id: 20, planId: 2, title: 'بیمه‌نامه نقره‌ای درمان' },
    ],
    isLoading: false,
  }),
}))

vi.mock('@modules/sub-insured-people', () => ({
  useGetMySubInsuredPeople: () => ({
    data: [
      {
        fullName: 'علی رضایی',
        id: 1,
        isForeign: 'N',
        nationalCode: '0011223344',
      },
    ],
    isLoading: false,
  }),
}))

describe('PreAuthFilter', () => {
  it('renders policy and insured person form field labels and placeholders', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const onApply = vi.fn()
    const onClear = vi.fn()

    render(
      <QueryClientProvider client={queryClient}>
        <PreAuthFilter onApply={onApply} onClear={onClear} />
      </QueryClientProvider>
    )

    expect(screen.getByText('بیمه‌نامه')).toBeDefined()
    expect(screen.getByText('شخص تحت پوشش')).toBeDefined()
  })
})
