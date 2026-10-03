import { useMemo } from 'react'

import { useTranslate } from '@shared/i18n/i18n'
import type { TableFilterBaseProps, TableFilterValues } from '@shared/tables'
import { TableFilterState } from '@shared/tables'

export function CoverageDataTableToolbar(props: {
  onValuesChange: (
    updater: (previous: TableFilterValues) => TableFilterValues
  ) => void
  values: TableFilterValues
}) {
  const { onValuesChange, values } = props
  const { t } = useTranslate()
  const textFilters = useMemo<TableFilterBaseProps['textFilters']>(
    () =>
      ['code', 'title', 'extId'].map((id) => ({
        className: 'lg:w-full',
        id,
        placeholder: t(`coverages.filters.${id}` as never),
        wrapperClassName: 'w-full px-1 sm:w-1/4 xl:w-1/5',
      })),
    [t]
  )
  const facetedFilters = useMemo<TableFilterBaseProps['facetedFilters']>(
    () => [
      {
        className: 'mx-1',
        id: 'coverageType',
        options: [
          { label: t('coverages.type.group'), value: 'GROUP' },
          { label: t('coverages.type.detail'), value: 'DETAIL' },
        ],
        title: t('coverages.columns.type'),
      },
      {
        className: 'mx-1',
        id: 'status',
        options: ['active', 'inactive', 'suspended', 'pending'].map(
          (status) => ({
            label: t(`coverages.status.${status}` as never),
            value: status.toUpperCase(),
          })
        ),
        title: t('coverages.columns.status'),
      },
    ],
    [t]
  )
  return (
    <TableFilterState
      dateRangeFilters={[
        {
          className: 'lg:w-full',
          fromKey: 'thruDateFrom',
          fromPlaceholder: t('coverages.filters.thruDateFrom'),
          id: 'thruDate',
          toKey: 'thruDateTo',
          toPlaceholder: t('coverages.filters.thruDateTo'),
          wrapperClassName: 'w-full px-1 sm:w-1/4 xl:w-1/5',
        },
      ]}
      facetedFilters={facetedFilters}
      onValuesChange={onValuesChange}
      textFilters={textFilters}
      values={values}
    />
  )
}
