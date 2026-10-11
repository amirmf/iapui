import { MyClaimRequestObjectionForm } from '@features/my-claims/pages/detail/components/my-claim-request-objection-form'
import ObjectionChat from '@features/my-claims/pages/detail/components/objection-chat'
import { useMyClaimRequestQuery } from '@features/my-claims/queries/my-claim-request-query'
import { SupportFeatureButton } from '@iap/support'
import { useTranslation } from 'react-i18next'

function MyClaimRequestDetailIResult() {
  const { t } = useTranslation()
  const { data: claimData } = useMyClaimRequestQuery()

  const completeDocCondition =
    claimData?.status === 'IN_ASSESSMENT' && !claimData?.assignedUserUsername
  const canSubmitObjection =
    Boolean(claimData?.id) &&
    (claimData?.status === 'RETURN' || completeDocCondition)

  const canShowAssessmentResultSupport =
    claimData?.status === 'RETURN' || claimData?.status === 'REJECTED'

  const objections = claimData?.objections?.slice().sort((a, b) => {
    const dateA = new Date(a.createdAt || '').getTime()
    const dateB = new Date(b.createdAt || '').getTime()
    return dateA - dateB
  })

  const resultReasons = claimData?.resultReasons?.join(', ')

  return (
    <div className='space-y-3 text-sm'>
      {!!resultReasons || !!objections?.length ? (
        <>
          <div className='font-medium text-text-primary'>
            {t('myiap.claimRequest.detail.rejectionReasons')}
          </div>
          {!!resultReasons && (
            <div className='rounded-md border bg-gray-50 p-2 text-sm text-text-primary'>
              {resultReasons}
            </div>
          )}
          {!!objections?.length && <ObjectionChat objections={objections} />}
        </>
      ) : null}

      {canShowAssessmentResultSupport ? (
        <div className='flex justify-end'>
          <SupportFeatureButton
            variant='secondary'
            featureKey='assessment-result'
          />
        </div>
      ) : null}

      {canSubmitObjection ? (
        <MyClaimRequestObjectionForm isCompleteDoc={completeDocCondition} />
      ) : null}
    </div>
  )
}

export default MyClaimRequestDetailIResult
