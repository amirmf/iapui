import { z } from 'zod'

const uuidSchema = z.uuid()
export const ticketStatusSchema = z.enum([
  'OPEN',
  'ASSIGNED',
  'WAITING_FOR_USER',
  'WAITING_FOR_SUPPORT',
  'ANSWERED',
  'CLOSED',
])
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
    id: z.string().nullable().optional(),
    senderType: ticketSenderTypeSchema.nullable().optional(),
    senderUsername: z.string().nullable().optional(),
    ticketId: z.string().nullable().optional(),
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
export const supportTicketSchema = z
  .object({
    assignedUserAccount: supportTicketUserSchema.nullable().optional(),
    category: z.string().nullable().optional(),
    claimRequestId: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    id: z.string().nullable().optional(),
    lastMessage: supportTicketMessageSchema.nullable().optional(),
    lastMessageAt: z.string().nullable().optional(),
    ownerUserAccount: supportTicketUserSchema.nullable().optional(),
    priority: z.string().nullable().optional(),
    status: ticketStatusSchema.nullable().optional(),
    subject: z.string().nullable().optional(),
    ticketNumber: z.number().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
  })
  .loose()
export const pageSupportTicketSchema = z
  .object({
    content: z.array(supportTicketSchema).nullable().optional(),
    empty: z.boolean().nullable().optional(),
    first: z.boolean().nullable().optional(),
    last: z.boolean().nullable().optional(),
    number: z.number().nullable().optional(),
    size: z.number().nullable().optional(),
    totalElements: z.number().nullable().optional(),
    totalPages: z.number().nullable().optional(),
  })
  .loose()
export const pageSupportTicketMessageSchema = pageSupportTicketSchema.extend({
  content: z.array(supportTicketMessageSchema).nullable().optional(),
})
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
    filters: z.record(z.string(), z.string()),
    page: z.number().int().optional(),
    size: z.number().int().optional(),
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
