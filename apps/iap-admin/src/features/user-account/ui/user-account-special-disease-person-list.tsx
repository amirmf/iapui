import {
  specialDiseaseColors,
  specialDiseaseTranslationKeys,
} from '@features/user-account/constants/special-disease-options'
import type { InsuredPerson } from '@iap/api-types'
import { Badge, Button } from '@iap/ui'
import { personSpecialDiseaseService } from '@modules/person-special-diseases'
import { useTranslate } from '@shared/i18n/i18n'
import { useQuery } from '@tanstack/react-query'

type Props = {
  onSelect: (person: InsuredPerson) => void
  persons: InsuredPerson[]
}

export function UserAccountSpecialDiseasePersonList({
  onSelect,
  persons,
}: Props) {
  return (
    <ul className='space-y-2'>
      {persons.map((person) => (
        <PersonCard
          key={person.id ?? person.nationalCode}
          onSelect={onSelect}
          person={person}
        />
      ))}
    </ul>
  )
}

function PersonCard(props: {
  onSelect: (person: InsuredPerson) => void
  person: InsuredPerson
}) {
  const { onSelect, person } = props
  const { t } = useTranslate()
  const diseaseQuery = useQuery({
    enabled: Boolean(person.nationalCode),
    queryFn: ({ signal }) =>
      personSpecialDiseaseService.getByNationalCode(
        person.nationalCode!,
        signal
      ),
    queryKey: ['person-special-disease', person.nationalCode],
  })
  const personName =
    [person.name, person.lastName].filter(Boolean).join(' ') || '-'

  if (diseaseQuery.isLoading)
    return (
      <p className='text-sm text-muted-foreground'>{t('common.loading')}</p>
    )

  return (
    <li>
      <Button
        className='h-auto w-full justify-start text-start'
        onClick={() => onSelect(person)}
        type='button'
        variant='outline'
      >
        <div className='flex w-full justify-between gap-2 py-1'>
          <div className='flex gap-1'>
            <span className='font-medium'>{personName}</span>
            <span className='text-xs text-muted-foreground'>
              {person.nationalCode ?? '-'}
            </span>
          </div>
          <div className='flex flex-wrap justify-end gap-1'>
            {diseaseQuery.data?.specialDiseases?.length ? (
              diseaseQuery.data.specialDiseases.map((disease) => (
                <Badge
                  className={specialDiseaseColors[disease]}
                  key={`${person.nationalCode}-${disease}`}
                  variant='outline'
                >
                  {t(specialDiseaseTranslationKeys[disease] as never)}
                </Badge>
              ))
            ) : (
              <span className='text-xs text-muted-foreground'>-</span>
            )}
          </div>
        </div>
      </Button>
    </li>
  )
}
