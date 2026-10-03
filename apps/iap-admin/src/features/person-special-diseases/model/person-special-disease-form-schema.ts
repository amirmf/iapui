import { personSpecialDiseaseEnumSchema } from '@iap/api-types'
import type { TFunction } from 'i18next'
import { z } from 'zod'

export function createPersonSpecialDiseaseFormSchema(t: TFunction) {
  return z.object({
    nationalCode: z
      .string()
      .min(1, t('personSpecialDiseases.validation.nationalCodeRequired')),
    specialDiseases: z
      .array(personSpecialDiseaseEnumSchema)
      .min(1, t('personSpecialDiseases.validation.specialDiseasesRequired')),
  })
}

export type PersonSpecialDiseaseFormValues = z.infer<
  ReturnType<typeof createPersonSpecialDiseaseFormSchema>
>
