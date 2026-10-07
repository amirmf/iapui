import { useMemo } from 'react'

import { type ExternalDoctor } from '@features/assessment-items/components/claim-request-doctor-lookup-section.tsx'
import ClaimRequestReadonlyItems from '@features/assessment-items/components/claim-request-readonly-items.tsx'

interface ClaimRequestDoctorLookupCardProps {
  doctor: ExternalDoctor
  labels: Record<string, string>
  fallback: string
}

const formatDoctorLookupValue = (value: unknown, fallback: string) => {
  if (value === null || value === undefined) {
    return fallback
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : fallback
  }

  return String(value)
}

function ClaimRequestDoctorLookupCard(
  props: ClaimRequestDoctorLookupCardProps
) {
  const { doctor, labels, fallback } = props

  const fields = useMemo(
    () => [
      {
        key: 'doctorName' as const,
        label: labels.doctorName,
        value: doctor.doctorName,
      },
      {
        key: 'doctorFamilyName' as const,
        label: labels.doctorFamilyName,
        value: doctor.doctorFamilyName,
      },
      { key: 'major' as const, label: labels.major, value: doctor.major },
      { key: 'city' as const, label: labels.city, value: doctor.city },
      {
        key: 'membership' as const,
        label: labels.membership,
        value: doctor.membership,
      },
    ],
    [doctor, labels]
  )

  const hasAnyValue = useMemo(
    () =>
      fields.some((field) =>
        typeof field.value === 'string'
          ? field.value.trim().length > 0
          : Boolean(field.value)
      ),
    [fields]
  )

  return (
    <div className='space-y-4'>
      <div>
        <p className='text-base font-semibold'>{labels.title}</p>
      </div>
      <div className='grid md:grid-cols-2'>
        {fields.map((field) => {
          return (
            <ClaimRequestReadonlyItems
              title={field.label}
              value={formatDoctorLookupValue(field.value, fallback)}
            />
          )
        })}
      </div>
      {!hasAnyValue && (
        <p className='text-sm text-muted-foreground'>{labels.noData}</p>
      )}
    </div>
  )
}

export default ClaimRequestDoctorLookupCard
