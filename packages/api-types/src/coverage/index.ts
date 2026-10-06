import { z } from 'zod'

import { createPageRequestSchema, createPageResponseSchema } from '../common'

const isoDateTimeRegex =
  /^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?)(?:Z|[+-](?:[01]\d|2[0-3])(?::?[0-5]\d))?$/
const isoDateTimeSchema = z.string().regex(isoDateTimeRegex, 'Invalid datetime format').nullish()

const springSortSchema = z
  .object({
    empty: z.boolean().optional(),
    sorted: z.boolean().optional(),
    unsorted: z.boolean().optional(),
  })
  .loose()

const springPageableSchema = z
  .object({
    offset: z.number().optional(),
    pageNumber: z.number().optional(),
    pageSize: z.number().optional(),
    paged: z.boolean().optional(),
    sort: springSortSchema.nullish(),
    unpaged: z.boolean().optional(),
  })
  .loose()

export const coverageTypeSchema = z.enum(['GROUP', 'DETAIL'])
export type CoverageType = z.infer<typeof coverageTypeSchema>
export const coverageStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'PENDING',
])
export type CoverageStatus = z.infer<typeof coverageStatusSchema>

const coverageResponseBaseSchema = z.object({
  code: z.string().nullish(),
  coverageType: coverageTypeSchema.nullish(),
  createdAt: isoDateTimeSchema,
  createdBy: z.string().nullish(),
  extCode: z.string().nullish(),
  extId: z.string().nullish(),
  fromDate: isoDateTimeSchema,
  id: z.string().uuid().nullish(),
  maximumCoverage: z.number().nullish(),
  rootCoverageId: z.string().uuid().nullish(),
  status: coverageStatusSchema.nullish(),
  thruDate: isoDateTimeSchema,
  title: z.string().nullish(),
  typeIndicator: z.string().nullish(),
  updatedAt: isoDateTimeSchema,
  updatedBy: z.string().nullish(),
})

export const coverageSchema = coverageResponseBaseSchema
  .extend({ rootCoverage: coverageResponseBaseSchema.nullish() })
  .loose()
export type Coverage = z.infer<typeof coverageSchema>
export const coverageListSchema = z.array(coverageSchema)

export const coverageFormSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  coverageType: coverageTypeSchema,
  fromDate: z.date(),
  maximumCoverage: z.number().optional(),
  rootCoverageId: z.string().uuid().nullish(),
  status: coverageStatusSchema,
  thruDate: z.date().optional(),
  title: z.string().min(1, 'Title is required'),
  typeIndicator: z.string().min(1, 'Type indicator is required'),
})
export type CoverageForm = z.infer<typeof coverageFormSchema>

export const coveragePageSchema = createPageResponseSchema(coverageSchema).extend({
  pageable: springPageableSchema.nullish(),
  sort: springSortSchema.nullish(),
})
export type CoveragePage = z.infer<typeof coveragePageSchema>

export const coveragePageRequestSchema = createPageRequestSchema()
const coverageIdPathSchema = z.object({ id: z.string().uuid() }).strict()
const optionalThruDateQuerySchema = z
  .object({ thruDate: z.string().optional() })
  .strict()

export const getCoverageRequestSchema = z
  .object({ path: coverageIdPathSchema })
  .strict()
export const createCoverageRequestSchema = coverageFormSchema
export const updateCoverageRequestSchema = z
  .object({
    body: coverageFormSchema.extend({ id: z.string().uuid() }),
    path: coverageIdPathSchema,
  })
  .strict()
export const softDeleteCoveragesRequestSchema = z
  .object({ body: z.array(z.string().uuid()).min(1), query: optionalThruDateQuerySchema })
  .strict()
export const bulkDeleteCoveragesRequestSchema = z.array(z.string().uuid()).min(1)
