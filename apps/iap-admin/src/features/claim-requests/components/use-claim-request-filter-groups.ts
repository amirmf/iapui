import { useMemo } from 'react'

import {
  CLAIM_REQUEST_IBAN_STATUS_TRANSLATION_KEYS,
  getClaimRequestAiStatusOptions,
  getClaimRequestRequestTypeOptions,
  getClaimRequestStatusOptions,
} from '@features/claim-requests/model/claim-request-status'
import type { ClaimRequestQuickStatus } from '@features/claim-requests/route-adapters/claim-request-filters'
import { useAuthSession } from '@iap/auth'
import { useDocTypesData } from '@modules/doc-types'
import { getAuthUserSpecialDiseaseOptions } from '@modules/person-special-diseases'
import {
  type TableFilterBaseProps,
  type TableFilterGroup,
} from '@shared/tables'
import { useTranslation } from 'react-i18next'

type ClaimRequestToolbarProps = {
  quickStatus: ClaimRequestQuickStatus
}

const filterInputClassName = 'w-full'
const filterWrapperClassName = 'w-full'
const facetedFilterClassName = 'w-full'

const textFilterConfigs = [
  { id: 'extNationalCode', numerical: true },
  { id: 'extMainNationalCode', numerical: true },
  { id: 'extDisplayName', asLike: true },
  { id: 'extMainDisplayName', asLike: true },
  { id: 'extCustomerName', asLike: true },
  { id: 'extPlanCaption', asLike: true },
  { id: 'businessKey', numerical: true },
  { id: 'extPolicyId', numerical: true },
  { id: 'extContractId', numerical: true },
  { id: 'extWorkUnitName', asLike: true },
  { id: 'extWorkUnitCode', numerical: true },
  { id: 'extWorkUnitCityName' },
  { id: 'extWorkUnitProvinceName' },
  { id: 'latestAssignementDisplayName', asLike: true },
  { id: 'latestAssignementUsername', numerical: true },
  { id: 'mainAssignedUserUsername', numerical: true },
  { id: 'mainAssignedUserDisplayName', asLike: true },
  { id: 'registeredByAgentUsername', numerical: true },
  { id: 'registeredByAgentDisplayName', asLike: true },
  { id: 'outpatientDocAcceptanceExtId', numerical: true },
  { id: 'seenBy', asLike: true },
] as const

const docTypeFilterRoles = new Set([
  'ROLE_MAIN_ASSESSMENT_USER',
  'ROLE_ADMIN_USER',
  'ROLE_SUPER_ADMIN',
  'ROLE_SUPER_ADMIN_USER',
  'ROLE_MONITORING_USER',
  'ROLE_DOCTOR_USER',
  'ROLE_HQ_USER',
  'ROLE_BRANCH_USER',
])

