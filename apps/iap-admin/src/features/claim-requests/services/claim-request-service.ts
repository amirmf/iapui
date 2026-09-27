import { getApiClient } from '@iap/api-client'
import {
  type ClaimRequestBulkStatusChangeRequest,
  type CoreAiDataExtractionRequest,
  type PageClaimRequestRequest,
  assignNewClaimRequestsRequestSchema,
  claimRequestBulkStatusChangeRequestSchema,
  claimRequestIdsSchema,
  claimRequestSchema,
  coreAiDataExtractionRequestSchema,
  coreAiDataExtractionResponseSchema,
  pageClaimRequestRequestSchema,
  pageClaimRequestSchema,
} from '@iap/api-types'
import { type ApiFilterParams, transformApiFilterParams } from '@iap/shared-lib'
import { z } from 'zod'

export const claimRequestService = {
  findPage: async (
    options: PageClaimRequestRequest & { signal?: AbortSignal }
  ) => {
    const { signal, ...input } = options
    const request = pageClaimRequestRequestSchema.parse(input)
    const response = await getApiClient().get('/claim-requests/page-lite', {
      params: {
        page: request.page,
        size: request.size,
        ...transformApiFilterParams(request.filters),
      },
      signal,
    })

    return pageClaimRequestSchema.parse(response.data)
  },
  assignNewToMe: async (params?: {
    extContractId?: string
    extPolicyId?: string
  }) => {
    const request = assignNewClaimRequestsRequestSchema.parse(params ?? {})
    await getApiClient().post('/claim-requests/assignments/me/new', undefined, {
      params: request,
    })
  },
  bulkDelete: async (ids: string[]) => {
    const request = claimRequestIdsSchema.parse(ids)
    await getApiClient().delete('/claim-requests/bulk-delete', {
      data: request,
    })
  },
  exportPageLiteExcel: async (filters: ApiFilterParams) => {
    const response = await getApiClient().get(
      '/claim-requests/page-lite/excel',
      {
        params: transformApiFilterParams(filters),
        responseType: 'blob',
      }
    )
    return response.data as Blob
  },
  generateAndSendBulk: async (ids: string[]) => {
    const request = claimRequestIdsSchema.parse(ids)
    await getApiClient().post(
      '/outpatient-doc-acceptances/generate-and-send-bulk',
      undefined,
      { params: { claimRequestIds: request } }
    )
  },
  inquiryFanavaranBulk: async (ids: string[]) => {
    const request = claimRequestIdsSchema.parse(ids)
    await getApiClient().post('/claim-requests/policy-details/bulk', {
      claimRequestIds: request,
    })
  },
  submitBulkStatusChange: async (
    payload: ClaimRequestBulkStatusChangeRequest
  ) => {
    const request = claimRequestBulkStatusChangeRequestSchema.parse(payload)
    const response = await getApiClient().post(
      '/claim-requests/objections-bulk',
      request
    )
    return z.array(claimRequestSchema).parse(response.data)
  },
  startBulkCoreAiDataExtraction: async (
    payloads: CoreAiDataExtractionRequest[]
  ) => {
    const request = z
      .array(coreAiDataExtractionRequestSchema)
      .min(1)
      .parse(payloads)
    const response = await getApiClient().post(
      '/core-ai/workflows/data-extraction/start/bulk',
      request
    )

    return z.array(coreAiDataExtractionResponseSchema).parse(response.data)
  },
}
