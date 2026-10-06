import type { ReactNode } from 'react'

import {
  medicalCenterInvoiceKeys,
  useCreateMedicalCenterInvoice,
  useDeleteMedicalCenterInvoice,
  useMedicalCenterInvoice,
  useUpdateMedicalCenterInvoice,
} from '@features/medical-center/queries/medical-center-invoice-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const service = vi.hoisted(() => ({
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  getById: vi.fn(),
}))
vi.mock(
  '@features/medical-center/services/medical-center-invoice-service',
  () => ({ medicalCenterInvoiceService: service })
)
let client: QueryClient
beforeEach(() => {
  vi.clearAllMocks()
  client = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  })
})
afterEach(() => {
  cleanup()
  client.clear()
})
function wrapper(props: { children: ReactNode }) {
  return (
    <QueryClientProvider client={client}>{props.children}</QueryClientProvider>
  )
}
describe('reference invoice mutation cache sequencing', () => {
  it('caches created detail before awaiting list invalidation', async () => {
    const invoice = { id: 'new/id', records: [] }
    service.create.mockResolvedValue(invoice)
    let resolveInvalidation!: () => void
    const pending = new Promise<void>((resolve) => {
      resolveInvalidation = resolve
    })
    const invalidate = vi
      .spyOn(client, 'invalidateQueries')
      .mockImplementation(() => {
        expect(
          client.getQueryData(medicalCenterInvoiceKeys.detail('new/id'))
        ).toEqual(invoice)
        return pending
      })
    const { result } = renderHook(() => useCreateMedicalCenterInvoice(), {
      wrapper,
    })
    let completed = false
    let operation!: Promise<unknown>
    await act(async () => {
      operation = result.current
        .mutateAsync({ input: { file: new File(['pdf'], 'invoice.pdf') } })
        .then(() => {
          completed = true
        })
    })
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: medicalCenterInvoiceKeys.lists(),
    })
    expect(completed).toBe(false)
    await act(async () => {
      resolveInvalidation()
      await operation
    })
    expect(completed).toBe(true)
  })
  it('updates the requested detail key and removes deleted detail before invalidation', async () => {
    const invoice = { id: 'response-id', records: [] }
    service.update.mockResolvedValue(invoice)
    const invalidate = vi.spyOn(client, 'invalidateQueries').mockResolvedValue()
    const update = renderHook(() => useUpdateMedicalCenterInvoice(), {
      wrapper,
    })
    await act(async () => {
      await update.result.current.mutateAsync({ id: 'requested-id', invoice })
    })
    expect(
      client.getQueryData(medicalCenterInvoiceKeys.detail('requested-id'))
    ).toEqual(invoice)
    service.delete.mockResolvedValue(undefined)
    invalidate.mockImplementation(() => {
      expect(
        client.getQueryData(medicalCenterInvoiceKeys.detail('requested-id'))
      ).toBeUndefined()
      return Promise.resolve()
    })
    const remove = renderHook(() => useDeleteMedicalCenterInvoice(), {
      wrapper,
    })
    await act(async () => {
      await remove.result.current.mutateAsync('requested-id')
    })
    expect(invalidate).toHaveBeenLastCalledWith({
      queryKey: medicalCenterInvoiceKeys.lists(),
    })
  })
  it('does not invalidate or remove existing detail after deletion failure', async () => {
    const invoice = { records: [] }
    client.setQueryData(medicalCenterInvoiceKeys.detail('id'), invoice)
    service.delete.mockRejectedValue(new Error('rejected'))
    const invalidate = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(() => useDeleteMedicalCenterInvoice(), {
      wrapper,
    })
    await act(async () => {
      await expect(result.current.mutateAsync('id')).rejects.toThrow('rejected')
    })
    expect(client.getQueryData(medicalCenterInvoiceKeys.detail('id'))).toEqual(
      invoice
    )
    expect(invalidate).not.toHaveBeenCalled()
  })
  it('does not fetch detail without an id or with a closed dialog', () => {
    renderHook(() => useMedicalCenterInvoice(null, true), { wrapper })
    renderHook(() => useMedicalCenterInvoice('id', false), { wrapper })
    expect(service.getById).not.toHaveBeenCalled()
  })
})
