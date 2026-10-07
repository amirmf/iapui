import { getApiClient } from '@iap/api-client'
import {
  type FindMyIapTicketByIdRequest,
  type FindMyIapTicketMessagesRequest,
  type FindMyIapTicketsRequest,
  type PageSupportTicket,
  type PageSupportTicketMessage,
  type SupportFlowRequest,
  type SupportFlowResponse,
  type SupportTicket,
  findMyIapTicketByIdRequestSchema,
  findMyIapTicketMessagesRequestSchema,
  findMyIapTicketsRequestSchema,
  pageSupportTicketMessageSchema,
  pageSupportTicketSchema,
  supportFlowRequestSchema,
  supportFlowResponseSchema,
  supportTicketSchema,
} from '@iap/api-types'

const basePath = '/support'

export const supportService = {
  publicAnswer: async (
    payload: SupportFlowRequest,
    options?: { signal?: AbortSignal }
  ): Promise<SupportFlowResponse> => {
    const validatedPayload = supportFlowRequestSchema.parse(payload)
    const response = await getApiClient().post(
      `${basePath}/answer`,
      validatedPayload,
      {
        signal: options?.signal,
        withCredentials: true,
      }
    )

    return supportFlowResponseSchema.parse(response.data)
  },

  myAnswer: async (
    payload: SupportFlowRequest,
    options?: { signal?: AbortSignal }
  ): Promise<SupportFlowResponse> => {
    const validatedPayload = supportFlowRequestSchema.parse(payload)
    const response = await getApiClient().post(
      `${basePath}/my/answer`,
      validatedPayload,
      {
        signal: options?.signal,
      }
    )

    return supportFlowResponseSchema.parse(response.data)
  },

  getMyIapTicketById: async (
    request: FindMyIapTicketByIdRequest,
    options?: { signal?: AbortSignal }
  ): Promise<SupportTicket> => {
    const payload = findMyIapTicketByIdRequestSchema.parse(request)
    const response = await getApiClient().get(
      `/my/iap-ticket/tickets/${payload.path.ticketId}`,
      { signal: options?.signal }
    )

    return supportTicketSchema.parse(response.data)
  },

  getMyIapTicketMessages: async (
    request: FindMyIapTicketMessagesRequest,
    options?: { signal?: AbortSignal }
  ): Promise<PageSupportTicketMessage> => {
    const payload = findMyIapTicketMessagesRequestSchema.parse(request)
    const response = await getApiClient().get(
      `/my/iap-ticket/tickets/${payload.path.ticketId}/messages`,
      { params: payload.query, signal: options?.signal }
    )

    return pageSupportTicketMessageSchema.parse(response.data)
  },

  getMyIapTickets: async (
    request: FindMyIapTicketsRequest,
    options?: { signal?: AbortSignal }
  ): Promise<PageSupportTicket> => {
    const payload = findMyIapTicketsRequestSchema.parse(request)
    const response = await getApiClient().get(
      '/my/iap-ticket/tickets/page-full',
      {
        params: {
          page: payload.query.page,
          size: payload.query.size,
          ...payload.query.filters,
        },
        signal: options?.signal,
      }
    )

    return pageSupportTicketSchema.parse(response.data)
  },
}
