import { getApiClient } from '@iap/api-client'
import {
  type AssignSupportTicketToLatestAssessmentUserRequest,
  type CloseSupportTicketRequest,
  type CreateSupportTicketMessageOperationRequest,
  type FindSupportTicketByIdRequest,
  type FindSupportTicketMessagesRequest,
  type FindSupportTicketsRequest,
  type PageSupportTicket,
  type PageSupportTicketMessage,
  type SupportTicket,
  type SupportTicketMessage,
  assignSupportTicketToLatestAssessmentUserRequestSchema,
  closeSupportTicketRequestSchema,
  createSupportTicketMessageOperationRequestSchema,
  findSupportTicketByIdRequestSchema,
  findSupportTicketMessagesRequestSchema,
  findSupportTicketsRequestSchema,
  pageSupportTicketMessageSchema,
  pageSupportTicketSchema,
  supportTicketMessageSchema,
  supportTicketSchema,
} from '@iap/api-types'
import { transformApiFilterParams } from '@iap/shared-lib'

export const ticketService = {
  getPageFull: async (
    request: FindSupportTicketsRequest,
    options?: { signal?: AbortSignal }
  ): Promise<PageSupportTicket> => {
    const payload = findSupportTicketsRequestSchema.parse(request)
    const { page = 0, size = 30, filters } = payload.query
    const response = await getApiClient().get('/support/tickets/page-full', {
      params: { page, size, ...transformApiFilterParams(filters) },
      signal: options?.signal,
    })
    return pageSupportTicketSchema.parse(response.data)
  },

  getById: async (
    request: FindSupportTicketByIdRequest,
    options?: { signal?: AbortSignal }
  ): Promise<SupportTicket> => {
    const payload = findSupportTicketByIdRequestSchema.parse(request)
    const response = await getApiClient().get(
      `/support/tickets/${payload.path.id}`,
      {
        signal: options?.signal,
      }
    )
    return supportTicketSchema.parse(response.data)
  },

  getMessages: async (
    request: FindSupportTicketMessagesRequest,
    options?: { signal?: AbortSignal }
  ): Promise<PageSupportTicketMessage> => {
    const payload = findSupportTicketMessagesRequestSchema.parse(request)
    const { ticketId } = payload.path
    const { page = 0, size = 20 } = payload.query
    const response = await getApiClient().get(
      `/support/tickets/${ticketId}/messages`,
      {
        params: { page, size },
        signal: options?.signal,
      }
    )
    return pageSupportTicketMessageSchema.parse(response.data)
  },

  createMessage: async (
    request: CreateSupportTicketMessageOperationRequest
  ): Promise<SupportTicketMessage> => {
    const payload =
      createSupportTicketMessageOperationRequestSchema.parse(request)
    const response = await getApiClient().post(
      `/support/tickets/${payload.path.ticketId}/messages`,
      payload.body
    )
    return supportTicketMessageSchema.parse(response.data)
  },

  close: async (request: CloseSupportTicketRequest): Promise<SupportTicket> => {
    const payload = closeSupportTicketRequestSchema.parse(request)
    const response = await getApiClient().post(
      `/support/tickets/${payload.path.ticketId}/close`
    )
    return supportTicketSchema.parse(response.data)
  },

  assignToLatestAssessmentUser: async (
    request: AssignSupportTicketToLatestAssessmentUserRequest
  ): Promise<SupportTicket> => {
    const payload =
      assignSupportTicketToLatestAssessmentUserRequestSchema.parse(request)
    const response = await getApiClient().post(
      `/support/tickets/${payload.path.ticketId}/assign_to_Latest_assessmentUser`
    )
    return supportTicketSchema.parse(response.data)
  },
}
