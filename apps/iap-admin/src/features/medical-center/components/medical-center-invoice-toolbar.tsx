import { useMemo } from 'react'

import { getMedicalCenterInvoiceStateOptions } from '@features/medical-center/constants/medical-center-constant'
import {
  type TableFilterBaseProps,
  TableFilterQueryParams,
} from '@shared/tables'
import { useTranslation } from 'react-i18next'

const filterInputClassName = 'lg:w-full'
const filterWrapperClassName = 'w-full sm:w-1/4 xl:w-1/5 px-1'
const facetedFilterClassName = 'mx-1'

export function MedicalCenterInvoiceToolbar() {
  const { t } = useTranslation()

  const textFilters = useMemo<TableFilterBaseProps['textFilters']>(
    () => [
      {
        id: 'documentNumber',
        placeholder: t('medicalCenter.filters.documentNumber'),
        className: filterInputClassName,
        wrapperClassName: filterWrapperClassName,
      },
    ],
    [t]
  )

  const facetedFilters = useMemo<TableFilterBaseProps['facetedFilters']>(
    () => [
      {
        id: 'state',
        placeholder: t('medicalCenter.filters.state'),
        options: getMedicalCenterInvoiceStateOptions(t),
        multiple: false,
        deferSingleSelection: true,
        className: facetedFilterClassName,
      },
    ],
    [t]
  )

  return (
    <TableFilterQueryParams
      presentation='reference'
      resetPageToFirst
      defaultVisibleFilterCount={10}
      controlQueryParamKeys={['page', 'size', 'sort', 'direction']}
      textFilters={textFilters}
      facetedFilters={facetedFilters}
      labels={{ reset: t('common.resetFilter') }}
      showReset
    />
  )
}
