import { z } from 'zod'

import {
  claimRequestIdSchema,
  claimRequestSchema,
  claimRequestYesNoSchema,
  pageClaimRequestRequestSchema,
  pageClaimRequestSchema,
} from '../claim-request'
import { createPageRequestSchema } from '../common'
import { attachmentSchema } from '../files'

export const registeryAgentSubInsuredPersonSchema = z.object({
  displayName: z.string().nullable().optional(),
  mobileNumber: z.string().nullable().optional(),
  userId: z.string(),
  username: z.string(),
})

export const registeryAgentPolicySchema = z.object({
  planId: z.number(),
  id: z.number(),
  title: z.string(),
})

export const registeryAgentInquirySchema = z
  .object({
    selectedUser: registeryAgentSubInsuredPersonSchema.nullable().optional(),
    policies: z.array(registeryAgentPolicySchema).nullable().optional(),
  })
  .loose()

export const createClaimRequestByRegisteryAgentRequestSchema = z
  .object({
    selectedUserId: z.string(),
    claimRequest: claimRequestSchema.partial(),
  })
  .loose()

export const registeryAgentAddObjectionRequestSchema = z
  .object({
    claimRequestId: z.string(),
    description: z.string(),
    claimRequestStatus: z.string().optional(),
    attachments: z.array(attachmentSchema).optional(),
    isCheat: claimRequestYesNoSchema.optional(),
  })
  .loose()

export type RegisteryAgentInquiryResponse = z.infer<
  typeof registeryAgentInquirySchema
>
export type CreateClaimRequestByRegisteryAgentRequest = z.infer<
  typeof createClaimRequestByRegisteryAgentRequestSchema
>
export type RegisteryAgentAddObjectionRequest = z.infer<
  typeof registeryAgentAddObjectionRequestSchema
>

export const agentClaimRequestPageRequestSchema = pageClaimRequestRequestSchema
export const agentClaimRequestPageResponseSchema = pageClaimRequestSchema

export const agentClaimRequestExportExcelRequestSchema =
  createPageRequestSchema().pick({
    filters: true,
  })
export const agentClaimRequestExportExcelResponseSchema = z.instanceof(Blob)

export const agentClaimRequestIdSchema = claimRequestIdSchema
export const agentClaimRequestResponseSchema = claimRequestSchema

export const agentClaimRequestVoidResponseSchema = z
  .unknown()
  .transform(() => undefined)

export type AgentClaimRequestPageRequest = z.input<
  typeof agentClaimRequestPageRequestSchema
>
export type AgentClaimRequestExportExcelRequest = z.input<
  typeof agentClaimRequestExportExcelRequestSchema
>
