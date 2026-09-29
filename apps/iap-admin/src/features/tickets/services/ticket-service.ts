import { getApiClient } from '@iap/api-client'
import {
  type AssignSupportTicketToLatestAssessmentUserRequest,
  type CloseSupportTicketRequest,
  type CreateSupportTicketMessageOperationRequest,
  type FindSupportTicketByIdRequest,
  type FindSupportTicketMessagesRequest,
  type FindSupportTicketsRequest,
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
  assignToLatestAssessmentUser: async (
    input: AssignSupportTicketToLatestAssessmentUserRequest
  ) => {
    const request =
      assignSupportTicketToLatestAssessmentUserRequestSchema.parse(input)
    const response = await getApiClient().post(
      `/support/tickets/${request.path.ticketId}/assign_to_Latest_assessmentUser`
    )

    return supportTicketSchema.parse(response.data)
  },
  close: async (input: CloseSupportTicketRequest) => {
    const request = closeSupportTicketRequestSchema.parse(input)
    const response = await getApiClient().post(
      `/support/tickets/${request.path.ticketId}/close`
    )

    return supportTicketSchema.parse(response.data)
  },
  createMessage: async (input: CreateSupportTicketMessageOperationRequest) => {
    const request =
      createSupportTicketMessageOperationRequestSchema.parse(input)
    const response = await getApiClient().post(
      `/support/tickets/${request.path.ticketId}/messages`,
      request.body
    )

    return supportTicketMessageSchema.parse(response.data)
  },
  findById: async (
    input: FindSupportTicketByIdRequest & { signal?: AbortSignal }
  ) => {
    const { signal, ...requestInput } = input
    const request = findSupportTicketByIdRequestSchema.parse(requestInput)
    const response = await getApiClient().get(
      `/support/tickets/${request.path.id}`,
      {
        signal,
      }
    )

    return supportTicketSchema.parse(response.data)
  },
  findPage: async (
    options: FindSupportTicketsRequest & { signal?: AbortSignal }
  ) => {
    const { signal, ...input } = options
    const request = findSupportTicketsRequestSchema.parse(input)
    const response = await getApiClient().get('/support/tickets/page-full', {
      params: {
        page: request.query.page,
        size: request.query.size,
        ...transformApiFilterParams(request.query.filters),
      },
      signal,
    })

    return pageSupportTicketSchema.parse(response.data)
  },
  findMessages: async (
    input: FindSupportTicketMessagesRequest & { signal?: AbortSignal }
  ) => {
    const { signal, ...requestInput } = input
    const request = findSupportTicketMessagesRequestSchema.parse(requestInput)
    const response = await getApiClient().get(
      `/support/tickets/${request.path.ticketId}/messages`,
      {
        params: request.query,
        signal,
      }
    )

    return pageSupportTicketMessageSchema.parse(response.data)
  },
}
