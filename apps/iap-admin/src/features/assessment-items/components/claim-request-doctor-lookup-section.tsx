import { type KeyboardEventHandler, useCallback, useState } from 'react'

import ClaimRequestDoctorLookupCard from '@features/assessment-items/components/claim-request-doctor-lookup-card.tsx'
import { getApiClient } from '@iap/api-client'
import {
  doctorLookupResponseSchema,
  externalDoctorLookupRequestSchema,
} from '@iap/api-types'
import { Button } from '@iap/ui'
import { Input } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { toast } from 'sonner'

export interface ExternalDoctor {
  doctorName?: string | null
  doctorFamilyName?: string | null
  major?: string | null
  city?: string | null
  membership?: string | null
  [key: string]: unknown
}

const isExternalDoctor = (data: unknown): data is ExternalDoctor => {
  return typeof data === 'object' && data !== null && !Array.isArray(data)
}

const hasDoctorLookupPayload = (data: unknown) => {
  if (data === null || data === undefined) {
    return false
  }

  if (typeof data === 'string') {
    return data.trim().length > 0
  }

  if (Array.isArray(data)) {
    return data.length > 0
  }

  if (typeof data === 'object') {
    return Object.keys(data as Record<string, unknown>).length > 0
  }

  return true
}

export function ClaimRequestDoctorLookupSection() {
  const { t, i18n } = useTranslate()

  const [medicalNumberId, setMedicalNumberId] = useState('')
  const [isDoctorLookupPending, setDoctorLookupPending] = useState(false)
  const [doctorLookupResult, setDoctorLookupResult] = useState<unknown>(null)
  const [doctorLookupError, setDoctorLookupError] = useState<string | null>(
    null
  )
  const [doctorLookupAttempted, setDoctorLookupAttempted] = useState(false)

  const handleDoctorLookup = useCallback(async () => {
    const trimmedMedicalNumber = medicalNumberId.trim()

    if (!trimmedMedicalNumber) {
      toast.error(t('claimRequests.messages.medicalNumberRequired'))
      return
    }

    setDoctorLookupAttempted(true)
    setDoctorLookupPending(true)
    setDoctorLookupError(null)
    setDoctorLookupResult(null)

    try {
      const { data } = await getApiClient().get('/external-doctors', {
        params: externalDoctorLookupRequestSchema.parse({
          medicalNumberId: trimmedMedicalNumber,
        }),
      })

      setDoctorLookupResult(doctorLookupResponseSchema.parse(data))
    } catch {
      const errorMessage = t('claimRequests.messages.doctorLookupFailed')
      setDoctorLookupError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setDoctorLookupPending(false)
    }
  }, [medicalNumberId, t])

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    async (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        await handleDoctorLookup()
      }
    },
    [handleDoctorLookup]
  )

  const renderDoctorLookupResult = () => {
    if (isDoctorLookupPending) {
      return (
        <span className='text-muted-foreground'>{t('common.loading')}</span>
      )
    }

    if (doctorLookupError) {
      return <p className='text-destructive'>{doctorLookupError}</p>
    }

    if (!hasDoctorLookupPayload(doctorLookupResult)) {
      return (
        <span className='block text-muted-foreground'>
          {t('claimRequests.doctorLookup.noData')}
        </span>
      )
    }

    if (isExternalDoctor(doctorLookupResult)) {
      return (
        <ClaimRequestDoctorLookupCard
          doctor={doctorLookupResult}
          labels={{
            title: t('claimRequests.doctorLookup.title'),
            doctorName: t('claimRequests.doctorLookup.fields.doctorName'),
            doctorFamilyName: t(
              'claimRequests.doctorLookup.fields.doctorFamilyName'
            ),
            major: t('claimRequests.doctorLookup.fields.major'),
            city: t('claimRequests.doctorLookup.fields.city'),
            membership: t('claimRequests.doctorLookup.fields.membership'),
            noData: t('claimRequests.doctorLookup.noData'),
          }}
          fallback={t('claimRequests.doctorLookup.emptyField')}
        />
      )
    }

    if (
      typeof doctorLookupResult === 'string' ||
      typeof doctorLookupResult === 'number' ||
      typeof doctorLookupResult === 'boolean'
    ) {
      return (
        <p className='text-sm' dir='ltr'>
          {String(doctorLookupResult)}
        </p>
      )
    }

    return (
      <pre
        className='wrap-break-word whitespace-pre-wrap font-mono text-xs'
        dir='ltr'
      >
        {JSON.stringify(doctorLookupResult, null, 2)}
      </pre>
    )
  }

  return (
    <div>
      <div className='flex flex-row-reverse items-center gap-2'>
        <Button
          presentation='reference'
          type='button'
          variant='secondary'
          onClick={handleDoctorLookup}
          disabled={isDoctorLookupPending || !medicalNumberId}
        >
          {isDoctorLookupPending
            ? t('common.loading')
            : t('claimRequests.doctorLookup.button')}
        </Button>
        <Input
          value={medicalNumberId}
          onChange={(event) => setMedicalNumberId(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t('claimRequests.doctorLookup.inputPlaceholder')}
          disabled={isDoctorLookupPending}
          inputMode='numeric'
          className='text-right'
        />
      </div>
      {doctorLookupAttempted && (
        <div className='p-4 text-sm' dir={i18n.dir()}>
          {renderDoctorLookupResult()}
        </div>
      )}
    </div>
  )
}
