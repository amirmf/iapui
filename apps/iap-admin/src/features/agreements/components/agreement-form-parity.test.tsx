import { useAgreementStore } from '@features/agreements/context/store/agreement-store'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { AgreementFormDialog } from './agreement-form-dialog'

const service = vi.hoisted(() => ({ create: vi.fn(), update: vi.fn() }))
vi.mock('@features/agreements/services/agreement-service', () => ({
  agreementService: service,
}))

function renderForm() {
  return render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { mutations: { retry: false } } })
      }
    >
      <AgreementFormDialog />
    </QueryClientProvider>
  )
}

describe('Agreement form reference behavior', () => {
  beforeAll(async () => {
    await i18nReady
  })
  beforeEach(() => {
    vi.clearAllMocks()
    useAgreementStore.getState().reset()
    useAgreementStore.getState().setOpenDialog('create')
  })
  afterEach(() => {
    cleanup()
    useAgreementStore.getState().reset()
  })

  it('renders source validation errors and prevents an empty request', async () => {
    renderForm()
    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('common.create') })
    )
    await screen.findByText(
      i18n.t('agreements.validation.titleRequired' as never)
    )
    expect(
      screen.getByText(i18n.t('agreements.validation.codeRequired' as never))
    ).toBeTruthy()
    expect(service.create).not.toHaveBeenCalled()
  })

  it('resets stale edit values when opening create and submits preprocessed optional values', async () => {
    useAgreementStore.getState().setCurrentRow({ title: 'stale', code: 'OLD' })
    service.create.mockResolvedValue({})
    renderForm()
    const title = screen.getByLabelText(
      i18n.t('agreements.dialog.fields.title')
    )
    expect((title as HTMLInputElement).value).toBe('')
    fireEvent.change(title, { target: { value: 'New agreement' } })
    fireEvent.change(
      screen.getByLabelText(i18n.t('agreements.dialog.fields.code')),
      { target: { value: 'NEW' } }
    )
    fireEvent.change(
      screen.getByLabelText(i18n.t('agreements.dialog.fields.templateCode')),
      { target: { value: '   ' } }
    )
    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('common.create') })
    )
    await waitFor(() => expect(service.create).toHaveBeenCalled())
    expect(service.create.mock.calls[0]?.[0]).toMatchObject({
      code: 'NEW',
      templateCode: undefined,
      title: 'New agreement',
    })
    await waitFor(() =>
      expect(useAgreementStore.getState().openDialog).toBeNull()
    )
  })
})
