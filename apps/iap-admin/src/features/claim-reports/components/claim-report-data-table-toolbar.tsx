import { useMemo } from 'react'

import {
  claimReportDirectionQueryParamKey,
  claimReportPageQueryParamKey,
  claimReportPageSizeQueryParamKey,
  claimReportSortQueryParamKey,
} from '@features/claim-reports/route-adapters/table-search'
import {
  type TableFilterBaseProps,
  TableFilterQueryParams,
} from '@shared/tables'
import { useTranslation } from 'react-i18next'

import { getOutpatientDocAcceptanceStatusOptions } from '../constants/outpatient-doc-acceptance-status'

const filterInputClassName = 'lg:w-full'
const filterWrapperClassName = 'w-full sm:w-1/4 xl:w-1/5 px-1'
const facetedFilterClassName = 'mx-1'
const controlQueryParamKeys = [
  claimReportPageQueryParamKey,
  claimReportPageSizeQueryParamKey,
  claimReportSortQueryParamKey,
  claimReportDirectionQueryParamKey,
] as const

const textFilterConfigs = [
  { id: 'exId', numerical: true },
  { id: 'outpatientClaim.claimNo', numerical: true },
  { id: 'policyId', numerical: true },
  { id: 'outpatientClaim.inqueryStatusTitle', numerical: false },
] as const

export function ClaimReportDataTableToolbar() {
  const { t } = useTranslation()
  const textFilters = useMemo<TableFilterBaseProps['textFilters']>(
    () =>
      textFilterConfigs.map((config) => ({
        ...config,
        className: filterInputClassName,
        placeholder: t(`claimReports.filters.${config.id}`),
        wrapperClassName: filterWrapperClassName,
      })),
    [t]
  )
  const dateRangeFilters = useMemo<TableFilterBaseProps['dateRangeFilters']>(
    () => [
      {
        className: filterInputClassName,
        fromPlaceholder: t('claimReports.filters.deliveryDateFrom'),
        id: 'deliveryDate',
        toPlaceholder: t('claimReports.filters.deliveryDateTo'),
        wrapperClassName: filterWrapperClassName,
      },
    ],
    [t]
  )
  const facetedFilters = useMemo<TableFilterBaseProps['facetedFilters']>(
    () => [
      {
        className: facetedFilterClassName,
        id: 'status',
        options: getOutpatientDocAcceptanceStatusOptions((key) =>
          t(key as never)
        ),
        placeholder: t('claimReports.filters.status'),
      },
    ],
    [t]
  )

  return (
    <TableFilterQueryParams
      controlQueryParamKeys={controlQueryParamKeys}
      dateRangeFilters={dateRangeFilters}
      facetedFilters={facetedFilters}
      showReset
      textFilters={textFilters}
      resetPageToFirst
    />
  )
}
