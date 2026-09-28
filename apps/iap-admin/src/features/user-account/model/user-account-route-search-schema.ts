import { z } from 'zod'

const optionalTableValueSchema = z
  .union([z.string(), z.array(z.string())])
  .optional()

export const userAccountRouteSearchSchema = z
  .object({
    displayName: z.string().optional(),
    extContractId: z.string().optional(),
    mobileNumber: z.string().optional(),
    nationalityType: optionalTableValueSchema,
    page: z.string().optional(),
    pageSize: z.string().optional(),
    parentUserAccountId: z.string().optional(),
    'roles.name': optionalTableValueSchema,
    sort: z.string().optional(),
    sortDirection: z.enum(['asc', 'desc']).optional(),
    username: z.string().optional(),
  })
  .strict()
