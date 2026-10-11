import type { ReactNode } from 'react'

import { MyClaimRequestDetailDeleteAction } from '@features/my-claims/pages/detail/components/my-claim-request-detail-delete-action'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  remove: vi.fn(),
  navigate: vi.fn(),
  success: vi.fn(),
}))
vi.mock('@features/my-claims/services/my-claim-request-service', () => ({
  default: { delete: mocks.remove },
}))
vi.mock('@tanstack/react-router', () => ({ useNavigate: () => mocks.navigate }))
vi.mock('sonner', () => ({ toast: { success: mocks.success } }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('@iap/dialogs', () => ({
  ConfirmDialog: (props: {
    open: boolean
    onConfirm: () => void
    isLoading: boolean
    title: ReactNode
  }) =>
    props.open ? (
      <div role='dialog'>
        {props.title}
        <button disabled={props.isLoading} onClick={props.onConfirm}>
          confirm delete
        </button>
      </div>
    ) : null,
}))
afterEach(() => {
  cleanup()
  vi.resetAllMocks()
})

function setup() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  const invalidation = vi.spyOn(client, 'invalidateQueries').mockResolvedValue()
  render(
    <QueryClientProvider client={client}>
      <MyClaimRequestDetailDeleteAction claimData={{ id: 'claim-1' }} />
    </QueryClientProvider>
  )
  fireEvent.click(
    screen.getByRole('button', { name: 'myiap.claimRequest.actions.delete' })
  )
  fireEvent.click(screen.getByRole('button', { name: 'confirm delete' }))
  return invalidation
}

it('awaits cache invalidation before success feedback, close, and navigation', async () => {
  mocks.remove.mockResolvedValue(undefined)
  const invalidation = setup()
  await waitFor(() =>
    expect(mocks.navigate).toHaveBeenCalledWith({ to: '/myclaims/' })
  )
  expect(mocks.remove).toHaveBeenCalledWith('claim-1', expect.anything())
  expect(invalidation.mock.calls.map(([value]) => value?.queryKey)).toEqual([
    ['my-claim-request-list'],
    ['my-claim-request-detail', 'claim-1'],
    ['myClaimRequests'],
    ['myClaimRequest', 'claim-1'],
  ])
  expect(mocks.success).toHaveBeenCalledWith('common.deleteSuccess')
  expect(screen.queryByRole('dialog')).toBeNull()
})

it('retains the confirmation after request failure', async () => {
  mocks.remove.mockRejectedValue(new Error('failed'))
  const invalidation = setup()
  await waitFor(() =>
    expect(
      screen
        .getByRole('button', { name: 'confirm delete' })
        .hasAttribute('disabled')
    ).toBe(false)
  )
  expect(screen.getByRole('dialog')).toBeTruthy()
  expect(mocks.navigate).not.toHaveBeenCalled()
  expect(mocks.success).not.toHaveBeenCalled()
  expect(invalidation).not.toHaveBeenCalled()
})
