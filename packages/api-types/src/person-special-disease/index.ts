import { pageFiltersSchema } from '@iap/shared-lib'
import { z } from 'zod'

import { personSpecialDiseaseEnumSchema } from './enums'

export { personSpecialDiseaseEnumSchema } from './enums'
export type { PersonSpecialDiseasesEnum } from './enums'

export const personSpecialDiseaseSchema = z
  .object({
    createdAt: z.string().optional(),
    id: z.string().optional(),
    nationalCode: z.string().optional(),
    specialDiseases: z.array(personSpecialDiseaseEnumSchema).optional(),
    updatedAt: z.string().optional(),
  })
  .loose()

export const insuredPersonSchema = z
  .object({
    address: z.string().nullish(),
    birthDay: z.number().int().nullish(),
    birthMonth: z.number().int().nullish(),
    birthYear: z.number().int().nullish(),
    adBirthYear: z.number().int().nullish(),
    adBirthMonth: z.number().int().nullish(),
    adBirthDay: z.number().int().nullish(),
    identityNo: z.string().nullish(),
    identityNoIssuPlace: z.string().nullish(),
    postalCode: z.string().nullish(),
    tel: z.string().nullish(),
    mobile: z.string().nullish(),
    fatherName: z.string().nullish(),
    id: z.number().nullish(),
    lastName: z.string().nullish(),
    name: z.string().nullish(),
    nationalCode: z.string().nullish(),
  })
  .loose()

export const insuredPersonListSchema = z.array(insuredPersonSchema)

const sortObjectSchema = z
  .object({
    empty: z.boolean().optional(),
    sorted: z.boolean().optional(),
    unsorted: z.boolean().optional(),
  })
  .loose()
const pageableObjectSchema = z
  .object({
    pageNumber: z.number().int().optional(),
    pageSize: z.number().int().optional(),
    sort: sortObjectSchema.optional(),
    offset: z.number().optional(),
    paged: z.boolean().optional(),
    unpaged: z.boolean().optional(),
  })
  .loose()
export const pagePersonSpecialDiseaseSchema = z
  .object({
    content: z.array(personSpecialDiseaseSchema),
    totalPages: z.number().int(),
    totalElements: z.number(),
    number: z.number().int(),
    size: z.number().int(),
    pageable: pageableObjectSchema.optional(),
    sort: sortObjectSchema.optional(),
    numberOfElements: z.number().int().optional(),
    first: z.boolean().optional(),
    last: z.boolean().optional(),
    empty: z.boolean().optional(),
  })
  .loose()
export type InsuredPerson = z.infer<typeof insuredPersonSchema>
export type PersonSpecialDisease = z.infer<typeof personSpecialDiseaseSchema>
export type PagePersonSpecialDisease = z.infer<
  typeof pagePersonSpecialDiseaseSchema
>

const personSpecialDiseaseIdSchema = z.object({ id: z.string() }).strict()
export const getPersonSpecialDiseaseByNationalCodeRequestSchema = z
  .object({ query: z.object({ nationalCode: z.string() }).strict() })
  .strict()
export const createPersonSpecialDiseaseRequestSchema =
  personSpecialDiseaseSchema
export const updatePersonSpecialDiseaseRequestSchema = z
  .object({
    body: personSpecialDiseaseSchema,
    path: personSpecialDiseaseIdSchema,
  })
  .strict()
export const getPersonSpecialDiseaseRequestSchema = z
  .object({ path: personSpecialDiseaseIdSchema })
  .strict()
export const deletePersonSpecialDiseaseRequestSchema =
  getPersonSpecialDiseaseRequestSchema
export const bulkDeletePersonSpecialDiseasesRequestSchema = z.array(z.string())
export const softDeletePersonSpecialDiseasesRequestSchema = z
  .object({
    body: z.array(z.string()),
    query: z.object({ thruDate: z.string().optional() }).strict(),
  })
  .strict()
export const personSpecialDiseasePageRequestSchema = z
  .object({
    direction: z.string().optional(),
    filters: pageFiltersSchema,
    page: z.number().int().optional(),
    size: z.number().int().optional(),
    sort: z.string().optional(),
  })
  .strict()
export const getInsuredPersonsByUserAccountIdRequestSchema = z
  .object({ path: z.object({ userAccountId: z.string() }).strict() })
  .strict()
