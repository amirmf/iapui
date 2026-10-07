import { useMemo } from 'react'

import { getClaimRequestStatusOptions } from '@features/claim-requests'
import { useDocTypesData } from '@modules/doc-types/queries/use-doc-types-data'
import { GroupedTableFilterQueryParams } from '@shared/tables/filter/grouped-table-filter-query-params'
import type { TableFilterGroup } from '@shared/tables/filter/types'
import { useTranslation } from 'react-i18next'

const ignoredQueryParams = ['reportTab'] as const

export function DashboardPivotTableToolbar() {
  const { t } = useTranslation()
  const { options } = useDocTypesData.optionsCode()

  const filterGroups = useMemo<TableFilterGroup[]>(
    () => [
      {
        filters: [
          {
            config: {
              id: 'status',
              options: getClaimRequestStatusOptions(t as never),
              title: t('dashboard.reports.filters.status'),
            },
            type: 'faceted',
          },
          {
            config: {
              id: 'docType.docTypeCode',
              options,
              title: t('dashboard.reports.filters.docType'),
            },
            type: 'faceted',
          },
          {
            config: {
              fromPlaceholder: `${t('dashboard.reports.filters.submitDate')} ${t('common.from')}`,
              id: 'submitDate',
              toPlaceholder: `${t('dashboard.reports.filters.submitDate')} ${t('common.to')}`,
            },
            type: 'dateRange',
          },
          {
            config: {
              fromPlaceholder: `${t('dashboard.reports.filters.createdAt')} ${t('common.from')}`,
              id: 'createdAt',
              toPlaceholder: `${t('dashboard.reports.filters.createdAt')} ${t('common.to')}`,
            },
            type: 'dateTimeRange',
          },
        ],
        id: 'claim',
        title: t('dashboard.reports.filterGroups.claim'),
      },
      {
        filters: [
          {
            config: {
              id: 'latestAssignementDisplayName',
              placeholder: t(
                'dashboard.reports.filters.latestAssignementDisplayName'
              ),
            },
            type: 'text',
          },
          {
            config: {
              id: 'latestAssignementUsername',
              numerical: true,
              placeholder: t(
                'dashboard.reports.filters.latestAssignementUsername'
              ),
            },
            type: 'text',
          },
          {
            config: {
              id: 'mainAssignedUserDisplayName',
              placeholder: t(
                'dashboard.reports.filters.mainAssignedUserDisplayName'
              ),
            },
            type: 'text',
          },
          {
            config: {
              id: 'mainAssignedUserUsername',
              placeholder: t(
                'dashboard.reports.filters.mainAssignedUserUsername'
              ),
            },
            type: 'text',
          },
          {
            config: {
              fromPlaceholder: `${t('dashboard.reports.filters.assessedAt')} ${t('common.from')}`,
              id: 'assessedAt',
              toPlaceholder: `${t('dashboard.reports.filters.assessedAt')} ${t('common.to')}`,
            },
            type: 'dateTimeRange',
          },
        ],
        id: 'assessment',
        title: t('dashboard.reports.filterGroups.assessment'),
      },
      {
        filters: [
          {
            config: {
              id: 'extPolicyId',
              numerical: true,
              placeholder: t('dashboard.reports.filters.extPolicyId'),
            },
            type: 'text',
          },
          {
            config: {
              id: 'extContractId',
              numerical: true,
              placeholder: t('dashboard.reports.filters.extContractId'),
            },
            type: 'text',
          },
          {
            config: {
              id: 'extPlanCaption',
              placeholder: t('dashboard.reports.filters.extPlanCaption'),
            },
            type: 'text',
          },
          {
            config: {
              id: 'extCustomerId',
              placeholder: t('dashboard.reports.filters.extCustomerId'),
            },
            type: 'text',
          },
          {
            config: {
              id: 'extCustomerName',
              placeholder: t('dashboard.reports.filters.extCustomerName'),
            },
            type: 'text',
          },
        ],
        id: 'policyholder',
        title: t('dashboard.reports.filterGroups.policyholder'),
      },
      {
        filters: [
          {
            config: {
              id: 'extWorkUnitName',
              placeholder: t('dashboard.reports.filters.extWorkUnitName'),
            },
            type: 'text',
          },
          {
            config: {
              id: 'extWorkUnitCode',
              numerical: true,
              placeholder: t('dashboard.reports.filters.extWorkUnitCode'),
            },
            type: 'text',
          },
          {
            config: {
              id: 'extWorkUnitCityName',
              placeholder: t('dashboard.reports.filters.extWorkUnitCityName'),
            },
            type: 'text',
          },
          {
            config: {
              id: 'extWorkUnitProvinceName',
              placeholder: t(
                'dashboard.reports.filters.extWorkUnitProvinceName'
              ),
            },
            type: 'text',
          },
        ],
        id: 'organization',
        title: t('dashboard.reports.filterGroups.organization'),
      },
      {
        filters: [
          {
            config: {
              fromPlaceholder: `${t('dashboard.reports.filters.amount')} ${t('common.from')}`,
              id: 'amount',
              toPlaceholder: `${t('dashboard.reports.filters.amount')} ${t('common.to')}`,
            },
            type: 'numberRange',
          },
          {
            config: {
              fromPlaceholder: `${t('dashboard.reports.filters.totalSumAmount')} ${t('common.from')}`,
              id: 'totalSumAmount',
              toPlaceholder: `${t('dashboard.reports.filters.totalSumAmount')} ${t('common.to')}`,
            },
            type: 'numberRange',
          },
        ],
        id: 'financial',
        title: t('dashboard.reports.filterGroups.financial'),
      },
    ],
    [options, t]
  )

  return (
    <GroupedTableFilterQueryParams
      classNameContainer='mb-4'
      groups={filterGroups}
      ignoreQueryParams={ignoredQueryParams}
      showReset
    />
  )
}

export default DashboardPivotTableToolbar
