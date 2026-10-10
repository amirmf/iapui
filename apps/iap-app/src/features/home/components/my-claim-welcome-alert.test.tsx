import type { ComponentProps } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MyClaimWelcomeAlert } from './my-claim-welcome-alert'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { name?: string }) =>
      opts?.name ? `${key}:${opts.name}` : key,
  }),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...rest }: ComponentProps<'a'> & { to: string }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}))

vi.mock('@iap/auth', () => ({
  useAuthSession: () => ({
    user: { displayName: 'سید صادق', username: 'sadegh' },
  }),
}))

vi.mock('@iap/theme', () => ({
  useThemeStore: () => 'light',
}))

vi.mock('@modules/insurance-policies', () => ({
  useGetMyInsurancePolicy: () => ({ data: [] }),
}))

describe('MyClaimWelcomeAlert', () => {
  it('renders welcome title with user display name and action buttons', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MyClaimWelcomeAlert />
      </QueryClientProvider>
    )

    expect(
      screen.getByText('myiap.myIapPage.welcomeTitle:سید صادق')
    ).toBeTruthy()
    expect(screen.getByText('myiap.myIapPage.welcomeDescription')).toBeTruthy()
    expect(screen.getByText('myiap.myIapPage.panelIntroduction')).toBeTruthy()

    // Referral letters button link
    expect(
      screen.getByText('myiap.myIapPage.medicalReferralLetters')
    ).toBeTruthy()
    const referralLink = screen
      .getByText('myiap.myIapPage.medicalReferralLetters')
      .closest('a')
    expect(referralLink?.getAttribute('href')).toBe('/pre-auths/')

    // Contracting party centers link
    expect(
      screen.getByText('myiap.myIapPage.contractingPartyCenters')
    ).toBeTruthy()
    const centersLink = screen
      .getByText('myiap.myIapPage.contractingPartyCenters')
      .closest('a')
    expect(centersLink?.getAttribute('href')).toBe(
      'https://alborzinsurance.ir/MedicalCenters'
    )

    // Tutorial video link
    expect(screen.getByText('myiap.myIapPage.watchTutorial')).toBeTruthy()
    const tutorialLink = screen
      .getByText('myiap.myIapPage.watchTutorial')
      .closest('a')
    expect(tutorialLink?.getAttribute('href')).toBe(
      '/video/panel-customer-02.mp4'
    )
  })
})
