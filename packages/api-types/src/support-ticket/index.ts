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
export type FindMyIapTicketByIdRequest = z.infer<
  typeof findMyIapTicketByIdRequestSchema
>
export type FindMyIapTicketMessagesRequest = z.infer<
  typeof findMyIapTicketMessagesRequestSchema
>
export type FindMyIapTicketsRequest = z.infer<
  typeof findMyIapTicketsRequestSchema
>
