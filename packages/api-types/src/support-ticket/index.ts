import { z } from 'zod'

import { createPageRequestSchema, createPageResponseSchema } from '../common'

const uuidSchema = z.uuid()

export const ticketStatusSchema = z.enum([
  'OPEN',
  'ASSIGNED',
  'WAITING_FOR_USER',
  'WAITING_FOR_SUPPORT',
  'ANSWERED',
  'CLOSED',
])
export const ticketCategorySchema = z.enum([
  'PAYMENT',
  'CLAIM_ISSUE',
  'INFO_ISSUE',
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
    body: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    createdBy: z.string().nullable().optional(),
    id: z.string().nullable().optional(),
    readBySupport: z.boolean().nullable().optional(),
    readByUser: z.boolean().nullable().optional(),
    senderUserAccountId: z.string().nullable().optional(),
    senderType: ticketSenderTypeSchema.nullable().optional(),
    senderUsername: z.string().nullable().optional(),
    ticketId: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
    updatedBy: z.string().nullable().optional(),
    visibility: ticketVisibilitySchema.nullable().optional(),
  })
  .loose()
export const supportTicketUserSchema = z
  .object({
    displayName: z.string().nullable().optional(),
    id: uuidSchema.nullable().optional(),
    username: z.string().nullable().optional(),
  })
  .loose()
export const supportTicketStatusHistorySchema = z
  .object({
    changedAt: z.string().nullable().optional(),
    changedByDisplayName: z.string().nullable().optional(),
    changedByUserAccountId: z.string().nullable().optional(),
    changedByUsername: z.string().nullable().optional(),
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
    assignedUserAccount: supportTicketUserSchema.nullable().optional(),
    answeredAt: z.string().nullable().optional(),
    assignmentHistory: z
      .array(supportTicketAssignmentHistorySchema)
      .nullable()
      .optional(),
    category: ticketCategorySchema.nullable().optional(),
    closedAt: z.string().nullable().optional(),
    claimRequestId: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    createdBy: z.string().nullable().optional(),
    expectedAnswerTime: z.string().nullable().optional(),
    id: z.string().nullable().optional(),
    lastMessage: supportTicketMessageSchema.nullable().optional(),
    lastMessageAt: z.string().nullable().optional(),
    ownerUserAccount: supportTicketUserSchema.nullable().optional(),
    priority: ticketPrioritySchema.nullable().optional(),
    status: ticketStatusSchema.nullable().optional(),
    statusHistory: z
      .array(supportTicketStatusHistorySchema)
      .nullable()
      .optional(),
    subject: z.string().nullable().optional(),
    tags: z.array(z.string()).nullable().optional(),
    ticketNumber: z.number().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
    updatedBy: z.string().nullable().optional(),
  })
  .loose()
export const pageSupportTicketSchema =
  createPageResponseSchema(supportTicketSchema)
export const pageSupportTicketMessageSchema = createPageResponseSchema(
  supportTicketMessageSchema
)
export const findMyIapTicketByIdRequestSchema = z.object({
  path: z.object({ ticketId: uuidSchema }),
})
export const findMyIapTicketMessagesRequestSchema = z.object({
  path: z.object({ ticketId: uuidSchema }),
  query: createPageRequestSchema(),
})
export const findMyIapTicketsRequestSchema = z.object({
  query: createPageRequestSchema(),
})
export const findSupportTicketsRequestSchema = z
  .object({
    query: createPageRequestSchema(),
  })
  .strict()
export const findSupportTicketByIdRequestSchema = z
  .object({ path: z.object({ id: uuidSchema }).strict() })
  .strict()
export const findSupportTicketMessagesRequestSchema = z
  .object({
    path: z.object({ ticketId: uuidSchema }).strict(),
    query: z
      .object({
        page: z.number().int().nonnegative().optional(),
        size: z.number().int().positive().optional(),
      })
      .strict(),
  })
  .strict()
export const createSupportTicketMessageRequestSchema = z
  .object({
    body: z.string().min(0).max(4000),
    internal: z.boolean().optional(),
  })
  .strict()
export const createSupportTicketMessageOperationRequestSchema = z
  .object({
    body: createSupportTicketMessageRequestSchema,
    path: z.object({ ticketId: uuidSchema }).strict(),
  })
  .strict()
export const closeSupportTicketRequestSchema = z
  .object({ path: z.object({ ticketId: uuidSchema }).strict() })
  .strict()
export const assignSupportTicketToLatestAssessmentUserRequestSchema = z
  .object({ path: z.object({ ticketId: uuidSchema }).strict() })
  .strict()
export type FindMyIapTicketByIdRequest = z.infer<
  typeof findMyIapTicketByIdRequestSchema
>
export type FindMyIapTicketMessagesRequest = z.infer<
  typeof findMyIapTicketMessagesRequestSchema
>
export type FindMyIapTicketsRequest = z.infer<
  typeof findMyIapTicketsRequestSchema
>
export type FindSupportTicketsRequest = z.input<
  typeof findSupportTicketsRequestSchema
>
export type SupportTicket = z.infer<typeof supportTicketSchema>
export type TicketCategory = z.infer<typeof ticketCategorySchema>
export type TicketPriority = z.infer<typeof ticketPrioritySchema>
export type TicketStatus = z.infer<typeof ticketStatusSchema>
export type PageSupportTicket = z.infer<typeof pageSupportTicketSchema>
export type PageSupportTicketMessage = z.infer<
  typeof pageSupportTicketMessageSchema
>
export type SupportTicketMessage = z.infer<typeof supportTicketMessageSchema>
export type SupportTicketStatusHistory = z.infer<
  typeof supportTicketStatusHistorySchema
>
export type FindSupportTicketByIdRequest = z.input<
  typeof findSupportTicketByIdRequestSchema
>
export type FindSupportTicketMessagesRequest = z.input<
  typeof findSupportTicketMessagesRequestSchema
>
export type CreateSupportTicketMessageOperationRequest = z.input<
  typeof createSupportTicketMessageOperationRequestSchema
>
export type CloseSupportTicketRequest = z.input<
  typeof closeSupportTicketRequestSchema
>
export type AssignSupportTicketToLatestAssessmentUserRequest = z.input<
  typeof assignSupportTicketToLatestAssessmentUserRequestSchema
>
