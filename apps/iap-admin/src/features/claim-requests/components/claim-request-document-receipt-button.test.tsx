import { ClaimRequestDocumentReceiptButton } from '@features/claim-requests/components/claim-request-document-receipt-button'
import { claimRequestService } from '@features/claim-requests/services/claim-request-service'
import { i18nReady } from '@shared/i18n/i18n'
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { saveAs } from 'file-saver'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

vi.mock('file-saver', () => ({ saveAs: vi.fn() }))
vi.mock('sonner', () => ({ toast: { success: vi.fn() } }))

function mount(onError = vi.fn()) {
  const client = new QueryClient({
    mutationCache: new MutationCache({ onError }),
    defaultOptions: { mutations: { retry: false } },
  })
  render(
    <QueryClientProvider client={client}>
      <ClaimRequestDocumentReceiptButton />
    </QueryClientProvider>
  )
  fireEvent.click(screen.getByRole('button'))
  return screen.getByRole('textbox') as HTMLInputElement
}

function submit() {
  fireEvent.submit(screen.getByRole('textbox').closest('form')!)
}

describe('ClaimRequestDocumentReceiptButton', () => {
  beforeAll(async () => {
    await i18nReady
  })
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('renders translated required errors through the real form adapter and blocks blank input', async () => {
    const exportReceipt = vi.spyOn(claimRequestService, 'exportDocumentReceipt')
    const input = mount()
    submit()
    await waitFor(() => expect(input.getAttribute('aria-invalid')).toBe('true'))
    expect(exportReceipt).not.toHaveBeenCalled()
    expect(input.getAttribute('maxlength')).toBe('10')
    expect(input.getAttribute('inputmode')).toBe('numeric')
  })

  it('keeps the dialog open and controls disabled while pending, then saves and resets after success', async () => {
    let resolve!: (value: Blob) => void
    vi.spyOn(claimRequestService, 'exportDocumentReceipt').mockImplementation(
      () =>
        new Promise((done) => {
          resolve = done
        })
    )
    const input = mount()
    fireEvent.change(input, { target: { value: '1234567890' } })
    submit()
    await waitFor(() => expect(input.disabled).toBe(true))
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(screen.getByRole('dialog')).toBeTruthy()
    const blob = new Blob(['pdf'])
    resolve(blob)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(saveAs).toHaveBeenCalledWith(blob, 'document-receipt-1234567890.pdf')
    fireEvent.click(screen.getByRole('button'))
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('')
  })

  it('keeps entered values and dialog open after an export failure', async () => {
    vi.spyOn(claimRequestService, 'exportDocumentReceipt').mockRejectedValue(
      new Error('Export failed')
    )
    const onError = vi.fn()
    const input = mount(onError)
    fireEvent.change(input, { target: { value: '123' } })
    submit()
    await waitFor(() => expect(onError).toHaveBeenCalled())
    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(input.value).toBe('123')
    expect(input.disabled).toBe(false)
  })
})
