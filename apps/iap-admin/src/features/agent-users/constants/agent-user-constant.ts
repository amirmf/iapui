import { nationalityTypeSchema } from '@iap/api-types'
import type { z } from 'zod'

type NationalityType = z.infer<typeof nationalityTypeSchema>

export const NATIONALITY_TYPE_TRANSLATION_KEYS = {
  IR: 'agent.users.nationality.ir',
  FOREIGN: 'agent.users.nationality.foreign',
} as const satisfies Record<
  NationalityType,
  `agent.users.nationality.${string}`
>

type NationalityTranslationKey =
  (typeof NATIONALITY_TYPE_TRANSLATION_KEYS)[NationalityType]

export function getNationalityTypeOptions(
  t: (key: NationalityTranslationKey) => string
) {
  return nationalityTypeSchema.options.map((value) => ({
    label: t(NATIONALITY_TYPE_TRANSLATION_KEYS[value]),
    value,
  }))
}
