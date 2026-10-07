import { useMemo } from 'react'

import {
  type TableFilterBaseProps,
  TableFilterState,
  type TableFilterValues,
} from '@shared/tables'
import { useTranslation } from 'react-i18next'

const filterInputClassName = 'lg:w-full'
const filterWrapperClassName = 'w-full sm:w-1/2 lg:w-1/3 px-1'

const textFilterConfigs = [
  { id: 'title', labelKey: 'agreements.columns.title' as const },
  {
    id: 'extContractId',
    labelKey: 'agreements.columns.extContractId' as const,
  },
  { id: 'extPolicyId', labelKey: 'agreements.columns.extPolicyId' as const },
  { id: 'extLocation', labelKey: 'agreements.columns.extLocation' as const },
]

export function SubUsersAgreementsDataTableToolbar(props: {
  onReset: () => void
  onValuesChange: (
    updater: (previous: TableFilterValues) => TableFilterValues
  ) => void
  values: TableFilterValues
}) {
  const { onReset, onValuesChange, values } = props
  const { t } = useTranslation()

  const textFilters = useMemo<TableFilterBaseProps['textFilters']>(
    () =>
      textFilterConfigs.map((config) => ({
        className: filterInputClassName,
        id: config.id,
        placeholder: t(config.labelKey),
        wrapperClassName: filterWrapperClassName,
      })),
    [t]
  )

  const dateRangeFilters = useMemo<TableFilterBaseProps['dateRangeFilters']>(
    () => [
      {
        className: filterInputClassName,
        fromPlaceholder: t('agreements.filters.thruDateFrom'),
        id: 'thruDate',
        toPlaceholder: t('agreements.filters.thruDateTo'),
        wrapperClassName: filterWrapperClassName,
      },
    ],
    [t]
  )

  return (
    <TableFilterState
      dateRangeFilters={dateRangeFilters}
      onReset={onReset}
      onValuesChange={onValuesChange}
      showReset
      textFilters={textFilters}
      values={values}
    />
  )
}
