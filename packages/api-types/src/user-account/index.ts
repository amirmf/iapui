import { z } from 'zod'

import { branchLocationSchema } from '../auth'
import { claimRequestYesNoSchema } from '../claim-request'
import { docTypeCodesSchema } from '../doc-type'
import { partyRoleSchema } from '../party'
import { personSpecialDiseaseEnumSchema } from '../person-special-disease'
import { nationalityTypeSchema } from './enums'

export { nationalityTypeSchema } from './enums'

export const updateUserAccountPayloadSchema = z.object({
  username: z.string().min(3).max(150),
  email: z.string().nullable().optional(),
  displayName: z.string().max(255).nullable().optional(),
  password: z.string().min(6).max(255).optional(),
  mobileNumber: z
    .string()
    .regex(/^(\+989\d{9}|09\d{9})$/)
    .nullable()
    .optional(),
  parentUserAccountId: z.uuid().nullable().optional(),
  roles: z.array(z.string()).optional(),
  docTypeCodes: docTypeCodesSchema.optional(),
  branchLocations: z.array(branchLocationSchema).optional(),
  hasAccessToAllBranch: z.boolean().nullable().optional(),
  enabled: z.boolean().optional(),
  accountNonExpired: z.boolean().optional(),
  extContractId: z.number().nullable().optional(),
  credentialsNonExpired: z.boolean().optional(),
  accountNonLocked: z.boolean().optional(),
  isPasswordChangeForced: z.string().nullable().optional(),
  nationalityType: nationalityTypeSchema.optional().nullable(),
  isCheat: claimRequestYesNoSchema.optional(),
})

export const updateWithPartyPayloadSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(150)
    .regex(/^\d{10}$/),
  email: z.string().nullable().optional(),
  password: z.string().min(6).max(255).optional(),
  mobileNumber: z
    .string()
    .regex(/^(\+989\d{9}|09\d{9})$/)
    .nullable()
    .optional(),
  extId: z.string().nullable().optional(),
  docTypeCodes: docTypeCodesSchema.optional(),
  specialDiseases: z.array(personSpecialDiseaseEnumSchema).optional(),
  branchLocations: z.array(branchLocationSchema).optional(),
  hasAccessToAllBranch: z.boolean().nullable().optional(),
  parentUserAccountId: z.uuid().nullable().optional(),
  roles: z.array(z.string()).optional(),
  fname: z.string().nullable().optional(),
  lname: z.string().nullable().optional(),
  nationalityType: nationalityTypeSchema.optional().nullable(),
  enabled: z.boolean().optional(),
  accountNonExpired: z.boolean().optional(),
  extContractId: z.number().nullable().optional(),
  credentialsNonExpired: z.boolean().optional(),
  accountNonLocked: z.boolean().optional(),
  isCheat: claimRequestYesNoSchema.optional(),
})

export const registerWithPartyPayloadSchema = z.object({
  username: z.string().min(3).max(150),
  email: z.string().nullable().optional(),
  password: z.string().min(6).max(255),
  mobileNumber: z
    .string()
    .regex(/^(\+989\d{9}|09\d{9})$/)
    .nullable()
    .optional(),
  extId: z.string().nullable().optional(),
  docTypeCodes: docTypeCodesSchema.optional(),
  specialDiseases: z.array(personSpecialDiseaseEnumSchema).optional(),
  branchLocations: z.array(branchLocationSchema).optional(),
  hasAccessToAllBranch: z.boolean().nullable().optional(),
  parentUserAccountId: z.uuid().nullable().optional(),
  roles: z.array(z.string()).optional(),
  fname: z.string().nullable().optional(),
  lname: z.string().nullable().optional(),
  nationalityType: nationalityTypeSchema.optional().nullable(),
  isCheat: claimRequestYesNoSchema.optional(),
})

export type BranchLocation = z.infer<typeof branchLocationSchema>
export type UpdateUserAccountPayload = z.infer<
  typeof updateUserAccountPayloadSchema
>
export type UpdateWithPartyPayload = z.infer<
  typeof updateWithPartyPayloadSchema
>
export type RegisterWithPartyPayload = z.infer<
  typeof registerWithPartyPayloadSchema
>

