import { type ReactNode } from 'react'

import ClaimRequestInfoListCard from '@features/claim-requests/components/claim-request-info-list-card'
import { CLAIM_REQUEST_IBAN_STATUS_TRANSLATION_KEYS } from '@features/claim-requests/constants/claim-request-status'
import type { ClaimRequest, PersonSpecialDiseasesEnum } from '@iap/api-types'
import { Badge, cn, formatDate } from '@iap/ui'
import {
  SPECIAL_DISEASE_TRANSLATE_KEY,
  personSpecialDiseaseService,
  specialDiseaseColors,
} from '@modules/person-special-diseases'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

const defaultDisplayValue = (value: unknown): string => {
  if (value === null || value === undefined) return '-'
  if (Array.isArray(value)) return value.length ? value.join(', ') : '-'
  const stringValue = String(value)
  return stringValue.trim() ? stringValue : '-'
}

const formatAmount = (value: unknown) =>
  typeof value === 'number'
    ? value.toLocaleString('en-US')
    : defaultDisplayValue(value)

type ClaimRequestInfoListContentProps = {
  data?: ClaimRequest
  mobileNumberContent?: ReactNode
  trailingContent?: ReactNode
}

export function ClaimRequestInfoListContent(
  props: ClaimRequestInfoListContentProps
) {
  const { data, mobileNumberContent, trailingContent } = props
  const { t, i18n } = useTranslation()
  const nationalCode = data?.extNationalCode
  const personSpecialDiseaseQuery = useQuery({
    queryKey: ['person-special-disease', nationalCode],
    queryFn: ({ signal }) =>
      personSpecialDiseaseService.getByNationalCode(nationalCode!, signal),
    enabled: !!nationalCode,
    staleTime: 60000,
    gcTime: 60000,
    retry: 0,
  })
  const specialDiseases =
    personSpecialDiseaseQuery.data?.specialDiseases?.filter(
      (value): value is PersonSpecialDiseasesEnum =>
        value in SPECIAL_DISEASE_TRANSLATE_KEY
    ) ?? []
  const documentTypes = defaultDisplayValue(
    data?.docType?.docType ??
      data?.documents
        ?.map((document) => document?.documentType)
        .filter((value): value is string => Boolean(value?.trim()))
  )
  const ibanStatusTranslationKey =
    data?.ibanStatus === 'Y' || data?.ibanStatus === 'N'
      ? CLAIM_REQUEST_IBAN_STATUS_TRANSLATION_KEYS[data.ibanStatus]
      : null

  return (
    <div
      className={cn(
        'flex rounded-md border border-gray-400 px-1 py-0.5',
        !specialDiseases.length && 'bg-card',
        specialDiseases.length && 'bg-primary/10'
      )}
    >
      <div className='flex flex-1 flex-col'>
        <div className='flex flex-wrap items-center'>
          <ClaimRequestInfoListCard
            title={t('claimRequests.detail.beneficiary')}
            value={
              <ClaimPersonValue
                name={data?.extDisplayName}
                nationalCode={data?.extNationalCode}
                age={data?.extAge}
                relation={data?.extRelationTitle}
              />
            }
          />
          <ClaimRequestInfoListCard
            title={t('claimRequests.detail.subInsuredPerson')}
            value={
              <ClaimPersonValue
                name={data?.extMainDisplayName}
                nationalCode={data?.extMainNationalCode}
                age={data?.extMainAge}
              />
            }
          />
          <ClaimRequestInfoListCard
            title={t('claimRequests.detail.mobileNumber')}
            className='items-center'
            value={
              mobileNumberContent ?? defaultDisplayValue(data?.extMobileNumber)
            }
            hasSeprator={!!data?.isCheat}
          />
          {data?.isCheat === 'Y' ? (
            <Badge
              presentation='reference'
              className='mx-2 bg-red-600 text-white hover:bg-red-600'
            >
              {t('claimRequests.detail.hasCheatedBefore')}
            </Badge>
          ) : null}
        </div>
        <div className='flex flex-wrap items-center'>
          <ClaimRequestInfoListCard
            title={t('claimRequests.detail.amount')}
            value={formatAmount(data?.amount)}
            classNameValue='text-red-700'
          />
          <ClaimRequestInfoListCard
            title={t('claimRequests.detail.totalSumAmount')}
            value={formatAmount(data?.totalSumAmount)}
            classNameValue='text-green-700'
          />
          <ClaimRequestInfoListCard
            title={t('claimRequests.detail.submitDate')}
            value={formatDate(data?.submitDate, undefined, {
              language: i18n.language,
              normalizeTimezone: false,
              invalidDate: 'throw',
            })}
          />
          <ClaimRequestInfoListCard
            title={t('claimRequests.detail.createdAt')}
            value={formatDate(data?.createdAt, undefined, {
              language: i18n.language,
              normalizeTimezone: false,
              invalidDate: 'throw',
            })}
          />
          <ClaimRequestInfoListCard
            title={t('claimRequests.detail.outpatientDocAcceptanceExtId')}
            value={defaultDisplayValue(data?.outpatientDocAcceptanceExtId)}
          />
          <ClaimRequestInfoListCard
            title={t('claimRequests.detail.extPaymentDate')}
            value={data?.extPaymentDate}
          />
          <ClaimRequestInfoListCard
            title={t('claimRequests.detail.ibanStatus')}
            value={
              ibanStatusTranslationKey
                ? t(ibanStatusTranslationKey)
                : (data?.ibanStatus ?? '-')
            }
            hasSeprator={false}
          />
        </div>
        <div className='flex flex-wrap items-center'>
          <ClaimRequestInfoListCard
            title={t('claimRequests.detail.businessKey')}
            value={defaultDisplayValue(data?.businessKey)}
          />
          <ClaimRequestInfoListCard
            title={t('claimRequests.detail.documentTypes')}
            value={documentTypes}
          />
          <ClaimRequestInfoListCard
            title={t('claimRequests.detail.customerName')}
            value={`${defaultDisplayValue(data?.extCustomerName)} (${defaultDisplayValue(data?.extPlanCaption)})`}
          />
          <ClaimRequestInfoListCard
            title={t('claimRequests.detail.extPolicyId')}
            value={defaultDisplayValue(data?.extPolicyId)}
          />
          <ClaimRequestInfoListCard
            title={t('claimRequests.detail.specialDiseases')}
            value={
              specialDiseases.length ? (
                <div className='flex flex-wrap gap-1'>
                  {specialDiseases.map((disease) => (
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
              ) : (
                '-'
              )
            }
            hasSeprator={false}
          />
        </div>
      </div>
      {trailingContent}
    </div>
  )
}

type ClaimPersonValueProps = {
  name: unknown
  nationalCode: unknown
  age: unknown
  relation?: unknown
}

function ClaimPersonValue(props: ClaimPersonValueProps) {
  const { name, nationalCode, age, relation } = props
  const { t } = useTranslation()
  const displayRelation = defaultDisplayValue(relation)

  return (
    <p className='whitespace-pre-wrap text-sm text-text-primary'>
      <span className='font-semibold'>{defaultDisplayValue(name)}</span>
      <span className='text-xs'> ({defaultDisplayValue(nationalCode)}) </span>
      <span className='text-xs'>
        {t('claimRequests.detail.age', { age: defaultDisplayValue(age) })}
      </span>
      {displayRelation !== '-' ? (
        <span className='text-xs'> - {displayRelation}</span>
      ) : null}
    </p>
  )
}
