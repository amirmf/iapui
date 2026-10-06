import { useMemo } from 'react'

import { useTranslate } from '@shared/i18n/i18n'
import {
  type TableFilterBaseProps,
  TableFilterState,
  type TableFilterValues,
} from '@shared/tables'

export function AgreementCoverageDataTableToolbar(props: {
  onReset?: () => void
  ignoredFilterIds?: readonly string[]
  onValuesChange: (
    updater: (previous: TableFilterValues) => TableFilterValues
  ) => void
  values: TableFilterValues
}) {
  const { t } = useTranslate()
  const textFilters = useMemo<TableFilterBaseProps['textFilters']>(
    () =>
      [
        ['damageCode.title', 'damageTitle'],
        ['damageCode.code', 'damageCode'],
        ['coverageDetail.title', 'coverageTitle'],
        ['coverageGroup.title', 'coverageGroupTitle'],
      ].map(([id, label]) => ({
        className: 'lg:w-full',
        debounceMs: 1200,
        id,
        placeholder: t(`agreementCoverageAppls.columns.${label}` as never),
        wrapperClassName: 'w-full px-1 sm:w-1/4 xl:w-1/5',
      })),
    [t]
  )

  return (
    <TableFilterState
      presentation='reference'
      ignoredFilterIds={props.ignoredFilterIds}
      onValuesChange={props.onValuesChange}
      onReset={props.onReset}
      labels={{ reset: t('common.resetFilter' as never) }}
      textFilters={textFilters}
      values={props.values}
      showReset
    />
  )
}
