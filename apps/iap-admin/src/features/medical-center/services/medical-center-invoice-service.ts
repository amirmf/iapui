import { getApiClient } from '@iap/api-client'
import {
  type MedicalCenterInvoice,
  type MedicalCenterInvoiceListRequest,
  type MedicalCenterInvoiceUpload,
  medicalCenterInvoiceListRequestSchema,
  medicalCenterInvoicePageSchema,
  medicalCenterInvoiceSchema,
  medicalCenterInvoiceUploadSchema,
} from '@iap/api-types'

const basePath = '/medical-center/invoices'
export type MedicalCenterInvoiceUploadOptions = {
  onProgress?: (progress: number) => void
}

export const medicalCenterInvoiceService = {
  async getPageFull(
    request: MedicalCenterInvoiceListRequest,
    signal?: AbortSignal
  ) {
    const { filters, ...pagination } =
      medicalCenterInvoiceListRequestSchema.parse(request)
    const response = await getApiClient().get<unknown>(
      `${basePath}/page-full`,
      { params: { ...pagination, ...filters }, signal }
    )
    return medicalCenterInvoicePageSchema.parse(response.data)
  },
  async getById(id: string, signal?: AbortSignal) {
    const response = await getApiClient().get<unknown>(
      `${basePath}/${encodeURIComponent(id)}`,
      { signal }
    )
    return medicalCenterInvoiceSchema.parse(response.data)
  },
  async create(
    input: MedicalCenterInvoiceUpload,
    options: MedicalCenterInvoiceUploadOptions = {}
  ) {
    const payload = medicalCenterInvoiceUploadSchema.parse(input)
    const formData = new FormData()
    formData.append('file', payload.file)
    const response = await getApiClient().post<unknown>(basePath, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: options.onProgress
        ? (event) => {
            if (!event.total) return options.onProgress?.(0)
            options.onProgress?.(
              Math.min(100, Math.round((event.loaded / event.total) * 100))
            )
          }
        : undefined,
    })
    return medicalCenterInvoiceSchema.parse(response.data)
  },
  async update(id: string, invoice: MedicalCenterInvoice) {
    const payload = medicalCenterInvoiceSchema.parse(invoice)
    const response = await getApiClient().put<unknown>(
      `${basePath}/${encodeURIComponent(id)}`,
      payload
    )
    return medicalCenterInvoiceSchema.parse(response.data)
  },
  async delete(id: string): Promise<void> {
    await getApiClient().delete(`${basePath}/${encodeURIComponent(id)}`)
  },
}
