import { TableFilterQueryParams } from '@shared/tables'
import { useTranslation } from 'react-i18next'

export default function RepetitiveResponseDataTableToolbar() {
  const { t } = useTranslation()
  return <TableFilterQueryParams showReset textFilters={['title', 'description'].map((id) => ({ className: 'lg:w-full', id, placeholder: t(`repetitiveResponses.filters.${id === 'description' ? 'response' : 'title'}`), wrapperClassName: 'w-full px-1 sm:w-1/4 xl:w-1/5' }))} />
}
