import { getApiClient } from '@iap/api-client'
import {
  type AddObjectionRequest,
  type AssignClaimRequestRequest,
  type AssignClaimRequestToMeStatusRequest,
  type ClaimRequestHistoryRequest,
  type UpdateClaimManagementRequest,
  type UpdateClaimRequestDocTypeRequest,
  addObjectionRequestSchema,
  assignClaimRequestRequestSchema,
  assignClaimRequestToMeStatusRequestSchema,
  claimRequestHistoryRequestSchema,
  claimRequestIdSchema,
  claimRequestSchema,
  claimRequestVoidResponseSchema,
  inquiryFanavaranManagementRequestSchema,
  managementNoBodyRequestSchema,
  pageClaimRequestHistorySchema,
  updateClaimManagementRequestSchema,
  updateClaimRequestDocTypeRequestSchema,
} from '@iap/api-types'
import { transformApiFilterParams } from '@iap/shared-lib'

const idPath = (id: string) =>
  `/claim-requests/${claimRequestIdSchema.parse(id)}`
export const claimRequestManagementService = {
  updateClaim: async (id: string, payload: UpdateClaimManagementRequest) => {
    const request = updateClaimManagementRequestSchema.parse(payload)
    const response = await getApiClient().patch(idPath(id), request)
    return claimRequestSchema.parse(response.data)
  },
  refreshPolicyDetails: async (id: string) => {
    managementNoBodyRequestSchema.parse(undefined)
    const response = await getApiClient().post(`${idPath(id)}/policy-details`)
    return claimRequestSchema.parse(response.data)
  },
  inquiryFanavaranBulk: async (ids: string[]) => {
    const request = inquiryFanavaranManagementRequestSchema.parse({
      claimRequestIds: ids,
    })
    const response = await getApiClient().post(
      '/claim-requests/policy-details/bulk',
      request
    )
    return claimRequestVoidResponseSchema.parse(response.data)
  },
  assign: async (id: string, payload: AssignClaimRequestRequest) => {
    const request = assignClaimRequestRequestSchema.parse(payload)
    const response = await getApiClient().post(
      `${idPath(id)}/assignments`,
      request
    )
    return claimRequestSchema.parse(response.data)
  },
  assignToMe: async (id: string) => {
    managementNoBodyRequestSchema.parse(undefined)
    const response = await getApiClient().post(`${idPath(id)}/assignments/me`)
    return claimRequestSchema.parse(response.data)
  },
  assignToMeWithStatus: async (
    id: string,
    payload: AssignClaimRequestToMeStatusRequest
  ) => {
    const request = assignClaimRequestToMeStatusRequestSchema.parse(payload)
    const response = await getApiClient().post(
      `${idPath(id)}/assignments/me/status`,
      request
    )
    return claimRequestSchema.parse(response.data)
  },
  submitObjection: async (payload: AddObjectionRequest) => {
    const request = addObjectionRequestSchema.parse(payload)
    const response = await getApiClient().post(
      '/claim-requests/objections',
      request
    )
    return claimRequestSchema.parse(response.data)
  },
  updateDocType: async (payload: UpdateClaimRequestDocTypeRequest) => {
    const request = updateClaimRequestDocTypeRequestSchema.parse(payload)
    const response = await getApiClient().post(
      '/claim-requests/doc-type',
      request
    )
    return claimRequestSchema.parse(response.data)
  },
  getHistory: async (
    params: ClaimRequestHistoryRequest & { signal?: AbortSignal }
  ) => {
    const { signal, ...input } = params
    const { userId, page, size, filters } =
      claimRequestHistoryRequestSchema.parse(input)
    const response = await getApiClient().get(
      `/claim-requests/history/${userId}`,
      { params: { page, size, ...transformApiFilterParams(filters) }, signal }
    )
    return pageClaimRequestHistorySchema.parse(response.data)
  },
}
export default claimRequestManagementService
