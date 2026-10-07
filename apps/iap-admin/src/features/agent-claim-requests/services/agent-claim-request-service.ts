import { getApiClient } from '@iap/api-client'
import {
  type ClaimRequest,
  type CreateClaimRequestByRegisteryAgentRequest,
  type PageClaimRequest,
  type RegisteryAgentAddObjectionRequest,
  type RegisteryAgentInquiryResponse,
  type SubInsuredPersonResponse,
  claimRequestSchema,
  pageClaimRequestSchema,
} from '@iap/api-types'
import { type ApiFilterParams, transformApiFilterParams } from '@iap/shared-lib'

import {
  createClaimRequestByRegisteryAgentRequestSchema,
  registeryAgentAddObjectionRequestSchema,
  registeryAgentInquirySchema,
  subInsuredPersonResponseListSchema,
} from '../model/agent-claim-request-schema'

export const agentClaimRequestService = {
  getById: async (
    id: string,
    options?: { signal?: AbortSignal }
  ): Promise<ClaimRequest> => {
    const response = await getApiClient().get(
      `/claim-request-registery-agent/claim-requests/${id}`,
      {
        signal: options?.signal,
      }
    )
    return claimRequestSchema.parse(response.data)
  },

  create: async (
    payload: CreateClaimRequestByRegisteryAgentRequest
  ): Promise<ClaimRequest> => {
    const validatedPayload =
      createClaimRequestByRegisteryAgentRequestSchema.parse(payload)
    const response = await getApiClient().post(
      '/claim-request-registery-agent/claim-requests',
      validatedPayload
    )
    return claimRequestSchema.parse(response.data)
  },

  update: async (
    id: string,
    payload: Partial<ClaimRequest>
  ): Promise<ClaimRequest> => {
    const response = await getApiClient().put(
      `/claim-request-registery-agent/claim-requests/${id}`,
      payload
    )
    return claimRequestSchema.parse(response.data)
  },

  delete: async (id: string): Promise<void> => {
    await getApiClient().delete(
      `/claim-request-registery-agent/claim-requests/${id}`
    )
  },

  refreshPolicyDetails: async (id: string): Promise<ClaimRequest> => {
    const response = await getApiClient().post(
      `/claim-requests/${id}/policy-details`
    )
    return claimRequestSchema.parse(response.data)
  },

  submitObjection: async (
    payload: RegisteryAgentAddObjectionRequest
  ): Promise<ClaimRequest> => {
    const validatedPayload =
      registeryAgentAddObjectionRequestSchema.parse(payload)
    const response = await getApiClient().post(
      '/claim-request-registery-agent/claim-requests/objections',
      validatedPayload
    )
    return claimRequestSchema.parse(response.data)
  },

  getSubInsuredPeople: async (
    policyId: number,
    username: string,
    options?: { signal?: AbortSignal }
  ): Promise<SubInsuredPersonResponse[]> => {
    const response = await getApiClient().get(
      `/claim-request-registery-agent/sub-insured-people/${policyId}/${username}`,
      {
        signal: options?.signal,
      }
    )
    return subInsuredPersonResponseListSchema.parse(response.data)
  },

  inquiry: async (params?: {
    username?: string
    signal?: AbortSignal
  }): Promise<RegisteryAgentInquiryResponse> => {
    const response = await getApiClient().get(
      '/claim-request-registery-agent/inquery',
      {
        params: {
          username: params?.username,
        },
        signal: params?.signal,
      }
    )
    return registeryAgentInquirySchema.parse(response.data)
  },

  getPage: async (
    params: {
      page?: number
      size?: number
      filters?: ApiFilterParams
      signal?: AbortSignal
    } = {}
  ): Promise<PageClaimRequest> => {
    const { page = 0, size = 20, filters = {}, signal } = params

    const response = await getApiClient().get(
      '/claim-request-registery-agent/claim-requests/page-full',
      {
        params: {
          page,
          size,
          ...transformApiFilterParams(filters),
        },
        signal,
      }
    )

    return pageClaimRequestSchema.parse(response.data)
  },

  exportPageLiteExcel: async (
    params: {
      filters?: ApiFilterParams
      signal?: AbortSignal
    } = {}
  ): Promise<Blob> => {
    const { filters = {}, signal } = params
    const response = await getApiClient().get(
      '/claim-request-registery-agent/claim-requests/page-lite/excel',
      {
        params: transformApiFilterParams(filters),
        responseType: 'blob',
        signal,
      }
    )
    return response.data as Blob
  },
}

export default agentClaimRequestService
