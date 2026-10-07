import { useMemo } from 'react'

import type { ClaimRequest } from '@iap/api-types'
import { Separator } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { formatDateTime } from '@shared/lib/format-date'

type AssignmentHistoryItem = NonNullable<
  ClaimRequest['assignmentHistory']
>[number]

interface ClaimRequestDoctorResponsesProps {
  assignmentHistory?: ClaimRequest['assignmentHistory']
}

const DOCTOR_USER_ROLE = 'DOCTOR_USER'

function getDoctorName(item: AssignmentHistoryItem) {
  return item.assignedByDisplayName ?? item.assignedByUsername
}

function ClaimRequestDoctorResponses(props: ClaimRequestDoctorResponsesProps) {
  const { assignmentHistory } = props
  const { t } = useTranslation()

  const doctorResponses = useMemo(
    () =>
      (assignmentHistory ?? []).filter(
        (item) => item?.role === DOCTOR_USER_ROLE && item.description?.trim()
      ),
    [assignmentHistory]
  )

  if (!doctorResponses.length) {
    return null
  }

  return (
    <>
      <div className='mb-3 mt-4 text-base font-medium text-primary'>
        {t('claimRequests.doctorResponses.title')}
      </div>
      <div className='space-y-3'>
        {doctorResponses.map((response, index) => {
          const doctorName = getDoctorName(response)

          return (
            <div
              className='mb-2 border-r-2 border-border ps-3 last:mb-0'
              key={`${response.assignedUserId ?? doctorName ?? index}-${response.assignedAt ?? index}`}
            >
              <div className='flex justify-between'>
                <p className='text-sm'>
                  {doctorName
                    ? doctorName
                    : t('claimRequests.doctorResponses.response')}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {t('claimRequests.doctorResponses.assignedAt', {
                    date: formatDateTime(response.assignedAt),
                  })}
                </p>
              </div>
              <p className='mt-2 whitespace-pre-wrap text-sm text-foreground'>
                {response.description}
              </p>
            </div>
          )
        })}
      </div>
      <Separator className='my-4' />
    </>
  )
}

export default ClaimRequestDoctorResponses
