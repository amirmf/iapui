// @vitest-environment jsdom
import { i18nReady } from '@shared/i18n/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SubUsersPage } from './sub-users-page'

vi.mock('./components/sub-user-section', () => ({
  SubUserSection: () => (
    <div data-testid='sub-user-section'>Sub Users Section</div>
  ),
}))

vi.mock('./components/sub-users-agreements-section', () => ({
  SubUsersAgreementsSection: () => (
    <div data-testid='sub-users-agreements-section'>Agreements Section</div>
  ),
}))

vi.mock('./components/sub-users-agreement-party-section', () => ({
  SubUsersAgreementPartySection: () => (
    <div data-testid='sub-users-agreement-party-section'>
      Agreement Party Section
    </div>
  ),
}))

vi.mock('./components/sub-user-details-dialog', () => ({
  SubUserDetailsDialog: () => null,
}))

vi.mock('./components/sub-user-form-dialog', () => ({
  SubUserFormDialog: () => null,
}))

vi.mock('./components/sub-user-release-assignments-dialog', () => ({
  SubUserReleaseAssignmentsDialog: () => null,
}))

describe('SubUsersPage', () => {
  beforeEach(async () => {
    await i18nReady
  })

  it('renders sub-user section, agreements section, and agreement party section', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <SubUsersPage />
      </QueryClientProvider>
    )

    expect(screen.getByTestId('sub-user-section')).toBeDefined()
    expect(screen.getByTestId('sub-users-agreements-section')).toBeDefined()
    expect(
      screen.getByTestId('sub-users-agreement-party-section')
    ).toBeDefined()
  })
})
