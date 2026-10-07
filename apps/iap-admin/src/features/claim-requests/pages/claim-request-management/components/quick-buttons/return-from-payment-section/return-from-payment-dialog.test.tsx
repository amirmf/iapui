import { ReturnFromPaymentDialog } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/return-from-payment-section/return-from-payment-dialog'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

const state = vi.hoisted(() => ({ submit: vi.fn(), toast: vi.fn() }))
vi.mock(
  '@features/claim-requests/services/claim-request-management-service',
  () => ({ default: { submitObjection: state.submit } })
)
vi.mock('@shared/i18n/i18n', () => ({
  useTranslate: () => ({ t: (key: string) => key }),
}))
vi.mock('sonner', () => ({ toast: { success: state.toast } }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
beforeAll(() =>
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
)
afterAll(() => vi.unstubAllGlobals())
afterEach(cleanup)
beforeEach(() => vi.clearAllMocks())
function show() {
  const onOpenChange = vi.fn()
  const onSuccess = vi.fn()
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { mutations: { retry: false } } })
      }
    >
      <ReturnFromPaymentDialog
        open
        onOpenChange={onOpenChange}
        claimRequestId='claim-1'
        onSuccess={onSuccess}
      />
    </QueryClientProvider>
  )
  return { onOpenChange, onSuccess }
}
describe('payment return source dialog flow', () => {
  it('renders translated accessible field errors before opening confirmation', async () => {
    show()
    fireEvent.click(
      screen.getByText('claimRequests.returnFromPayment.actions.submit')
    )
    await screen.findByText(
      'claimRequests.returnFromPayment.validation.understood'
    )
    expect(
      screen.getByText('claimRequests.returnFromPayment.validation.description')
    ).toBeTruthy()
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe(
      'true'
    )
    expect(
      screen.queryByText('claimRequests.returnFromPayment.confirm.title')
    ).toBeNull()
    expect(state.submit).not.toHaveBeenCalled()
  })
  it('retains both dialogs on failure and closes/refetches only after success', async () => {
    const props = show()
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: ' reason ' },
    })
    fireEvent.click(
      screen.getByText('claimRequests.returnFromPayment.actions.submit')
    )
    await screen.findByText('claimRequests.returnFromPayment.confirm.title')
    state.submit.mockRejectedValueOnce(new Error('server rejected'))
    fireEvent.click(
      screen.getByText('claimRequests.returnFromPayment.confirm.confirm')
    )
    await waitFor(() => expect(state.submit).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(
        screen
          .getByText('claimRequests.returnFromPayment.confirm.confirm')
          .hasAttribute('disabled')
      ).toBe(false)
    )
    expect(props.onOpenChange).not.toHaveBeenCalled()
    expect(props.onSuccess).not.toHaveBeenCalled()
    state.submit.mockResolvedValueOnce({})
    fireEvent.click(
      screen.getByText('claimRequests.returnFromPayment.confirm.confirm')
    )
    await waitFor(() => expect(props.onOpenChange).toHaveBeenCalledWith(false))
    expect(state.submit).toHaveBeenLastCalledWith({
      claimRequestId: 'claim-1',
      description: 'reason',
      claimRequestStatus: 'PAYMENT_RETURN',
      isCheat: 'N',
    })
    expect(props.onSuccess).toHaveBeenCalledTimes(1)
  })
})
