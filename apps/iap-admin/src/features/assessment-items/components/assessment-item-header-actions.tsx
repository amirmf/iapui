import { useCallback } from 'react'

import { useAssessmentItemDialog } from '@features/assessment-items/context/store/assessment-item-dialog-store'
import { Permission } from '@iap/ui'
import { Button } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

interface AssessmentItemHeaderActionsProps {
  isLoading: boolean
  canViewPreAuths: boolean
  onRefresh: () => void
}

export function AssessmentItemHeaderActions(
  props: AssessmentItemHeaderActionsProps
) {
  const { isLoading, canViewPreAuths, onRefresh } = props
  const { setActiveDialog } = useAssessmentItemDialog()
  const { t } = useTranslate()

  const onDoctorLookup = useCallback(
    () => setActiveDialog('doctor-lookup'),
    [setActiveDialog]
  )
  const onViewPreAuths = useCallback(
    () => setActiveDialog('pre-auth-inquiries'),
    [setActiveDialog]
  )

  return (
    <div className='flex flex-wrap gap-2'>
      <Permission hasPermission={canViewPreAuths}>
        <Button
          presentation='reference'
          size='xs'
          variant='outline'
          onClick={onViewPreAuths}
          className='space-x-2 border-primary-400 bg-primary-50 hover:bg-primary-100'
          disabled={isLoading}
        >
          <span>{t('assessmentItems.preAuths.button')}</span>
        </Button>
      </Permission>
      <Button
        presentation='reference'
        size='xs'
        variant='outline'
        onClick={onDoctorLookup}
        className='space-x-2'
        disabled={isLoading}
      >
        <span>{t('claimRequests.doctorLookup.button')}</span>
      </Button>
      <Button
        presentation='reference'
        size='xs'
        variant='outline'
        onClick={onRefresh}
        className='space-x-2'
        disabled={isLoading}
      >
        <span>{t('claimRequests.refresh')}</span>
      </Button>
    </div>
  )
}
