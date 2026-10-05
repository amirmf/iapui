import { useMemo } from 'react'

import {
  TableFilters,
  toApiFilterValues,
  toTableFilterValues,
} from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import type { DashboardFilterValues } from '../model/report-filters'
import { dashboardService } from '../services/dashboard-service'

const textFilterIds = [
  'latestAssignementDisplayName',
  'latestAssignementUsername',
  'extPolicyId',
  'extContractId',
  'extPlanCaption',
  'extCustomerId',
  'extCustomerName',
  'extWorkUnitName',
  'extWorkUnitCode',
  'extWorkUnitCityName',
  'extWorkUnitProvinceName',
  'mainAssignedUserUsername',
  'mainAssignedUserDisplayName',
] as const

const dashboardFilterConfig = {
  dateRangeFilterIds: ['submitDate', 'createdAt', 'assessedAt'],
  numberRangeFilterIds: ['amount', 'totalSumAmount'],
} as const

export function DashboardFilters(props: {
  onChange: (
    updater: (previous: DashboardFilterValues) => DashboardFilterValues
  ) => void
  values: DashboardFilterValues
}) {
  const { onChange, values } = props
  const { t } = useTranslation()
  const docTypesQuery = useQuery({
    queryFn: ({ signal }) => dashboardService.findDocTypes({ signal }),
    queryKey: ['doc-types', 'page', 0, 100],
    staleTime: Infinity,
    gcTime: Infinity,
  })
  const tableValues = useMemo(
    () => toTableFilterValues(values, dashboardFilterConfig),
    [values]
  )
  const docTypeOptions = useMemo(
    () =>
      (docTypesQuery.data ?? []).map((docType) => ({
        label: docType.docType ?? '',
        value: docType.docTypeCode ?? '',
      })),
    [docTypesQuery.data]
  )

  return (
    <TableFilters
      className='mb-4'
      dateRangeFilters={[
        {
          fromPlaceholder: `${t('dashboard.reports.filters.submitDate')} ${t('common.from')}`,
          id: 'submitDate',
          toPlaceholder: `${t('dashboard.reports.filters.submitDate')} ${t('common.to')}`,
        },
        {
          fromPlaceholder: `${t('dashboard.reports.filters.createdAt')} ${t('common.from')}`,
          id: 'createdAt',
          mode: 'date-time',
          toPlaceholder: `${t('dashboard.reports.filters.createdAt')} ${t('common.to')}`,
        },
        {
          fromPlaceholder: `${t('dashboard.reports.filters.assessedAt')} ${t('common.from')}`,
          id: 'assessedAt',
          mode: 'date-time',
          toPlaceholder: `${t('dashboard.reports.filters.assessedAt')} ${t('common.to')}`,
        },
      ]}
      defaultVisibleFilterCount={8}
      facetedFilters={[
        {
          id: 'status',
          multiple: true,
          options: [
            'SUBMITTED',
            'IN_REVIEW',
            'IN_ASSESSMENT',
            'DELEGATED',
            'DEDICATED_TO_USER',
            'APPROVED',
            'REJECTED',
            'PAID',
            'RETURN',
            'SENT',
            'SENT_FAILED',
            'FAILED_FETCH_API',
            'TERMINATED',
            'PAYMENT_REJECTED',
            'PAYMENT_RETURN',
            'PAYMENT_RETURN_RESEND',
            'DELETED',
          ].map((value) => ({
            label: t(`dashboard.reports.statuses.${value}` as never),
            value,
          })),
          placeholder: t('dashboard.reports.filters.status'),
        },
        {
          id: 'docType.docTypeCode',
          multiple: true,
          options: docTypeOptions,
          placeholder: t('dashboard.reports.filters.docType'),
        },
      ]}
      labels={{
        collapse: t('common.showLess'),
        expand: t('common.showMore'),
        reset: t('common.reset'),
      }}
      numberRangeFilters={[
        {
          fromPlaceholder: `${t('dashboard.reports.filters.amount')} ${t('common.from')}`,
          id: 'amount',
          numberWithComma: true,
          toPlaceholder: `${t('dashboard.reports.filters.amount')} ${t('common.to')}`,
        },
        {
          fromPlaceholder: `${t('dashboard.reports.filters.totalSumAmount')} ${t('common.from')}`,
          id: 'totalSumAmount',
          numberWithComma: true,
          toPlaceholder: `${t('dashboard.reports.filters.totalSumAmount')} ${t('common.to')}`,
        },
      ]}
      onValuesChange={(updater) =>
        onChange((previous) =>
          toApiFilterValues(
            updater(toTableFilterValues(previous, dashboardFilterConfig)),
            dashboardFilterConfig
          )
        )
      }
      textFilters={textFilterIds.map((id) => ({
        id,
        numerical: [
          'latestAssignementUsername',
          'extPolicyId',
          'extContractId',
          'extWorkUnitCode',
        ].includes(id),
        placeholder: t(`dashboard.reports.filters.${id}`),
      }))}
      values={tableValues}
    />
  )
}
