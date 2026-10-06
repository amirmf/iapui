import React from 'react'

import { DamageCasesTable } from '@features/outpatient-doc-acceptances/components/damage-cases-table'
import { IssuanceFormDialog } from '@features/outpatient-doc-acceptances/components/issuance-form-dialog'
import { OutpatientClaimFormDialog } from '@features/outpatient-doc-acceptances/components/outpatient-claim-form-dialog'
import { useDamageCasesDialog } from '@features/outpatient-doc-acceptances/context/store/damage-cases-dialog-store'
import { useOutpatientDocAcceptanceStore } from '@features/outpatient-doc-acceptances/context/store/outpatient-doc-acceptance-store'
import { outpatientDocAcceptanceSchema } from '@iap/api-types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  createClaim: vi.fn(),
  createIssuance: vi.fn(),
  success: vi.fn(),
}))
vi.mock(
  '@features/outpatient-doc-acceptances/services/outpatient-doc-acceptance-service',
  () => ({ outpatientDocAcceptanceService: mocks })
)
vi.mock('sonner', () => ({ toast: { success: mocks.success } }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'fa' } }),
}))

function mount(component: React.ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const invalidate = vi.spyOn(client, 'invalidateQueries')
  render(<QueryClientProvider client={client}>{component}</QueryClientProvider>)
  return invalidate
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    }
  )
  useOutpatientDocAcceptanceStore.getState().reset()
  const { result, unmount } = renderHook(() => useDamageCasesDialog())
  result.current.reset()
  unmount()
})
afterEach(cleanup)

describe('source-backed nested dialogs', () => {
  it('submits the full claim form using acceptance id and closes after success', async () => {
    mocks.createClaim.mockResolvedValue({ id: 'claim-id' })
    const row = outpatientDocAcceptanceSchema.parse({
      id: '123',
      exId: 987,
      status: 'SUBMIT',
      wsStatus: 'PROGRESS',
    })
    useOutpatientDocAcceptanceStore.getState().openDialog('manageClaim', row)
    const invalidate = mount(<OutpatientClaimFormDialog />)
    expect(
      screen.getByText('outpatientDocAcceptances.claimFields.docDeliveryKindId')
    ).toBeTruthy()
    expect(
      screen.getByText('outpatientDocAcceptances.claimFields.expertiseEndDate')
    ).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'form.submit' }))
    await waitFor(() => expect(mocks.createClaim).toHaveBeenCalled())
    expect(mocks.createClaim.mock.calls[0][0]).toBe('123')
    expect(mocks.createClaim.mock.calls[0][1]).toMatchObject({
      acceptanceId: '123',
      status: 'SUBMIT',
      wsStatus: 'PROGRESS',
      hasPreAuth: false,
      hasReturnDocs: false,
    })
    await waitFor(() =>
      expect(useOutpatientDocAcceptanceStore.getState().open).toBeNull()
    )
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['outpatient-doc-acceptances'],
    })
    expect(mocks.success).toHaveBeenCalledWith(
      'outpatientDocAcceptances.messages.claimCreated'
    )
  })

  it('keeps issuance open when its mutation rejects', async () => {
    mocks.createIssuance.mockRejectedValue(new Error('Rejected'))
    const row = outpatientDocAcceptanceSchema.parse({
      id: '123',
      exId: 987,
      status: 'SUBMIT',
      wsStatus: 'PROGRESS',
    })
    useOutpatientDocAcceptanceStore.getState().openDialog('manageIssuance', row)
    mount(<IssuanceFormDialog />)
    expect(
      screen.getByText(
        'outpatientDocAcceptances.issuanceFields.paymentPreparationTime'
      )
    ).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'form.submit' }))
    await waitFor(() => expect(mocks.createIssuance).toHaveBeenCalled())
    expect(mocks.createIssuance.mock.calls[0][0]).toBe('123')
    expect(useOutpatientDocAcceptanceStore.getState().open).toBe(
      'manageIssuance'
    )
    expect(mocks.success).not.toHaveBeenCalled()
  })

  it('damage table actions select the original case for each dialog mode', () => {
    const dmgCase = {
      id: 'case-id',
      serviceDate: '2026-10-06',
      requestedAmount: 300,
      approvedAmount: 200,
      status: 'SUBMIT' as const,
    }
    const { result } = renderHook(() => useDamageCasesDialog())
    render(<DamageCasesTable data={[dmgCase]} isLoading={false} />)
    expect(screen.getByText('2026-10-06')).toBeTruthy()
    for (const [title, mode] of [
      ['common.view', 'view'],
      ['common.edit', 'edit'],
      ['common.delete', 'delete'],
    ] as const) {
      fireEvent.click(screen.getByTitle(title))
      expect(result.current.mode).toBe(mode)
      expect(result.current.selectedCase).toEqual(dmgCase)
    }
  })
})
