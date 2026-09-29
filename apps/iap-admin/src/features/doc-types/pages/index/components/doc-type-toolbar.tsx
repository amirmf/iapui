import { useMemo } from 'react'

import {
  type TableFilterBaseProps,
  TableFilterQueryParams,
} from '@shared/tables'
import { useTranslation } from 'react-i18next'

export function DocTypeToolbar() {
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

  return <TableFilterQueryParams showReset textFilters={textFilters} />
}
