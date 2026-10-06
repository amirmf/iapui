import { useMemo } from 'react'

import {
  getOutpatientDocAcceptanceStatusOptions,
  getOutpatientDocAcceptanceWsStatusOptions,
} from '@features/outpatient-doc-acceptances/constants/outpatient-doc-acceptance-status'
import {
  type TableFilterBaseProps,
  TableFilterQueryParams,
} from '@shared/tables'
import { useTranslation } from 'react-i18next'

// Common style variables
const filterInputClassName = 'lg:w-full'
const filterWrapperClassName = 'w-full sm:w-1/4 xl:w-1/5 px-1'
const facetedFilterClassName = 'mx-1'

// Text filter configurations
const textFilterConfigs = [
  { id: 'exId', numerical: true },
  { id: 'letterNo', numerical: false },
  { id: 'policyId', numerical: true },
  { id: 'inqueryStatusId', numerical: true },
  { id: 'inqueryStatusTitle', numerical: false },
  { id: 'opUnitId', numerical: true },
  { id: 'extLocationId', numerical: true },
] as const

export function OutpatientDocAcceptanceDataTableToolbar() {
  const { t } = useTranslation()

  const textFilters = useMemo<TableFilterBaseProps['textFilters']>(
    () =>
      textFilterConfigs.map((config) => ({
        id: config.id,
        placeholder: t(`outpatientDocAcceptances.filters.${config.id}`),
        className: filterInputClassName,
        wrapperClassName: filterWrapperClassName,
        numerical: config.numerical,
      })),
    [t]
  )

  const dateRangeFilters = useMemo<TableFilterBaseProps['dateRangeFilters']>(
    () => [
      {
        id: 'deliveryDate',
        fromPlaceholder: t('outpatientDocAcceptances.filters.deliveryDateFrom'),
        toPlaceholder: t('outpatientDocAcceptances.filters.deliveryDateTo'),
        className: filterInputClassName,
        wrapperClassName: filterWrapperClassName,
      },
      {
        id: 'updatedAt',
        fromPlaceholder: t('outpatientDocAcceptances.filters.updatedAtFrom'),
        toPlaceholder: t('outpatientDocAcceptances.filters.updatedAtTo'),
        className: filterInputClassName,
        wrapperClassName: filterWrapperClassName,
      },
    ],
    [t]
  )

  const facetedFilters: TableFilterBaseProps['facetedFilters'] = useMemo<
    TableFilterBaseProps['facetedFilters']
  >(() => {
    return [
      {
        id: 'status',
        title: t('outpatientDocAcceptances.columns.status'),
        options: getOutpatientDocAcceptanceStatusOptions((key) =>
          t(key as never)
        ),
        className: facetedFilterClassName,
      },
      {
        id: 'wsStatus',
        title: t('outpatientDocAcceptances.columns.wsStatus'),
        options: getOutpatientDocAcceptanceWsStatusOptions((key) =>
          t(key as never)
        ),
        className: facetedFilterClassName,
      },
    ]
  }, [t])

  return (
    <TableFilterQueryParams
      textFilters={textFilters}
      dateRangeFilters={dateRangeFilters}
      facetedFilters={facetedFilters}
      showReset
      defaultVisibleFilterCount={12}
    />
  )
}
