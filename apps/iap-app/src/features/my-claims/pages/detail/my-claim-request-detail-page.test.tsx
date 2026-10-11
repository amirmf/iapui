import MyClaimRequestDetailPage from '@features/my-claims/pages/detail/my-claim-request-detail-page'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  data: undefined as unknown,
  error: undefined as unknown,
  isError: false,
  isLoading: false,
}))
vi.mock(
  '@features/my-claims/pages/detail/queries/use-get-my-claim-request-by-id',
  () => ({ default: () => state })
)
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))
vi.mock(
  '@features/my-claims/pages/detail/components/my-claim-request-detail-info-list.tsx',
  () => ({ default: () => <div>info</div> })
)
vi.mock(
  '@features/my-claims/pages/detail/components/my-claim-request-detail-actions.tsx',
  () => ({ default: () => <div>actions</div> })
)
vi.mock(
  '@features/my-claims/pages/detail/components/my-claim-request-detailI-result.tsx',
  () => ({ default: () => <div>results</div> })
)
vi.mock('@iap/files', () => ({ FileViewer: () => <div>attachments</div> }))
afterEach(() => {
  cleanup()
  Object.assign(state, {
    data: undefined,
    error: undefined,
    isError: false,
    isLoading: false,
  })
})
it('shows source loading and server errors without inventing empty content', () => {
  state.isLoading = true
  state.isError = true
  state.error = new Error('backend message')
  render(<MyClaimRequestDetailPage />)
  expect(screen.getByText('common.loading')).toBeTruthy()
  expect(screen.getByText('backend message')).toBeTruthy()
  expect(screen.queryByText('info')).toBeNull()
  expect(screen.getByRole('heading').textContent).toBe(
    'claimRequests.actions.viewDetails'
  )
  expect(
    screen.getByRole('link', { name: 'common.back' }).getAttribute('href')
  ).toBe('/myclaims/')
})
it('mounts reference components in order and only shows nonempty attachments', () => {
  state.data = { attachments: [{}] }
  render(<MyClaimRequestDetailPage />)
  const names = ['info', 'actions', 'results', 'attachments']
  for (let index = 0; index < names.length - 1; index++) {
    expect(
      screen
        .getByText(names[index]!)
        .compareDocumentPosition(screen.getByText(names[index + 1]!)) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  }
  cleanup()
  state.data = { attachments: null }
  render(<MyClaimRequestDetailPage />)
  expect(screen.queryByText('attachments')).toBeNull()
})
