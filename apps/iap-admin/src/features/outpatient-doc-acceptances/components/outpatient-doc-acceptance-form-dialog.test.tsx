// @vitest-environment jsdom
import { OutpatientDocAcceptanceFormDialog } from '@features/outpatient-doc-acceptances/components/outpatient-doc-acceptance-form-dialog'
import { useOutpatientDocAcceptanceStore } from '@features/outpatient-doc-acceptances/context/store/outpatient-doc-acceptance-store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'fa' } }),
}))
afterEach(() => {
  cleanup()
  useOutpatientDocAcceptanceStore.getState().reset()
})

const fieldOrder = [
  'exId',
  'docDeliveryKindId',
  'deliveryDate',
  'acceptanceKindId',
  'claimCount',
  'dichargeMonth',
  'totalAmount',
  'policyId',
  'insuredPersonId',
  'medicalCenterId',
  'letterDate',
  'letterNo',
  'secretariatNo',
  'secretariatDate',
  'paymentDate',
  'docDelivererAgentId',
  'dataSenderId',
  'claimExpertId',
  'opUnitId',
  'exStatus',
  'status',
  'wsStatus',
  'claimRequestId',
  'wsResult',
]

describe('acceptance reference form field closure', () => {
  it('renders every source field in source order, including default statuses', () => {
    useOutpatientDocAcceptanceStore.getState().openDialog('create')
    render(
      <QueryClientProvider client={new QueryClient()}>
        <OutpatientDocAcceptanceFormDialog />
      </QueryClientProvider>
    )
    const labels = Array.from(document.querySelectorAll('label')).map(
      (label) => label.textContent
    )
    expect(labels).toEqual(
      fieldOrder.map((field) => `outpatientDocAcceptances.form.${field}`)
    )
    expect(
      screen.getByText('outpatientDocAcceptances.status.SUBMIT')
    ).toBeDefined()
    expect(
      screen.getByText('outpatientDocAcceptances.wsStatus.PROGRESS')
    ).toBeDefined()
    expect(
      (document.querySelector('input[name="exId"]') as HTMLInputElement).value
    ).toBe('')
  })

  it('prefills numeric identifiers, dates and free text from the edited row', () => {
    useOutpatientDocAcceptanceStore.getState().openDialog('edit', {
      id: 'row-1',
      exId: 81,
      docDeliveryKindId: 4,
      deliveryDate: '2026-10-06',
      letterNo: 'L-9',
      wsResult: 'result text',
    })
    render(
      <QueryClientProvider client={new QueryClient()}>
        <OutpatientDocAcceptanceFormDialog />
      </QueryClientProvider>
    )
    expect(
      (document.querySelector('input[name="exId"]') as HTMLInputElement).value
    ).toBe('81')
    expect(
      (
        document.querySelector(
          'input[name="docDeliveryKindId"]'
        ) as HTMLInputElement
      ).value
    ).toBe('4')
    expect(
      (document.querySelector('input[name="deliveryDate"]') as HTMLInputElement)
        .value
    ).toBe('2026-10-06')
    expect(
      (document.querySelector('input[name="letterNo"]') as HTMLInputElement)
        .value
    ).toBe('L-9')
    expect(
      (
        document.querySelector(
          'textarea[name="wsResult"]'
        ) as HTMLTextAreaElement
      ).value
    ).toBe('result text')
  })
})
