import { medicalCenterInvoiceSchema } from '@iap/api-types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { medicalCenterInvoiceService } from './medical-center-invoice-service'

const apiClient = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('@iap/api-client', () => ({
  getApiClient: () => apiClient,
}))

const invoice = {
  id: 'invoice/id',
  documentNumber: 'INV-1',
  totalAmount: 1250,
  records: [],
}

describe('medicalCenterInvoiceService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('lists full invoices with complete pagination, sorting, and filters', async () => {
    apiClient.get.mockResolvedValue({
      data: { content: [invoice], totalElements: 1, totalPages: 1 },
    })
    const signal = new AbortController().signal

    const result = await medicalCenterInvoiceService.getPageFull(
      {
        page: 2,
        size: 20,
        sort: 'createdAt',
        direction: 'DESC',
        filters: { documentNumber: 'INV-1' },
      },
      signal
    )

    expect(apiClient.get).toHaveBeenCalledWith(
      '/medical-center/invoices/page-full',
      {
        params: {
          page: 2,
          size: 20,
          sort: 'createdAt',
          direction: 'DESC',
          documentNumber: 'INV-1',
        },
        signal,
      }
    )
    expect(result.content).toEqual([invoice])
  })

  it('uploads the selected file as multipart form data', async () => {
    apiClient.post.mockResolvedValue({ data: invoice })
    const file = new File(['invoice'], 'invoice.pdf', {
      type: 'application/pdf',
    })

    await medicalCenterInvoiceService.create({ file })

    const body = apiClient.post.mock.calls[0]?.[1]
    expect(apiClient.post).toHaveBeenCalledWith(
      '/medical-center/invoices',
      expect.any(FormData),
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: undefined,
      }
    )
    expect(body?.get('file')).toBe(file)
  })

  it('uses the DTO string id and preserves required records on update', async () => {
    const record = {
      name: 'Patient',
      nationalCode: '001',
      amount: 100,
      ratio: 10,
      insuranceAmount: 90,
      serviceTitle: 'Visit',
      title: 'Line',
      serviceDate: '2026-08-17',
      doctor: 'Doctor',
      attachments: [],
    }
    const updated = { ...invoice, records: [record] }
    apiClient.put.mockResolvedValue({ data: updated })

    await medicalCenterInvoiceService.update(invoice.id, updated)

    expect(apiClient.put).toHaveBeenCalledWith(
      '/medical-center/invoices/invoice%2Fid',
      expect.objectContaining({ records: [record] })
    )
  })

  it('loads details and deletes with the encoded DTO string id', async () => {
    apiClient.get.mockResolvedValue({ data: invoice })
    apiClient.delete.mockResolvedValue({})

    await medicalCenterInvoiceService.getById(invoice.id)
    await medicalCenterInvoiceService.delete(invoice.id)

    expect(apiClient.get).toHaveBeenCalledWith(
      '/medical-center/invoices/invoice%2Fid',
      { signal: undefined }
    )
    expect(apiClient.delete).toHaveBeenCalledWith(
      '/medical-center/invoices/invoice%2Fid'
    )
  })

  it('accepts absent optional fields and rejects malformed wire data', () => {
    expect(medicalCenterInvoiceSchema.parse({ records: [] })).toEqual({
      records: [],
    })
    expect(() =>
      medicalCenterInvoiceSchema.parse({ records: [], totalAmount: '1250' })
    ).toThrow()
  })
})
