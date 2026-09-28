import { z } from 'zod'

/** Nationality is a User Account contract in the reference implementation. */
export const nationalityTypeSchema = z.enum(['IR', 'FOREIGN'])
export type NationalityType = z.infer<typeof nationalityTypeSchema>
