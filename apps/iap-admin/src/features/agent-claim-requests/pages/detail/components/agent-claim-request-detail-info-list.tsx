import { useMemo } from 'react'

import {
  CLAIM_REQUEST_STATUS_TRANSLATION_KEYS,
  claimStatusColors,
} from '@features/agent-claim-requests/model/agent-claim-request-constant'
import MyClaimRequestReadonlyItems from '@features/agent-claim-requests/pages/detail/components/my-claim-request-readonly-items'
import useGetAgentClaimRequestById from '@features/agent-claim-requests/pages/detail/queries/use-get-agent-claim-request-by-id'
import { Badge, cn, formatDate, formatDateTime } from '@iap/ui'
import { useTranslation } from 'react-i18next'

const defaultDisplayValue = (
  value: unknown,
  notAvailable: string = '-'
): string => {
  if (value === null || value === undefined) return notAvailable
  if (Array.isArray(value))
    return value.length ? value.join(', ') : notAvailable
  const stringValue = String(value).trim()
  return stringValue ? stringValue : notAvailable
}

const formatAmount = (
  value: unknown,
  notAvailable: string = '-',
  locale = 'en-US'
) => {
  if (typeof value === 'number') {
    return value.toLocaleString(locale)
  }
  return defaultDisplayValue(value, notAvailable)
}

function AgentClaimRequestDetailInfoList() {
  const { t, i18n } = useTranslation()
  const { data: claimData } = useGetAgentClaimRequestById()

  const status = claimData?.status

  let statusLabel = t('common.notAvailable')
  let statusBadgeClassName: string | undefined

  if (status) {
    const translationKey = CLAIM_REQUEST_STATUS_TRANSLATION_KEYS[status]
    statusLabel = translationKey ? t(translationKey) : status
    statusBadgeClassName = claimStatusColors[status]
  }

  const formattedSubmitDate = useMemo(() => {
    const formatted = formatDate(claimData?.submitDate ?? null, 'PP', {
      language: i18n.language,
      normalizeTimezone: false,
      invalidDate: 'throw',
    })
    return formatted === '-' ? t('common.notAvailable') : formatted
  }, [claimData?.submitDate, i18n.language, t])

  const docType = claimData?.docType
    ? claimData.docType.docType
    : claimData?.documents?.map((item) => item.documentType).join(',')

  const formattedCreatedAt = (() => {
    if (!claimData?.createdAt) {
      return null
    }

    const formatted = formatDateTime(claimData.createdAt, 'PPpp', {
      language: i18n.language,
      normalizeTimezone: false,
      invalidDate: 'throw',
    })
    return formatted === '-' ? claimData.createdAt : formatted
  })()

  const notAvailable = t('common.notAvailable')

  const displayBeneficiaryName = defaultDisplayValue(
    claimData?.extDisplayName,
    notAvailable
  )
  const displayNationalCode = defaultDisplayValue(
    claimData?.extNationalCode,
    notAvailable
  )
  const displayAge = defaultDisplayValue(claimData?.extAge, notAvailable)
  const displayRelation = defaultDisplayValue(
    claimData?.extRelationTitle,
    notAvailable
  )
  const displayMobileNumber = defaultDisplayValue(
    claimData?.extMobileNumber,
    notAvailable
  )
  const displayPolicyId = defaultDisplayValue(
    claimData?.extPolicyId,
    notAvailable
  )
  const formattedAmount = formatAmount(claimData?.amount, notAvailable)

  const displayMainPerson = defaultDisplayValue(
    claimData?.extMainDisplayName,
    notAvailable
  )
  const displayMainNationalCode = defaultDisplayValue(
    claimData?.extMainNationalCode,
    notAvailable
  )
  const displayMainAge = defaultDisplayValue(
    claimData?.extMainAge,
    notAvailable
  )
  const displayBusinessKey = defaultDisplayValue(
    claimData?.businessKey,
    notAvailable
  )

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
      <MyClaimRequestReadonlyItems
        title={t('agent.claimRequests.detail.beneficiary')}
        value={
          <p className='whitespace-pre-wrap px-1 text-sm text-text-primary'>
            <span className='font-semibold'>{displayBeneficiaryName}</span>
            <span className='text-xs'> ({displayNationalCode}) </span>
            <span className='text-xs'>{displayAge}</span>
            {displayRelation !== notAvailable && (
              <span className='text-xs'> - {displayRelation}</span>
            )}
          </p>
        }
      />

      <MyClaimRequestReadonlyItems
        title={t('agent.claimRequests.detail.amount')}
        value={formattedAmount}
      />

      <MyClaimRequestReadonlyItems
        title={t('agent.claimRequests.detail.status')}
        value={
          <Badge variant='outline' className={cn('mt-1', statusBadgeClassName)}>
            {statusLabel}
          </Badge>
        }
      />

      <MyClaimRequestReadonlyItems
        title={t('agent.claimRequests.detail.subInsuredPerson')}
        value={
          <p className='whitespace-pre-wrap px-1 text-sm text-text-primary'>
            <span className='font-semibold'>{displayMainPerson}</span>
            <span className='text-xs'> ({displayMainNationalCode}) </span>
            <span className='text-xs'>{displayMainAge}</span>
          </p>
        }
      />

      <MyClaimRequestReadonlyItems
        title={t('agent.claimRequests.detail.mobileNumber')}
        value={displayMobileNumber}
      />

      <MyClaimRequestReadonlyItems
        title={t('agent.claimRequests.detail.submitDate')}
        value={formattedSubmitDate}
      />

      {formattedCreatedAt && (
        <MyClaimRequestReadonlyItems
          title={t('agent.claimRequests.detail.createdAt')}
          value={formattedCreatedAt}
        />
      )}

      <MyClaimRequestReadonlyItems
        title={t('agent.claimRequests.detail.policyNumber')}
        value={displayPolicyId}
      />

      {docType && (
        <MyClaimRequestReadonlyItems
          title={t('agent.claimRequests.detail.docType')}
          value={docType}
        />
      )}

      <MyClaimRequestReadonlyItems
        title={t('agent.claimRequests.detail.businessKey')}
        value={displayBusinessKey}
      />
    </div>
  )
}

export default AgentClaimRequestDetailInfoList