const uuidPathSchema = z.object({ id: z.uuid() })
export const listUserAccountsRequestSchema = z.object({
  textFilter: z.string().optional(),
  docTypeCodes: docTypeCodesSchema.optional(),
  roles: z.string().optional(),
  branchLocations__in: z.string().optional(),
  parentUserAccountId: z.uuid().optional(),
})
export const getUserAccountRequestSchema = z.object({ path: uuidPathSchema })
export const getUserAccountByLookupRequestSchema = z.object({
  path: z.object({ value: z.string() }),
})
export const updateUserAccountRequestSchema = z.object({
  path: uuidPathSchema,
  body: updateUserAccountPayloadSchema,
})
export const updateUserAccountWithPartyRequestSchema = z.object({
  path: uuidPathSchema,
  body: updateWithPartyPayloadSchema,
})
export const deleteUserAccountRequestSchema = z.object({ path: uuidPathSchema })
export const registerWithPartyRequestSchema = registerWithPartyPayloadSchema
export const resetUserAccountPasswordRequestSchema = z.object({
  path: uuidPathSchema,
  body: z.object({ password: z.string().min(6).max(255) }),
})
export const userAccountPageRequestSchema = z.object({
  page: z.number().int().optional(),
  size: z.number().int().optional(),
  sort: z.string().optional(),
  direction: z.string().optional(),
  filters: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.array(z.string()), z.undefined()])
  ),
})
export const refreshUserAccountSnapshotRequestSchema = z.object({
  path: z.object({ userAccountId: z.string() }),
})
export const emptyExternalUnitsRequestSchema = z.object({}).strict()
export const emptyUserAccountActionResponseSchema = z
  .union([z.undefined(), z.literal('')])
  .transform(() => undefined)

export const userAccountSchema = z
  .object({
    id: z.uuid(),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
    createdBy: z.string().nullable().optional(),
    updatedBy: z.string().nullable().optional(),
    username: z.string(),
    email: z.string().nullable().optional(),
    extId: z.string().nullable().optional(),
    displayName: z.string().nullable().optional(),
    fname: z.string().nullable().optional(),
    lname: z.string().nullable().optional(),
    mobileNumber: z.string().nullable().optional(),
    nationalityType: nationalityTypeSchema.nullable().optional(),
    hasAccessToAllBranch: z.boolean().nullable().optional(),
    parentUserAccountId: z.uuid().nullable().optional(),
    roles: z.array(partyRoleSchema).optional(),
    docTypeCodes: docTypeCodesSchema.optional(),
    specialDiseases: z.array(personSpecialDiseaseEnumSchema).optional(),
    branchLocations: z.array(branchLocationSchema).optional(),
    enabled: z.boolean().optional(),
    accountNonExpired: z.boolean().optional(),
    extContractId: z.number().nullable().optional(),
    credentialsNonExpired: z.boolean().optional(),
    accountNonLocked: z.boolean().optional(),
    isPasswordChangeForced: z.string().nullable().optional(),
  })
  .loose()
export type UserAccount = z.infer<typeof userAccountSchema>

export const pageUserAccountSchema = z
  .object({
    totalPages: z.number().int().optional(),
    totalElements: z.number().optional(),
    size: z.number().int().optional(),
    number: z.number().int().optional(),
    numberOfElements: z.number().int().optional(),
    first: z.boolean().optional(),
    last: z.boolean().optional(),
    empty: z.boolean().optional(),
    content: z.array(userAccountSchema).optional(),
  })
  .loose()
export type PageUserAccount = z.infer<typeof pageUserAccountSchema>

export const externalUnitSchema = z.object({
  code: z.number(),
  unitName: z.string().nullable().optional(),
  unitKindId: z.number().nullable().optional(),
  isActive: z.number().nullable().optional(),
  ciiCode: z.number().nullable().optional(),
})
export const externalUnitListSchema = z.array(externalUnitSchema)
export type ExternalUnit = z.infer<typeof externalUnitSchema>
export const refreshUserAccountSnapshotResponseSchema = z.record(
  z.string(),
  z.string()
)
export type ListUserAccountsRequest = z.infer<
  typeof listUserAccountsRequestSchema
>
export type UserAccountPageRequest = z.infer<
  typeof userAccountPageRequestSchema
>
export type RefreshUserAccountSnapshotResponse = z.infer<
  typeof refreshUserAccountSnapshotResponseSchema
>
