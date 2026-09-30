import { useMemo } from 'react'

import {
  type TableFilterBaseProps,
  TableFilterState,
  type TableFilterValues,
} from '@shared/tables'
import { useTranslation } from 'react-i18next'

type DocTypeDataTableToolbarProps = {
  onValuesChange: (
    updater: (previous: TableFilterValues) => TableFilterValues
  ) => void
  values: TableFilterValues
}

export function DocTypeDataTableToolbar(props: DocTypeDataTableToolbarProps) {
  const { onValuesChange, values } = props
  const { t } = useTranslation()
  const textFilters = useMemo<TableFilterBaseProps['textFilters']>(
    () => [
      {
        className: 'lg:w-full',
        id: 'docType',
        placeholder: t('docTypes.filters.docType'),
        wrapperClassName: 'w-full px-1 sm:w-1/4 xl:w-1/5',
      },
    ],
    [t]
  )

  return (
    <TableFilterState
      onValuesChange={onValuesChange}
      textFilters={textFilters}
      values={values}
    />
  )
}
