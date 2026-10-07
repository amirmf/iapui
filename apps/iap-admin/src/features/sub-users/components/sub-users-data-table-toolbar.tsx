import { useMemo } from 'react'

import {
  type TableFilterBaseProps,
  TableFilterQueryParams,
} from '@shared/tables'
import { useTranslation } from 'react-i18next'

const filterInputClassName = 'lg:w-full'
const filterWrapperClassName = 'w-full sm:w-1/4 xl:w-1/5 px-1'
const facetedFilterClassName = 'mx-1'

const textFilterConfigs = [
  { id: 'username', labelKey: 'subUsers.filters.username' as const },
  { id: 'displayName', labelKey: 'subUsers.filters.displayName' as const },
  { id: 'mobileNumber', labelKey: 'subUsers.filters.mobileNumber' as const },
]

export function SubUsersDataTableToolbar() {
  const { t } = useTranslation()

  const textFilters: TableFilterBaseProps['textFilters'] = useMemo(
    () =>
      textFilterConfigs.map((config) => ({
        className: filterInputClassName,
        id: config.id,
        placeholder: t(config.labelKey),
        wrapperClassName: filterWrapperClassName,
      })),
    [t]
  )

  const facetedFilters: TableFilterBaseProps['facetedFilters'] = useMemo(
    () => [
      {
        className: facetedFilterClassName,
        id: 'status',
        options: [
          { label: t('subUsers.status.enabled'), value: 'enabled' },
          { label: t('subUsers.status.disabled'), value: 'disabled' },
        ],
        title: t('subUsers.columns.status'),
      },
    ],
    [t]
  )

  return (
    <TableFilterQueryParams
      facetedFilters={facetedFilters}
      showReset
      textFilters={textFilters}
    />
  )
}
