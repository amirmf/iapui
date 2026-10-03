import { TableFilterQueryParams } from '@shared/tables'
import { useTranslation } from 'react-i18next'

export default function RepetitiveResponseGroupDataTableToolbar() {
  const { t } = useTranslation()
  return (
    <TableFilterQueryParams
      showReset
      textFilters={[
        {
          className: 'lg:w-full',
          id: 'title',
          placeholder: t('repetitiveResponseGroups.filters.title'),
          wrapperClassName: 'w-full px-1 sm:w-1/4 xl:w-1/5',
        },
      ]}
    />
  )
}
