import { z } from 'zod'

export const personSpecialDiseaseEnumSchema = z.enum([
  'VIP',
  'LEVEL_ONE',
  'LEVEL_TWO',
  'SPECIAL_DISEASES',
  'SACRIFICE',
])
export type PersonSpecialDiseasesEnum = z.infer<
  typeof personSpecialDiseaseEnumSchema
>
