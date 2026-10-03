import { getApiClient } from '@iap/api-client'
import {
  type OutpatientDocAcceptancePageRequest,
  type PageOutpatientDocAcceptance,
  outpatientDocAcceptanceExportRequestSchema,
  outpatientDocAcceptancePageRequestSchema,
  pageOutpatientDocAcceptanceSchema,
} from '@iap/api-types'
import { transformApiFilterParams } from '@iap/shared-lib'

export const outpatientDocAcceptanceService = {
  exportPdfReport: async (params: {
    outpatientDocAcceptanceId: string
    signal?: AbortSignal
  }) => {
    const { signal, ...input } = params
    const request = outpatientDocAcceptanceExportRequestSchema.parse(input)
    const response = await getApiClient().get(
      '/outpatient-doc-acceptances/export-report/pdf',
      {
        params: request,
        responseType: 'blob',
        signal,
      }
    )

    return response.data as Blob
  },
  exportReport: async (params: {
    outpatientDocAcceptanceId: string
    signal?: AbortSignal
  }) => {
    const { signal, ...input } = params
    const request = outpatientDocAcceptanceExportRequestSchema.parse(input)
    const response = await getApiClient().get(
      '/outpatient-doc-acceptances/export-report',
      {
        params: request,
        responseType: 'blob',
        signal,
      }
    )

    return response.data as Blob
  },
  getPage: async (
    options: OutpatientDocAcceptancePageRequest & { signal?: AbortSignal }
  ): Promise<PageOutpatientDocAcceptance> => {
    const { signal, ...input } = options
    const request = outpatientDocAcceptancePageRequestSchema.parse(input)
    const response = await getApiClient().get(
      '/outpatient-doc-acceptances/page',
      {
        params: {
          page: request.page,
          size: request.size,
          ...transformApiFilterParams(request.filters),
        },
        signal,
      }
    )

    return pageOutpatientDocAcceptanceSchema.parse(response.data)
  },
}
