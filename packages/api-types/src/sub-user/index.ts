import { z } from 'zod'

import { createPageRequestSchema, createPageResponseSchema } from '../common'

export const subUserRoleSchema = z.enum([
  'ROLE_REQUEST_REGISTERY_AGENT',
  'ROLE_ASSESSMENT_USER',
  'ROLE_DOCTOR_USER',
])
export type SubUserRole = z.infer<typeof subUserRoleSchema>

export const subUserExtLocationSchema = z
  .object({
    extLocationId: z.string().nullish(),
    extLocationName: z.string().nullish(),
  })
  .loose()
export type SubUserExtLocation = z.infer<typeof subUserExtLocationSchema>

export const subUserPartyDtoSchema = z
  .object({
    alternateAddress: z.string().nullish(),
    alternateAdBirthDay: z.number().nullish(),
    alternateAdBirthMonth: z.number().nullish(),
    alternateAdBirthYear: z.number().nullish(),
    alternateBirthDay: z.number().nullish(),
    alternateBirthMonth: z.number().nullish(),
    alternateBirthYear: z.number().nullish(),
    alternateEmail: z.string().nullish(),
    alternateFatherName: z.string().nullish(),
    alternateIdentityIssuePlace: z.string().nullish(),
    alternateIdentityNo: z.string().nullish(),
    alternateJobAddress: z.string().nullish(),
    alternateNationalCode: z.string().nullish(),
    alternatePostalCode: z.string().nullish(),
    alternateTel: z.string().nullish(),
    createdAt: z.string().nullish(),
    createdBy: z.string().nullish(),
    displayName: z.string().nullish(),
    extId: z.string().nullish(),
    fname: z.string().nullish(),
    fullName: z.string().nullish(),
    id: z.uuid().nullish(),
    identifier: z.string().nullish(),
    lname: z.string().nullish(),
    mobileNumber: z.string().nullish(),
    partyType: z.string().nullish(),
    updatedAt: z.string().nullish(),
    updatedBy: z.string().nullish(),
    userAccountId: z.string().nullish(),
  })
  .loose()
export type SubUserPartyDto = z.infer<typeof subUserPartyDtoSchema>

export const subUserSchema = z
  .object({
    accountNonExpired: z.boolean().optional(),
    accountNonLocked: z.boolean().optional(),
    branchLocations: z.array(subUserExtLocationSchema).nullish(),
    createdAt: z.string().nullish(),
    createdBy: z.string().nullish(),
    credentialsNonExpired: z.boolean().optional(),
    displayName: z.string().nullish(),
    docTypeCodes: z.array(z.string()).optional(),
    email: z.string().nullish(),
    enabled: z.boolean().optional(),
    extContractId: z.number().nullish(),
    hasAccessToAllBranch: z.boolean().nullish(),
    id: z.uuid(),
    isPasswordChangeForced: z.string().nullish(),
    mobileNumber: z.string().nullish(),
    parentUserAccountId: z.uuid().nullish(),
    party: subUserPartyDtoSchema.nullish(),
    roles: z.array(z.string()).optional(),
    updatedAt: z.string().nullish(),
    updatedBy: z.string().nullish(),
    username: z.string(),
  })
  .loose()

export type SubUser = z.infer<typeof subUserSchema>
export const subUserListSchema = z.array(subUserSchema)

export const pageSubUserSchema = createPageResponseSchema(subUserSchema)
export type PageSubUser = z.infer<typeof pageSubUserSchema>

export const subUserPageRequestSchema = createPageRequestSchema()
export type SubUserPageRequest = z.infer<typeof subUserPageRequestSchema>

export const releaseAssignmentsPayloadSchema = z.object({
  userId: z.string(),
})
export type ReleaseAssignmentsPayload = z.infer<
  typeof releaseAssignmentsPayloadSchema
>

export const releaseAssignmentsResponseSchema = z.record(z.string(), z.number())
export type ReleaseAssignmentsResponse = z.infer<
  typeof releaseAssignmentsResponseSchema
>
