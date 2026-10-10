import type { ComponentProps } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MyIapPage } from './my-iap-page'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    children,
    ...rest
  }: ComponentProps<'a'> & { search?: unknown; to: string }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}))

vi.mock('@iap/auth', () => ({
  useAuthSession: () => ({
    user: { displayName: 'کاربر آزمایشی', username: 'testuser' },
  }),
}))

vi.mock('@iap/theme', () => ({
  useThemeStore: () => 'light',
}))

vi.mock('@modules/insurance-policies', () => ({
  useGetMyInsurancePolicy: () => ({ data: [] }),
}))

describe('MyIapPage', () => {
  it('renders all four action cards with exact titles and links', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MyIapPage />
      </QueryClientProvider>
    )

    // 1. Create claim card
    expect(screen.getByText('myiap.myIapPage.createClaimTitle')).toBeTruthy()
    expect(
      screen.getByText('myiap.myIapPage.createClaimDescription')
    ).toBeTruthy()
    const createClaimLink = screen
      .getByText('myiap.myIapPage.createClaimTitle')
      .closest('a')
    expect(createClaimLink?.getAttribute('href')).toBe('/myclaims/create/')

    // 2. My claims card
    expect(screen.getByText('myiap.myIapPage.myClaimsTitle')).toBeTruthy()
    expect(screen.getByText('myiap.myIapPage.myClaimsDescription')).toBeTruthy()
    const myClaimsLink = screen
      .getByText('myiap.myIapPage.myClaimsTitle')
      .closest('a')
    expect(myClaimsLink?.getAttribute('href')).toBe('/myclaims/')

    // 3. Create special disease card
    expect(
      screen.getByText('myiap.myIapPage.createSpecialDiseaseTitle')
    ).toBeTruthy()
    expect(
      screen.getByText('myiap.myIapPage.createSpecialDiseaseDescription')
    ).toBeTruthy()
    const createSpecialDiseaseLink = screen
      .getByText('myiap.myIapPage.createSpecialDiseaseTitle')
      .closest('a')
    expect(createSpecialDiseaseLink?.getAttribute('href')).toBe(
      '/special-diseases/create/'
    )

    // 4. My special diseases card
    expect(
      screen.getByText('myiap.myIapPage.mySpecialDiseasesTitle')
    ).toBeTruthy()
    expect(
      screen.getByText('myiap.myIapPage.mySpecialDiseasesDescription')
    ).toBeTruthy()
    const mySpecialDiseasesLink = screen
      .getByText('myiap.myIapPage.mySpecialDiseasesTitle')
      .closest('a')
    expect(mySpecialDiseasesLink?.getAttribute('href')).toBe(
      '/special-diseases/'
    )
  })
})
