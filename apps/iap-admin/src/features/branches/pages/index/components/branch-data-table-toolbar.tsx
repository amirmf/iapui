import { useMemo } from 'react'

import {
  type TableFilterBaseProps,
  TableFilterState,
  type TableFilterValues,
} from '@shared/tables'
import { useTranslation } from 'react-i18next'

type BranchDataTableToolbarProps = {
  onValuesChange: (
    updater: (previous: TableFilterValues) => TableFilterValues
  ) => void
  onReset: () => void
  values: TableFilterValues
}

const textFilterConfigs = [{ id: 'code' }, { id: 'unitName' }] as const

export function BranchDataTableToolbar(props: BranchDataTableToolbarProps) {
  const { onReset, onValuesChange, values } = props
  const { t } = useTranslation()
  const textFilters = useMemo<TableFilterBaseProps['textFilters']>(
    () =>
      textFilterConfigs.map(({ id }) => ({
        className: 'lg:w-full',
        id,
        placeholder: t(`branches.columns.${id}`),
        wrapperClassName: 'w-full px-1 sm:w-1/4 xl:w-1/5',
      })),
    [t]
  )

  return (
    <TableFilterState
      onReset={onReset}
      onValuesChange={onValuesChange}
      textFilters={textFilters}
      values={values}
    />
  )
}
