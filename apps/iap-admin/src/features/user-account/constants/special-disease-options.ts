import type { PersonSpecialDiseasesEnum } from '@iap/api-types'
import type { TFunction } from 'i18next'

export const specialDiseaseColors: Record<PersonSpecialDiseasesEnum, string> = {
  LEVEL_ONE: 'bg-blue-300/30 text-blue-900 dark:text-blue-200 border-blue-400',
  LEVEL_TWO:
    'bg-indigo-300/30 text-indigo-900 dark:text-indigo-200 border-indigo-400',
  SACRIFICE: 'bg-rose-300/30 text-rose-900 dark:text-rose-200 border-rose-400',
  SPECIAL_DISEASES:
    'bg-amber-300/30 text-amber-900 dark:text-amber-200 border-amber-400',
  VIP: 'bg-violet-300/30 text-violet-900 dark:text-violet-200 border-violet-400',
}

export const specialDiseaseTranslationKeys: Record<
  PersonSpecialDiseasesEnum,
  `personSpecialDiseases.options.${string}`
> = {
  LEVEL_ONE: 'personSpecialDiseases.options.levelOne',
  LEVEL_TWO: 'personSpecialDiseases.options.levelTwo',
  SACRIFICE: 'personSpecialDiseases.options.sacrifice',
  SPECIAL_DISEASES: 'personSpecialDiseases.options.specialDiseases',
  VIP: 'personSpecialDiseases.options.vip',
}

export function getSpecialDiseaseOptions(t: TFunction) {
  return Object.entries(specialDiseaseTranslationKeys).map(
    ([value, label]) => ({
      label: t(label as never),
      value: value as PersonSpecialDiseasesEnum,
    })
  )
}