export function useClaimRequestFilterGroups(props: ClaimRequestToolbarProps) {
  const { quickStatus } = props
  const { t } = useTranslation()
  const roles = useAuthSession().user?.roles ?? []
  const canSeeDocTypeFilter = roles.some((role) => docTypeFilterRoles.has(role))
  const { options } = useDocTypesData.options({ enabled: canSeeDocTypeFilter })

  const textFilters = useMemo<NonNullable<TableFilterBaseProps['textFilters']>>(
    () =>
      textFilterConfigs.map((config) => ({
        ...config,
        className: filterInputClassName,
        placeholder: t(`claimRequests.filters.${config.id}`),
        wrapperClassName: filterWrapperClassName,
      })),
    [t]
  )

  const numberRangeFilters = useMemo<
    NonNullable<TableFilterBaseProps['numberRangeFilters']>
  >(
    () => [
      {
        id: 'amount',
        fromPlaceholder: t('claimRequests.filters.amountFrom'),
        toPlaceholder: t('claimRequests.filters.amountTo'),
        className: filterInputClassName,
        wrapperClassName: filterWrapperClassName,
        numberWithComma: true,
      },
      {
        id: 'totalSumAmount',
        fromPlaceholder: t('claimRequests.filters.totalSumAmountFrom'),
        toPlaceholder: t('claimRequests.filters.totalSumAmountTo'),
        className: filterInputClassName,
        wrapperClassName: filterWrapperClassName,
        numberWithComma: true,
      },
      {
        id: 'corePaidAmount',
        fromPlaceholder: t('claimRequests.filters.corePaidAmountFrom'),
        toPlaceholder: t('claimRequests.filters.corePaidAmountTo'),
        className: filterInputClassName,
        wrapperClassName: filterWrapperClassName,
        numberWithComma: true,
      },
      {
        id: 'corePaidAmountPercent',
        fromPlaceholder: t('claimRequests.filters.corePaidAmountPercentFrom'),
        toPlaceholder: t('claimRequests.filters.corePaidAmountPercentTo'),
        className: filterInputClassName,
        wrapperClassName: filterWrapperClassName,
      },
    ],
    [t]
  )

  const dateRangeFilters = useMemo<
    NonNullable<TableFilterBaseProps['dateRangeFilters']>
  >(
    () => [
      {
        id: 'submitDate',
        fromPlaceholder: t('claimRequests.filters.submitDateFrom'),
        toPlaceholder: t('claimRequests.filters.submitDateTo'),
        className: filterInputClassName,
        wrapperClassName: filterWrapperClassName,
      },
    ],
    [t]
  )

  const dateTimeRangeFilters = useMemo<
    NonNullable<TableFilterBaseProps['dateTimeRangeFilters']>
  >(
    () => [
      {
        id: 'createdAt',
        fromPlaceholder: t('claimRequests.filters.createdAtFrom'),
        toPlaceholder: t('claimRequests.filters.createdAtTo'),
        className: filterInputClassName,
        wrapperClassName: filterWrapperClassName,
      },
      {
        id: 'assessedAt',
        fromPlaceholder: t('claimRequests.filters.assessedAtFrom'),
        toPlaceholder: t('claimRequests.filters.assessedAtTo'),
        className: filterInputClassName,
        wrapperClassName: filterWrapperClassName,
      },
    ],
    [t]
  )

  const facetedFilters = useMemo<
    NonNullable<TableFilterBaseProps['facetedFilters']>
  >(() => {
    const filters: NonNullable<
      TableFilterBaseProps['facetedFilters']
    >[number][] = [
      {
        id: 'docType.id',
        options,
        placeholder: t('claimRequests.columns.docType'),
        className: facetedFilterClassName,
      },
      {
        id: 'requestType',
        options: getClaimRequestRequestTypeOptions(t),
        placeholder: t('claimRequests.columns.requestType'),
        className: facetedFilterClassName,
      },
      {
        id: 'specialDiseases',
        options: getAuthUserSpecialDiseaseOptions(t),
        placeholder: t('personSpecialDiseases.fields.specialDiseases'),
        className: facetedFilterClassName,
      },
      {
        id: 'aiStatus',
        options: getClaimRequestAiStatusOptions(t),
        placeholder: t('claimRequests.columns.aiStatus'),
        className: facetedFilterClassName,
      },
      {
        id: 'isReturn',
        options: [
          { label: t('common.yes'), value: 'Y' },
          { label: t('common.no'), value: 'N' },
        ],
        placeholder: t('claimRequests.filters.isReturn'),
        className: facetedFilterClassName,
      },
      {
        id: 'ibanStatus',
        options: [
          {
            label: t(CLAIM_REQUEST_IBAN_STATUS_TRANSLATION_KEYS.Y),
            value: 'Y',
          },
          {
            label: t(CLAIM_REQUEST_IBAN_STATUS_TRANSLATION_KEYS.N),
            value: 'N',
          },
        ],
        placeholder: t('claimRequests.filters.ibanStatus'),
        className: facetedFilterClassName,
      },
    ]

    if (quickStatus === 'ALL') {
      filters.splice(1, 0, {
        id: 'status',
        options: getClaimRequestStatusOptions(t),
        placeholder: t('claimRequests.columns.status'),
        className: facetedFilterClassName,
      })
    }

    if (!canSeeDocTypeFilter) filters.splice(0, 1)
    return filters
  }, [canSeeDocTypeFilter, options, quickStatus, t])

  return useMemo<TableFilterGroup[]>(() => {
    const text = (id: string) => {
      const config = textFilters.find((filter) => filter.id === id)
      if (!config)
        throw new Error(`Missing claim request filter configuration: ${id}`)
      return { type: 'text' as const, config }
    }
    const facet = (id: string) => {
      const config = facetedFilters.find((filter) => filter.id === id)
      if (!config)
        throw new Error(`Missing claim request filter configuration: ${id}`)
      return { type: 'faceted' as const, config }
    }
    return [
      {
        id: 'request',
        title: t('claimRequests.filterGroups.request'),
        filters: [
          text('businessKey'),
          ...(canSeeDocTypeFilter ? [facet('docType.id')] : []),
          ...(quickStatus === 'ALL' ? [facet('status')] : []),
          facet('aiStatus'),
          facet('isReturn'),
          facet('requestType'),
          { type: 'dateTimeRange', config: dateTimeRangeFilters[0]! },
          { type: 'dateRange', config: dateRangeFilters[0]! },
        ],
      },
      {
        id: 'insured',
        title: t('claimRequests.filterGroups.insured'),
        filters: [
          text('extMainNationalCode'),
          text('extNationalCode'),
          text('extDisplayName'),
          text('extMainDisplayName'),
          text('extCustomerName'),
          text('extPlanCaption'),
          facet('specialDiseases'),
        ],
      },
      {
        id: 'organization',
        title: t('claimRequests.filterGroups.organization'),
        filters: [
          text('extContractId'),
          text('extPolicyId'),
          text('extWorkUnitName'),
          text('extWorkUnitCode'),
          text('extWorkUnitCityName'),
          text('extWorkUnitProvinceName'),
        ],
      },
      {
        id: 'financial',
        title: t('claimRequests.filterGroups.financial'),
        filters: [
          text('outpatientDocAcceptanceExtId'),
          ...numberRangeFilters.map((config) => ({
            type: 'numberRange' as const,
            config,
          })),
          text('seenBy'),
          facet('ibanStatus'),
        ],
      },
      {
        id: 'assessment',
        title: t('claimRequests.filterGroups.assessment'),
        filters: [
          text('latestAssignementDisplayName'),
          text('latestAssignementUsername'),
          { type: 'dateTimeRange', config: dateTimeRangeFilters[1]! },
          text('mainAssignedUserDisplayName'),
          text('mainAssignedUserUsername'),
          text('registeredByAgentDisplayName'),
          text('registeredByAgentUsername'),
        ],
      },
    ]
  }, [
    canSeeDocTypeFilter,
    dateRangeFilters,
    dateTimeRangeFilters,
    facetedFilters,
    numberRangeFilters,
    quickStatus,
    t,
    textFilters,
  ])
}
