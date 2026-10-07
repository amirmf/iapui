import { exportDocumentReceipt } from '@features/claim-requests/services/claim-request-document-receipt-service'
import { coreAiService } from '@features/claim-requests/services/core-ai-service'
import { getApiClient } from '@iap/api-client'
import {
  type AssignClaimRequestToMeStatusRequest,
  type ClaimRequestBulkStatusChangeRequest,
  type CoreAiDataExtractionRequest,
  type PageClaimRequestRequest,
  type UpdateClaimRequestDocTypeRequest,
  type UpdateClaimRequestDocumentsRequest,
  assignClaimRequestToMeStatusRequestSchema,
  assignNewClaimRequestsRequestSchema,
  claimRequestBulkStatusChangeRequestSchema,
  claimRequestExportExcelRequestSchema,
  claimRequestExportExcelResponseSchema,
  claimRequestIdSchema,
  claimRequestIdsSchema,
  claimRequestListSchema,
  claimRequestSchema,
  claimRequestVoidResponseSchema,
  pageClaimRequestRequestSchema,
  pageClaimRequestSchema,
  subInsuredPersonResponseListSchema,
  updateClaimRequestDocTypeRequestSchema,
  updateClaimRequestDocumentsRequestSchema,
} from '@iap/api-types'
import { type ApiFilterParams, transformApiFilterParams } from '@iap/shared-lib'

const service = {
  getSubInsuredPeople: async (
    claimRequestId: string,
    options?: { signal?: AbortSignal }
  ) => {
    const id = claimRequestIdSchema.parse(claimRequestId)
    const response = await getApiClient().get(
      `/claim-requests/${id}/sub-insured-people`,
      { signal: options?.signal }
    )
    return subInsuredPersonResponseListSchema.parse(response.data)
  },
  findById: async (id: string, signal?: AbortSignal) => {
    const claimRequestId = claimRequestIdSchema.parse(id)
    const response = await getApiClient().get(
      `/claim-requests/${claimRequestId}`,
      {
        signal,
      }
    )

    return claimRequestSchema.parse(response.data)
  },
  assignToMe: async (id: string) => {
    const claimRequestId = claimRequestIdSchema.parse(id)
    const response = await getApiClient().post(
      `/claim-requests/${claimRequestId}/assignments/me`
    )
    return claimRequestSchema.parse(response.data)
  },
  assignToMeWithStatus: async (
    id: string,
    payload: AssignClaimRequestToMeStatusRequest
  ) => {
    const claimRequestId = claimRequestIdSchema.parse(id)
    const request = assignClaimRequestToMeStatusRequestSchema.parse(payload)
    const response = await getApiClient().post(
      `/claim-requests/${claimRequestId}/assignments/me/status`,
      request
    )
    return claimRequestSchema.parse(response.data)
  },
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
    const response = await getApiClient().post(
      '/claim-requests/assignments/me/new',
      undefined,
      {
        params: request,
      }
    )
    claimRequestVoidResponseSchema.parse(response.data)
  },
  bulkDelete: async (ids: string[]) => {
    const request = claimRequestIdsSchema.parse(ids)
    const response = await getApiClient().delete(
      '/claim-requests/bulk-delete',
      {
        data: request,
      }
    )
    claimRequestVoidResponseSchema.parse(response.data)
  },
  delete: async (id: string) => {
    const claimRequestId = claimRequestIdSchema.parse(id)
    const response = await getApiClient().delete(
      `/claim-requests/${claimRequestId}`
    )
    claimRequestVoidResponseSchema.parse(response.data)
  },
  exportPageLiteExcel: async (
    options: { filters?: ApiFilterParams; signal?: AbortSignal } = {}
  ) => {
    const { signal, ...input } = options
    const request = claimRequestExportExcelRequestSchema.parse(input)
    const response = await getApiClient().get(
      '/claim-requests/page-lite/excel',
      {
        params: transformApiFilterParams(request.filters),
        responseType: 'blob',
        signal,
      }
    )
    return claimRequestExportExcelResponseSchema.parse(response.data)
  },
  generateAndSendBulk: async (ids: string[]) => {
    const request = claimRequestIdsSchema.parse(ids)
    const response = await getApiClient().post(
      '/outpatient-doc-acceptances/generate-and-send-bulk',
      undefined,
      { params: { claimRequestIds: request } }
    )
    claimRequestVoidResponseSchema.parse(response.data)
  },
  inquiryFanavaranBulk: async (ids: string[]) => {
    const request = claimRequestIdsSchema.parse(ids)
    const response = await getApiClient().post(
      '/claim-requests/policy-details/bulk',
      {
        claimRequestIds: request,
      }
    )
    claimRequestVoidResponseSchema.parse(response.data)
  },
  submitBulkStatusChange: async (
    payload: ClaimRequestBulkStatusChangeRequest
  ) => {
    const request = claimRequestBulkStatusChangeRequestSchema.parse(payload)
    const response = await getApiClient().post(
      '/claim-requests/objections-bulk',
      request
    )
    return claimRequestListSchema.parse(response.data)
  },
  startBulkCoreAiDataExtraction: (payloads: CoreAiDataExtractionRequest[]) =>
    coreAiService.bulkStartDataExtractionWorkflow(payloads),
  sendStatusChangeNotification: async (id: string) => {
    const claimRequestId = claimRequestIdSchema.parse(id)
    const response = await getApiClient().post(
      `/claim-requests/${claimRequestId}/status-change-notifications`
    )
    claimRequestVoidResponseSchema.parse(response.data)
  },
  updateDocType: async (payload: UpdateClaimRequestDocTypeRequest) => {
    const request = updateClaimRequestDocTypeRequestSchema.parse(payload)
    const response = await getApiClient().post(
      '/claim-requests/doc-type',
      request
    )
    return claimRequestSchema.parse(response.data)
  },
  updateDocuments: async (payload: UpdateClaimRequestDocumentsRequest) => {
    const request = updateClaimRequestDocumentsRequestSchema.parse(payload)
    const response = await getApiClient().patch(
      `/claim-requests/${request.path.id}`,
      request.body
    )
    return claimRequestSchema.parse(response.data)
  },
}

export const claimRequestService = {
  ...service,
  getPageLite: service.findPage,
  getById: (id: string, options?: { signal?: AbortSignal }) =>
    service.findById(id, options?.signal),
  submitObjectionsBulk: service.submitBulkStatusChange,
  exportDocumentReceipt,
}
