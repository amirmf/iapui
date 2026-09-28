import { z } from 'zod'

export { partyRoleSchema } from './enums'
export type { PartyRole } from './enums'

export const partyTypeSchema = z.enum([
  'INDIVIDUAL',
  'ORGANIZATION',
  'GOVERNMENT',
  'INSURANCE_COMPANY',
])
export const partyStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'PENDING',
])
export const partySchema = z
  .object({
    alternateEmail: z.string().nullish(),
    alternateTel: z.string().nullish(),
    alternateFatherName: z.string().nullish(),
    alternateNationalCode: z.string().nullish(),
    alternateBirthYear: z.number().int().nullish(),
    alternateBirthMonth: z.number().int().nullish(),
    alternateBirthDay: z.number().int().nullish(),
    alternateAdBirthYear: z.number().int().nullish(),
    alternateAdBirthMonth: z.number().int().nullish(),
    alternateAdBirthDay: z.number().int().nullish(),
    alternateIdentityNo: z.string().nullish(),
    alternateIdentityIssuePlace: z.string().nullish(),
    alternateAddress: z.string().nullish(),
    alternatePostalCode: z.string().nullish(),
    alternateJobAddress: z.string().nullish(),
    alternateEducationField: z.string().nullish(),
    alternatePassportNo: z.string().nullish(),
    alternateNaturalizedCode: z.string().nullish(),
    alternateBirthCityId: z.number().int().nullish(),
    alternateCityId: z.number().int().nullish(),
    alternateGenderId: z.number().int().nullish(),
    alternateMaritalStatus: z.number().int().nullish(),
    alternateReligionId: z.number().int().nullish(),
    alternateEducationLevelId: z.number().int().nullish(),
    alternateIsIranian: z.number().int().nullish(),
    alternateNationalityId: z.number().int().nullish(),
    alternateIsValid: z.number().int().nullish(),
    alternateIsVerified: z.number().int().nullish(),
    alternateCiiValidationStatus: z.number().int().nullish(),
    alternateCiiMobileStatus: z.number().int().nullish(),
    createdAt: z.string().nullish(),
    createdBy: z.string().nullish(),
    extId: z.string().nullish(),
    displayName: z.string().nullish(),
    fname: z.string().nullish(),
    fullName: z.string().nullish(),
    id: z.uuid().nullish(),
    identifier: z.string().nullish(),
    lname: z.string().nullish(),
    mobileNumber: z.string().nullish(),
    partyType: partyTypeSchema.nullish(),
    status: partyStatusSchema.nullish(),
    fromDate: z.string().nullish(),
    thruDate: z.string().nullish(),
    updatedAt: z.string().nullish(),
    updatedBy: z.string().nullish(),
    userAccountId: z.string().nullish(),
  })
  .loose()
export const partyListSchema = z.array(partySchema)
const partyIdPathSchema = z.object({ id: z.uuid() }).strict()
export const getPartyRequestSchema = z
  .object({ path: partyIdPathSchema })
  .strict()
export const createPartyRequestSchema = partySchema
export const updatePartyRequestSchema = z
  .object({ body: partySchema, path: partyIdPathSchema })
  .strict()
export const patchPartyRequestSchema = z
  .object({ body: z.record(z.string(), z.object({})), path: partyIdPathSchema })
  .strict()
export const listPartiesRequestSchema = z.object({
  sort: z.string().optional(),
  direction: z.string().optional(),
})
export const partyPageRequestSchema = z.object({
  page: z.number().int().optional(),
  size: z.number().int().optional(),
  sort: z.string().optional(),
  direction: z.string().optional(),
  filters: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
})
export const pagePartySchema = z
  .object({
    content: z.array(partySchema).optional(),
    totalElements: z.number().optional(),
    totalPages: z.number().int().optional(),
    size: z.number().int().optional(),
    number: z.number().int().optional(),
    first: z.boolean().optional(),
    last: z.boolean().optional(),
    numberOfElements: z.number().int().optional(),
    empty: z.boolean().optional(),
  })
  .loose()
export const deletePartyRequestSchema = getPartyRequestSchema
export const bulkDeletePartiesRequestSchema = z.array(z.uuid())
export const softDeletePartyRequestSchema = z
  .object({
    path: partyIdPathSchema,
    query: z.object({ thruDate: z.string().optional() }).strict(),
  })
  .strict()
export const softDeletePartiesRequestSchema = z
  .object({
    body: z.array(z.uuid()),
    query: z.object({ thruDate: z.string().optional() }).strict(),
  })
  .strict()
export type Party = z.infer<typeof partySchema>
export type ListPartiesRequest = z.infer<typeof listPartiesRequestSchema>
export type PartyPageRequest = z.infer<typeof partyPageRequestSchema>
export type PageParty = z.infer<typeof pagePartySchema>
export const emptyPartyActionResponseSchema = z
  .union([z.undefined(), z.literal('')])
  .transform(() => undefined)
