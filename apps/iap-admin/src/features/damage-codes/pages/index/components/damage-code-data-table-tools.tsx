import { useMemo } from 'react'

import { getDamageCodeStatusOptions } from '@features/damage-codes/constants/damage-code-options'
import {
  type TableFilterBaseProps,
  TableFilterState,
  type TableFilterValues,
} from '@shared/tables'
import { useTranslation } from 'react-i18next'

export function DamageCodeDataTableTools(props: {
  onValuesChange: (
    updater: (previous: TableFilterValues) => TableFilterValues
  ) => void
  values: TableFilterValues
}) {
  const { onValuesChange, values } = props
  const { t } = useTranslation()
  const textFilters = useMemo<TableFilterBaseProps['textFilters']>(
    () =>
      (['code', 'title', 'extId'] as const).map((id) => ({
        className: 'lg:w-full',
        id,
        placeholder: t(`damageCodes.filters.${id}`),
        wrapperClassName: 'w-full px-1 sm:w-1/4 xl:w-1/5',
      })),
    [t]
  )
  const dateRangeFilters = useMemo<TableFilterBaseProps['dateRangeFilters']>(
    () => [
      {
        fromPlaceholder: t('damageCodes.filters.thruDateFrom'),
        id: 'thruDate',
        locale: 'fa',
        toPlaceholder: t('damageCodes.filters.thruDateTo'),
        wrapperClassName: 'w-full px-1 sm:w-1/4 xl:w-1/5',
      },
    ],
    [t]
  )
  const facetedFilters = useMemo<TableFilterBaseProps['facetedFilters']>(
    () => [
      {
        id: 'status',
        options: getDamageCodeStatusOptions(t),
        placeholder: t('damageCodes.columns.status'),
      },
    ],
    [t]
  )

  return (
    <TableFilterState
      dateRangeFilters={dateRangeFilters}
      facetedFilters={facetedFilters}
      onValuesChange={onValuesChange}
      textFilters={textFilters}
      values={values}
    />
  )
}
