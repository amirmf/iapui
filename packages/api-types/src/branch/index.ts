import { z } from 'zod'

export const branchSchema = z.object({
  id: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  createdBy: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
  code: z.number().int().nullable().optional(),
  ciiCode: z.number().int().nullable().optional(),
  unitName: z.string().nullable().optional(),
  economicCode: z.string().nullable().optional(),
  companyCode: z.string().nullable().optional(),
  beginDate: z.string().nullable().optional(),
  degree: z.number().int().nullable().optional(),
  address: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  nationalCode: z.string().nullable().optional(),
  identityNo: z.string().nullable().optional(),
  identityNoIssuPlace: z.string().nullable().optional(),
  birthYear: z.number().int().nullable().optional(),
  birthMonth: z.number().int().nullable().optional(),
  birthDay: z.number().int().nullable().optional(),
  fatherName: z.string().nullable().optional(),
  tel: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  fax: z.string().nullable().optional(),
  homeAddress: z.string().nullable().optional(),
  mobile: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  educationField: z.string().nullable().optional(),
  webSiteAddress: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  unitKindId: z.number().int().nullable().optional(),
  isActive: z.number().int().nullable().optional(),
  provinceId: z.number().int().nullable().optional(),
  cityId: z.number().int().nullable().optional(),
  municipalAreaId: z.number().int().nullable().optional(),
  personKindId: z.number().int().nullable().optional(),
  genderId: z.number().int().nullable().optional(),
  educationLevelId: z.number().int().nullable().optional(),
  ciiValidationStatus: z.number().int().nullable().optional(),
})
export type Branch = z.infer<typeof branchSchema>
const sortObjectSchema = z.object({
  empty: z.boolean().optional(),
  sorted: z.boolean().optional(),
  unsorted: z.boolean().optional(),
})
const pageableObjectSchema = z.object({
  offset: z.number().optional(),
  sort: sortObjectSchema.optional(),
  paged: z.boolean().optional(),
  unpaged: z.boolean().optional(),
  pageNumber: z.number().optional(),
  pageSize: z.number().optional(),
})
export const pageBranchSchema = z.object({
  totalPages: z.number().optional(),
  totalElements: z.number().optional(),
  pageable: pageableObjectSchema.optional(),
  size: z.number().optional(),
  content: z.array(branchSchema).nullish(),
  number: z.number().optional(),
  sort: sortObjectSchema.optional(),
  first: z.boolean().optional(),
  last: z.boolean().optional(),
  numberOfElements: z.number().optional(),
  empty: z.boolean().optional(),
})
export type PageBranch = z.infer<typeof pageBranchSchema>
export const branchFormSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  isActive: z.number().int().min(0).max(1),
})
export type BranchForm = z.infer<typeof branchFormSchema>
export const syncResultSchema = z.object({
  inserted: z.number().optional(),
  updated: z.number().optional(),
  deleted: z.number().optional(),
  total: z.number().optional(),
  status: z.string().optional(),
  message: z.string().optional(),
})
export type SyncResult = z.infer<typeof syncResultSchema>

export const branchPageSchema = pageBranchSchema
export const branchPageRequestSchema = z.object({
  filters: z
    .record(z.string(), z.union([z.string(), z.number(), z.array(z.string())]))
    .default({}),
  page: z.number().int().optional(),
  size: z.number().int().optional(),
})
const branchIdPathSchema = z.object({ id: z.string() }).strict()
export const createBranchRequestSchema = branchFormSchema
export const updateBranchRequestSchema = z
  .object({ body: branchFormSchema, path: branchIdPathSchema })
  .strict()
export const deleteBranchRequestSchema = z
  .object({ path: branchIdPathSchema })
  .strict()
export const syncBranchesRequestSchema = z.object({}).strict()
