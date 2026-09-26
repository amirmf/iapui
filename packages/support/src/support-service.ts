import { getApiClient } from '@iap/api-client'
import {
  type SupportFlowRequest,
  findMyIapTicketByIdRequestSchema,
  findMyIapTicketMessagesRequestSchema,
  findMyIapTicketsRequestSchema,
  pageSupportTicketMessageSchema,
  pageSupportTicketSchema,
  supportFlowRequestSchema,
  supportFlowResponseSchema,
  supportTicketSchema,
} from '@iap/api-types'

async function answer(
  path: '/support/answer' | '/support/my/answer',
  payload: SupportFlowRequest,
  signal?: AbortSignal
) {
  const response = await getApiClient().post(
    path,
    supportFlowRequestSchema.parse(payload),
    {
      signal,
      ...(path === '/support/answer' ? { withCredentials: true } : {}),
    }
  )

  return supportFlowResponseSchema.parse(response.data)
}

export const supportService = {
  myAnswer: (payload: SupportFlowRequest, signal?: AbortSignal) =>
    answer('/support/my/answer', payload, signal),
  publicAnswer: (payload: SupportFlowRequest, signal?: AbortSignal) =>
    answer('/support/answer', payload, signal),
  getMyIapTicketById: async (
    request: Parameters<typeof findMyIapTicketByIdRequestSchema.parse>[0],
    signal?: AbortSignal
  ) => {
    const payload = findMyIapTicketByIdRequestSchema.parse(request)
    const response = await getApiClient().get(
      `/my/iap-ticket/tickets/${payload.path.ticketId}`,
      { signal }
    )
    return supportTicketSchema.parse(response.data)
  },
  getMyIapTicketMessages: async (
    request: Parameters<typeof findMyIapTicketMessagesRequestSchema.parse>[0],
    signal?: AbortSignal
  ) => {
    const payload = findMyIapTicketMessagesRequestSchema.parse(request)
    const response = await getApiClient().get(
      `/my/iap-ticket/tickets/${payload.path.ticketId}/messages`,
      { params: payload.query, signal }
    )
    return pageSupportTicketMessageSchema.parse(response.data)
  },
  getMyIapTickets: async (
    request: Parameters<typeof findMyIapTicketsRequestSchema.parse>[0],
    signal?: AbortSignal
  ) => {
    const payload = findMyIapTicketsRequestSchema.parse(request)
    const response = await getApiClient().get(
      '/my/iap-ticket/tickets/page-full',
      {
        params: {
          page: payload.query.page,
          size: payload.query.size,
          ...payload.query.filters,
        },
        signal,
      }
    )
    return pageSupportTicketSchema.parse(response.data)
  },
}
