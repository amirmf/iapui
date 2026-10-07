import { z } from 'zod'

const uuidSchema = z.uuid()

export const ticketCategorySchema = z.enum([
  'PAYMENT',
  'CLAIM_ISSUE',
  'INFO_ISSUE',
])
export const ticketStatusSchema = z.enum([
  'OPEN',
  'ASSIGNED',
  'WAITING_FOR_USER',
  'WAITING_FOR_SUPPORT',
  'ANSWERED',
  'CLOSED',
])
export const ticketPrioritySchema = z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT'])
export const ticketSenderTypeSchema = z.enum([
  'USER',
  'ASSESSMENT_USER',
  'SYSTEM',
])
export const ticketVisibilitySchema = z.enum(['PUBLIC', 'INTERNAL'])

export const supportTicketMessageSchema = z
  .object({
    id: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
    createdBy: z.string().nullable().optional(),
    updatedBy: z.string().nullable().optional(),
    ticketId: z.string().nullable().optional(),
    senderUserAccountId: z.string().nullable().optional(),
    senderUsername: z.string().nullable().optional(),
    senderType: ticketSenderTypeSchema.nullable().optional(),
    body: z.string().nullable().optional(),
    visibility: ticketVisibilitySchema.nullable().optional(),
    readByUser: z.boolean().nullable().optional(),
    readBySupport: z.boolean().nullable().optional(),
  })
  .loose()

export const supportTicketUserSchema = z
  .object({
    id: uuidSchema.nullable().optional(),
    username: z.string().nullable().optional(),
    displayName: z.string().nullable().optional(),
  })
  .loose()

export const supportTicketStatusHistorySchema = z
  .object({
    changedAt: z.string().nullable().optional(),
    changedByUserAccountId: z.string().nullable().optional(),
    changedByUsername: z.string().nullable().optional(),
    changedByDisplayName: z.string().nullable().optional(),
    fromStatus: ticketStatusSchema.nullable().optional(),
    toStatus: ticketStatusSchema.nullable().optional(),
  })
  .loose()

export const supportTicketAssignmentHistorySchema = z
  .object({
    changedAt: z.string().nullable().optional(),
    changedByUserAccountId: z.string().nullable().optional(),
    changedByUsername: z.string().nullable().optional(),
    fromAssignedUserAccountId: z.string().nullable().optional(),
    fromAssignedUsername: z.string().nullable().optional(),
    toAssignedUserAccountId: z.string().nullable().optional(),
    toAssignedUsername: z.string().nullable().optional(),
  })
  .loose()

export const supportTicketSchema = z
  .object({
    id: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
    createdBy: z.string().nullable().optional(),
    updatedBy: z.string().nullable().optional(),
    ticketNumber: z.number().nullable().optional(),
    claimRequestId: z.string().nullable().optional(),
    category: ticketCategorySchema.nullable().optional(),
    tags: z.array(z.string()).nullable().optional(),
    ownerUserAccount: supportTicketUserSchema.nullable().optional(),
    assignedUserAccount: supportTicketUserSchema.nullable().optional(),
    subject: z.string().nullable().optional(),
    status: ticketStatusSchema.nullable().optional(),
    priority: ticketPrioritySchema.nullable().optional(),
    lastMessageAt: z.string().nullable().optional(),
    answeredAt: z.string().nullable().optional(),
    closedAt: z.string().nullable().optional(),
    expectedAnswerTime: z.string().nullable().optional(),
    statusHistory: z
      .array(supportTicketStatusHistorySchema)
      .nullable()
      .optional(),
    assignmentHistory: z
      .array(supportTicketAssignmentHistorySchema)
      .nullable()
      .optional(),
    lastMessage: supportTicketMessageSchema.nullable().optional(),
  })
  .loose()

export const pageSupportTicketSchema = z
  .object({
    totalPages: z.number().nullable().optional(),
    totalElements: z.number().nullable().optional(),
    numberOfElements: z.number().nullable().optional(),
    size: z.number().nullable().optional(),
    content: z.array(supportTicketSchema).nullish(),
    number: z.number().nullable().optional(),
    first: z.boolean().nullable().optional(),
    last: z.boolean().nullable().optional(),
    sort: z.unknown().nullable().optional(),
    pageable: z.unknown().nullable().optional(),
    empty: z.boolean().nullable().optional(),
  })
  .loose()

