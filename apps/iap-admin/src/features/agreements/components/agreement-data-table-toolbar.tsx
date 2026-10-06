import { useMemo } from 'react'

import { getAgreementStatusOptions } from '@features/agreements/constants/agreement-status-options'
import { useTranslate } from '@shared/i18n/i18n'
import type { TableFilterBaseProps } from '@shared/tables'
import { TableFilterQueryParams } from '@shared/tables'

export function AgreementDataTableToolbar() {
  const { t } = useTranslate()
  const textFilters = useMemo<TableFilterBaseProps['textFilters']>(
    () =>
      [
        'title',
        'templateCode',
        'extContractId',
        'extPolicyId',
        'extLocation',
        'extPlanId',
      ].map((id) => ({
        className: 'lg:w-full',
        debounceMs: 1200,
        id,
        placeholder: t(`agreements.columns.${id}` as never),
        wrapperClassName: 'w-full px-1 sm:w-1/2 xl:w-1/3',
      })),
    [t]
  )
  return (
    <TableFilterQueryParams
      presentation='reference'
      controlQueryParamKeys={['page', 'size', 'sort', 'direction']}
      defaultVisibleFilterCount={10}
      labels={{
        collapse: t('common.collapse' as never),
        expand: t('common.more' as never),
        reset: t('common.resetFilter' as never),
      }}
      dateRangeFilters={[
        {
          className: 'lg:w-full',
          fromKey: 'thruDate__from',
          fromPlaceholder: t('agreements.filters.thruDateFrom' as never),
          id: 'thruDate',
          toKey: 'thruDate__to',
          toPlaceholder: t('agreements.filters.thruDateTo' as never),
          wrapperClassName: 'w-full px-1 sm:w-1/2 xl:w-1/3',
        },
      ]}
      facetedFilters={[
        {
          className: 'mx-1',
          id: 'status',
          placeholder: t('agreements.columns.status'),
          debounceMs: 1000,
          options: getAgreementStatusOptions(t),
        },
      ]}
      resetPageToFirst
      showReset
      textFilters={textFilters}
    />
  )
}
