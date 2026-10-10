import type { ComponentProps } from 'react'

import MyClaimRequestsPage from '@features/my-claims/my-claim-requests-page'
import { myClaimRequestsQueryOptions } from '@features/my-claims/queries/my-claim-requests-query'
import myClaimRequestService from '@features/my-claims/services/my-claim-request-service'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...rest }: ComponentProps<'a'> & { to: string }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}))
vi.mock('@features/my-claims/components/my-claim-requests-alert', () => ({
  default: () => null,
}))
vi.mock(
  '@features/my-claims/components/my-claim-request-delete-dialog',
  () => ({ MyClaimRequestDeleteDialog: () => null })
)
vi.mock('@features/my-claims/components/my-claim-request-card', () => ({
  MyClaimRequestCard: ({ claim }: { claim: { id: string } }) => (
    <div>{claim.id}</div>
  ),
}))
vi.mock('@features/my-claims/components/my-claim-requests-filter', () => ({
  MyClaimRequestsFilter: ({
    onFilterChange,
  }: {
    onFilterChange: (filters: object) => void
  }) => (
    <button onClick={() => onFilterChange({ extNationalCode: '0012345678' })}>
      apply-test-filter
    </button>
  ),
}))

function mount() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  render(
    <QueryClientProvider client={client}>
      <MyClaimRequestsPage />
    </QueryClientProvider>
  )
  return client
}
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})
describe('My Claims list orchestration', () => {
  it('retains source query settings and previous data', () => {
    const options = myClaimRequestsQueryOptions(2, { status: ['RETURN'] })
    expect(options.queryKey).toEqual([
      'myClaimRequests',
      2,
      9,
      { status: ['RETURN'] },
    ])
    expect(options).toMatchObject({
      refetchOnWindowFocus: false,
      staleTime: 10000,
      gcTime: 10000,
    })
    expect(typeof options.placeholderData).toBe('function')
  })
  it('uses size nine, keeps previous cards during pagination and resets page on filters', async () => {
    let resolveNext!: (value: {
      content: { id: string }[]
      totalPages: number
    }) => void
    const getPage = vi
      .spyOn(myClaimRequestService, 'getPage')
      .mockResolvedValueOnce({
        content: [{ id: 'first-card' }],
        totalPages: 3,
        totalElements: 20,
      })
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveNext = resolve
          })
      )
      .mockResolvedValueOnce({ content: [] })
    mount()
    await screen.findByText('first-card')
    fireEvent.click(
      screen.getAllByRole('button', { name: 'myClaimRequests.next' })[0]
    )
    await waitFor(() => expect(getPage).toHaveBeenCalledTimes(2))
    expect(screen.getByText('first-card')).toBeTruthy()
    expect(
      (
        screen.getAllByRole('button', {
          name: 'myClaimRequests.next',
        })[0] as HTMLButtonElement
      ).disabled
    ).toBe(true)
    resolveNext({ content: [{ id: 'second-card' }], totalPages: 3 })
    await screen.findByText('second-card')
    fireEvent.click(screen.getByRole('button', { name: 'apply-test-filter' }))
    await screen.findByText('myiap.claimRequests.noResults')
    expect(getPage.mock.calls[2][0]).toMatchObject({
      page: 0,
      size: 9,
      filters: { extNationalCode: '0012345678' },
    })
  })
  it('renders loading then source error plus unfiltered empty create action', async () => {
    let reject!: (reason: Error) => void
    vi.spyOn(myClaimRequestService, 'getPage').mockImplementation(
      () =>
        new Promise((_resolve, fail) => {
          reject = fail
        })
    )
    mount()
    expect(screen.getByText('common.loading')).toBeTruthy()
    reject(new Error('request failed'))
    await screen.findByText('request failed')
    expect(
      screen
        .getByRole('link', { name: 'myiap.claimRequests.emptyAction' })
        .getAttribute('href')
    ).toBe('/myclaims/create/')
    expect(screen.queryByText('myiap.claimRequests.noResults')).toBeNull()
  })
  it('hides both pagination controls for a single page', async () => {
    vi.spyOn(myClaimRequestService, 'getPage').mockResolvedValue({
      content: [{ id: 'single-card' }],
      totalPages: 1,
      totalElements: 1,
    })
    mount()
    await screen.findByText('single-card')
    expect(
      screen.queryByRole('button', { name: 'myClaimRequests.next' })
    ).toBeNull()
  })
})
