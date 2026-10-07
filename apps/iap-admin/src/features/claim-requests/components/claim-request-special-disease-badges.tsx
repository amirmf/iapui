import type { PersonSpecialDiseasesEnum } from '@iap/api-types'
import { Badge } from '@iap/ui'
import {
  SPECIAL_DISEASE_TRANSLATE_KEY,
  specialDiseaseColors,
} from '@modules/person-special-diseases'
import { useTranslation } from 'react-i18next'

export function ClaimRequestSpecialDiseaseBadges(props: {
  diseases?: PersonSpecialDiseasesEnum[] | null
}) {
  const { diseases } = props
  const { t } = useTranslation()
  if (!diseases?.length) return null
  return (
    <div className='flex flex-wrap gap-1'>
      {diseases.map((disease) => (
        <Badge
          presentation='reference'
          key={disease}
          variant='outline'
          className={specialDiseaseColors[disease]}
        >
          {t(SPECIAL_DISEASE_TRANSLATE_KEY[disease] as never)}
        </Badge>
      ))}
    </div>
  )
}
