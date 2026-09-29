import { useMemo } from 'react'

import { useAuthSession } from '@iap/auth'
import {
  type TableFilterBaseProps,
  TableFilterQueryParams,
} from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  claimRequestAiStatusTranslationKeys,
  claimRequestStatusTranslationKeys,
} from '../constants/claim-request-status'
import type { ClaimRequestQuickStatus } from '../model/claim-request-filters'
import { docTypeOptionsService } from '../services/doc-type-options-service'

type ClaimRequestToolbarProps = {
  quickStatus: ClaimRequestQuickStatus
}

const filterInputClassName = 'lg:w-full'
const filterWrapperClassName = 'w-full sm:w-1/4 xl:w-1/5 px-1'
const facetedFilterClassName = 'mx-1'

const textFilterConfigs = [
  { id: 'extNationalCode', numerical: true },
  { id: 'extMainNationalCode', numerical: true },
  { id: 'extDisplayName', asLike: true },
  { id: 'extCustomerName', asLike: true },
  { id: 'extPlanCaption', asLike: true },
  { id: 'businessKey', numerical: true },
  { id: 'extPolicyId', numerical: true },
  { id: 'extContractId', numerical: true },
  { id: 'extCustomerCompanyCode', asLike: true },
  { id: 'extCustomerNationalCode', numerical: true },
  { id: 'extCustomerCityName', asLike: true },
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

export function ClaimRequestToolbar(props: ClaimRequestToolbarProps) {
  const { quickStatus } = props
  const { t } = useTranslation()
  const roles = useAuthSession().user?.roles ?? []
  const canSeeDocTypeFilter = roles.some((role) => docTypeFilterRoles.has(role))
  const { data: docTypes } = useQuery({
    enabled: canSeeDocTypeFilter,
    gcTime: Infinity,
    queryFn: ({ signal }) => docTypeOptionsService.findPage(signal),
    queryKey: ['doc-types', 'page', 0, 100],
    staleTime: Infinity,
  })

  const textFilters = useMemo<TableFilterBaseProps['textFilters']>(
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
    TableFilterBaseProps['numberRangeFilters']
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

  const dateRangeFilters = useMemo<TableFilterBaseProps['dateRangeFilters']>(
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
    TableFilterBaseProps['dateTimeRangeFilters']
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

  const facetedFilters = useMemo<TableFilterBaseProps['facetedFilters']>(() => {
    const filters: NonNullable<
      TableFilterBaseProps['facetedFilters']
    >[number][] = [
      {
        id: 'docType.id',
        options:
          docTypes?.content.flatMap((docType) =>
            docType.id && docType.docType
              ? [{ label: docType.docType, value: docType.id }]
              : []
          ) ?? [],
        placeholder: t('claimRequests.columns.docType'),
        className: facetedFilterClassName,
      },
      {
        id: 'requestType',
        options: [
          { label: t('claimRequests.requestType.main'), value: 'MAIN' },
          {
            label: t('claimRequests.requestType.adjustment'),
            value: 'ADJUSTMENT',
          },
        ],
        placeholder: t('claimRequests.columns.requestType'),
        className: facetedFilterClassName,
      },
      {
        id: 'aiStatus',
        options: Object.entries(claimRequestAiStatusTranslationKeys).map(
          ([value, translationKey]) => ({
            label: t(translationKey),
            value,
          })
        ),
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
          { label: t('claimRequests.ibanStatusValues.has'), value: 'Y' },
          {
            label: t('claimRequests.ibanStatusValues.doesNotHave'),
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
        options: Object.entries(claimRequestStatusTranslationKeys).map(
          ([value, translationKey]) => ({
            label: t(translationKey),
            value,
          })
        ),
        placeholder: t('claimRequests.columns.status'),
        className: facetedFilterClassName,
      })
    }

    if (!canSeeDocTypeFilter) filters.splice(0, 1)
    return filters
  }, [canSeeDocTypeFilter, docTypes, quickStatus, t])

  return (
    <TableFilterQueryParams
      dateRangeFilters={dateRangeFilters}
      dateTimeRangeFilters={dateTimeRangeFilters}
      facetedFilters={facetedFilters}
      ignoreQueryParams={['quickStatus', 'features']}
      numberRangeFilters={numberRangeFilters}
      showReset
      textFilters={textFilters}
    />
  )
}
