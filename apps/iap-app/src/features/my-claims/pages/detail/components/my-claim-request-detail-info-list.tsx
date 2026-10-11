import { useMemo } from 'react'

import {
  CLAIM_REQUEST_STATUS_TRANSLATION_KEYS_MY_IAP,
  MY_IAP_SENT_TO_BANK_FILTER_VALUE,
  claimStatusColors,
} from '@features/my-claims/constants/claim-status-constant'
import MyClaimRequestReadonlyItems from '@features/my-claims/pages/detail/components/my-claim-request-readonly-items'
import { useMyClaimRequestQuery as useGetMyClaimRequestById } from '@features/my-claims/queries/my-claim-request-query'
import { getClaimRequestDisplayStatus } from '@features/my-claims/utils/claim-request-display-status'
import { myIapFindTimeStamp } from '@features/my-claims/utils/utils'
import { Badge, cn, formatDate, formatDateTime } from '@iap/ui'
import { useTranslation } from 'react-i18next'

// Utility function to provide default display values
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

// Format amount with proper locale
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

function MyClaimRequestDetailInfoList() {
  const { t, i18n } = useTranslation()
  const dateOptions = {
    language: i18n.language,
    normalizeTimezone: false,
    invalidDate: 'throw',
  } as const
  const { data: claimData } = useGetMyClaimRequestById()

  // Calculate status label and badge className
  const status = claimData?.status
  const isSentToBank =
    claimData &&
    getClaimRequestDisplayStatus(claimData) === MY_IAP_SENT_TO_BANK_FILTER_VALUE

  let statusLabel = t('common.notAvailable')
  let statusBadgeClassName: string | undefined

  if (isSentToBank) {
    statusLabel = t('claimRequests.status.sentToBank')
    statusBadgeClassName = claimStatusColors.PAID
  } else if (status) {
    const translationKey = CLAIM_REQUEST_STATUS_TRANSLATION_KEYS_MY_IAP[status]
    statusLabel = translationKey ? t(translationKey) : status
    statusBadgeClassName = claimStatusColors[status]
  }

  // Format submit date
  const formattedSubmitDate = useMemo(() => {
    const formatted = formatDate(claimData?.submitDate ?? null, 'PP', {
      language: i18n.language,
      normalizeTimezone: false,
      invalidDate: 'throw',
    })
    return formatted === '-' ? t('common.notAvailable') : formatted
  }, [claimData?.submitDate, i18n.language, t])

  // Calculate docType
  const docType = claimData?.docType
    ? claimData.docType.docType
    : claimData?.documents?.map((item) => item.documentType).join(',')

  // Format createdAt for display
  const formattedCreatedAt = (() => {
    if (!claimData?.createdAt) {
      return null
    }

    const formatted = formatDateTime(
      claimData.createdAt,
      undefined,
      dateOptions
    )
    return formatted === '-' ? claimData.createdAt : formatted
  })()

  // Get formatted display values
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
  const formattedTotalSumAmount = formatAmount(claimData?.totalSumAmount)

  // Main person data
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

  const statusTimeStamps = myIapFindTimeStamp(claimData?.statusHistory)

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
      {/* Beneficiary Information */}
      <MyClaimRequestReadonlyItems
        title={t('myiap.claimRequest.detail.beneficiary')}
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

      {/* Amount */}
      <MyClaimRequestReadonlyItems
        title={t('myiap.claimRequest.detail.amount')}
        value={formattedAmount}
        classNameValue='text-red-700'
      />
      <MyClaimRequestReadonlyItems
        title={t('myiap.claimRequest.detail.totalSumAmount')}
        value={formattedTotalSumAmount}
        classNameValue='text-green-700'
      />

      {/* Status */}
      <MyClaimRequestReadonlyItems
        title={t('myiap.claimRequest.detail.status')}
        value={
          <Badge variant='outline' className={cn('mt-1', statusBadgeClassName)}>
            {statusLabel}
          </Badge>
        }
      />

      {/* Sub Insured Person (Main Person) */}
      <MyClaimRequestReadonlyItems
        title={t('myiap.claimRequest.detail.subInsuredPerson')}
        value={
          <p className='whitespace-pre-wrap px-1 text-sm text-text-primary'>
            <span className='font-semibold'>{displayMainPerson}</span>
            <span className='text-xs'> ({displayMainNationalCode}) </span>
            <span className='text-xs'>{displayMainAge}</span>
          </p>
        }
      />

      {/* Mobile Number */}
      <MyClaimRequestReadonlyItems
        title={t('myiap.claimRequest.detail.mobileNumber')}
        value={displayMobileNumber}
      />

      {/* Submit Date */}
      <MyClaimRequestReadonlyItems
        title={t('myiap.claimRequest.detail.submitDate')}
        value={formattedSubmitDate}
      />

      {/* Created At */}
      {formattedCreatedAt && (
        <MyClaimRequestReadonlyItems
          title={t('myiap.claimRequest.detail.createdAt')}
          value={formattedCreatedAt}
        />
      )}

      {/* Assessed At */}
      {statusTimeStamps.statusApproved && (
        <MyClaimRequestReadonlyItems
          title={t('myiap.claimRequest.detail.assessedAt')}
          value={formatDateTime(
            statusTimeStamps.statusApproved,
            undefined,
            dateOptions
          )}
        />
      )}

      {/* Terminal status date */}
      {statusTimeStamps.statusReturn && (
        <MyClaimRequestReadonlyItems
          title={t(`myiap.claimRequest.detail.returnedAt`)}
          value={formatDateTime(
            statusTimeStamps.statusReturn,
            undefined,
            dateOptions
          )}
        />
      )}

      {statusTimeStamps.statusPaid && (
        <MyClaimRequestReadonlyItems
          title={t('myiap.claimRequest.detail.paidAt')}
          value={formatDateTime(
            statusTimeStamps.statusPaid,
            undefined,
            dateOptions
          )}
        />
      )}

      {claimData?.extPaymentDate && (
        <MyClaimRequestReadonlyItems
          title={t('myiap.claimRequest.detail.extPaymentDate')}
          value={claimData.extPaymentDate}
        />
      )}

      {/* Policy Number */}
      <MyClaimRequestReadonlyItems
        title={t('myiap.claimRequest.detail.policyNumber')}
        value={displayPolicyId}
      />

      {/* Document Type */}
      {docType && (
        <MyClaimRequestReadonlyItems
          title={t('myiap.claimRequest.detail.docType')}
          value={docType}
        />
      )}

      {/* Business Key */}
      <MyClaimRequestReadonlyItems
        title={t('myiap.claimRequest.detail.businessKey')}
        value={displayBusinessKey}
      />
    </div>
  )
}

export default MyClaimRequestDetailInfoList
