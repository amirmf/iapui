import { getApiClient } from '@iap/api-client'
import {
  type ExportClaimRequestDocumentReceiptRequest,
  exportClaimRequestDocumentReceiptRequestSchema,
  exportClaimRequestDocumentReceiptResponseSchema,
} from '@iap/api-types'

export const exportDocumentReceipt = async (
  request: ExportClaimRequestDocumentReceiptRequest,
  options?: { signal?: AbortSignal }
) => {
  const params = exportClaimRequestDocumentReceiptRequestSchema.parse(request)
  const response = await getApiClient().get(
    '/claim-requests/export-report/pdf',
    {
      params,
      responseType: 'blob',
      signal: options?.signal,
    }
  )
  return exportClaimRequestDocumentReceiptResponseSchema.parse(response.data)
}