export const pageSupportTicketMessageSchema = pageSupportTicketSchema.extend({
  content: z.array(supportTicketMessageSchema).nullish(),
})

export const createSupportTicketMessageRequestSchema = z.object({
  body: z.string().min(0).max(4000),
  internal: z.boolean().optional(),
})

const ticketPageQuerySchema = z.object({
  page: z.number().int().optional(),
  size: z.number().int().optional(),
  filters: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.array(z.string()), z.undefined()])
  ),
})

export const findSupportTicketsRequestSchema = z.object({
  query: ticketPageQuerySchema,
})

export const findSupportTicketByIdRequestSchema = z.object({
  path: z.object({ id: uuidSchema }),
})

export const findSupportTicketMessagesRequestSchema = z.object({
  path: z.object({ ticketId: uuidSchema }),
  query: z.object({
    page: z.number().int().optional(),
    size: z.number().int().optional(),
  }),
})

export const createSupportTicketMessageOperationRequestSchema = z.object({
  path: z.object({ ticketId: uuidSchema }),
  body: createSupportTicketMessageRequestSchema,
})

export const closeSupportTicketRequestSchema = z.object({
  path: z.object({ ticketId: uuidSchema }),
})

export const assignSupportTicketToLatestAssessmentUserRequestSchema = z.object({
  path: z.object({ ticketId: uuidSchema }),
})

export type SupportTicket = z.infer<typeof supportTicketSchema>
export type PageSupportTicket = z.infer<typeof pageSupportTicketSchema>
export type SupportTicketMessage = z.infer<typeof supportTicketMessageSchema>
export type SupportTicketUser = z.infer<typeof supportTicketUserSchema>
export type PageSupportTicketMessage = z.infer<
  typeof pageSupportTicketMessageSchema
>
export type CreateSupportTicketMessageRequest = z.infer<
  typeof createSupportTicketMessageRequestSchema
>
export type FindSupportTicketsRequest = z.infer<
  typeof findSupportTicketsRequestSchema
>
export type FindSupportTicketByIdRequest = z.infer<
  typeof findSupportTicketByIdRequestSchema
>
export type FindSupportTicketMessagesRequest = z.infer<
  typeof findSupportTicketMessagesRequestSchema
>
export type CreateSupportTicketMessageOperationRequest = z.infer<
  typeof createSupportTicketMessageOperationRequestSchema
>
export type CloseSupportTicketRequest = z.infer<
  typeof closeSupportTicketRequestSchema
>
export type AssignSupportTicketToLatestAssessmentUserRequest = z.infer<
  typeof assignSupportTicketToLatestAssessmentUserRequestSchema
>
export type SupportTicketStatusHistory = z.infer<
  typeof supportTicketStatusHistorySchema
>
export type SupportTicketAssignmentHistory = z.infer<
  typeof supportTicketAssignmentHistorySchema
>
export type TicketCategory = z.infer<typeof ticketCategorySchema>
export type TicketStatus = z.infer<typeof ticketStatusSchema>
export type TicketPriority = z.infer<typeof ticketPrioritySchema>
export type TicketVisibility = z.infer<typeof ticketVisibilitySchema>

export const findMyIapTicketByIdRequestSchema = z.object({
  path: z.object({ ticketId: uuidSchema }),
})

export const findMyIapTicketMessagesRequestSchema = z.object({
  path: z.object({ ticketId: uuidSchema }),
  query: z.object({
    page: z.number().int().optional(),
    size: z.number().int().optional(),
  }),
})

export const findMyIapTicketsRequestSchema = z.object({
  query: z.object({
    page: z.number().int().optional(),
    size: z.number().int().optional(),
    filters: z.record(z.string(), z.string()),
  }),
})

export type FindMyIapTicketByIdRequest = z.infer<
  typeof findMyIapTicketByIdRequestSchema
>
export type FindMyIapTicketMessagesRequest = z.infer<
  typeof findMyIapTicketMessagesRequestSchema
>
export type FindMyIapTicketsRequest = z.infer<
  typeof findMyIapTicketsRequestSchema
>
