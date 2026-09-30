import { useMemo } from 'react'

import {
  type TableFilterBaseProps,
  TableFilterQueryParams,
} from '@shared/tables'
import { useTranslation } from 'react-i18next'

const textFilterConfigs = [
  { id: 'username', numerical: true },
  { id: 'phoneNumber', numerical: true },
  { asLike: true, id: 'bankAccountNumber' },
] as const

export function BankAccountDataTableToolbar() {
  const { t } = useTranslation()
  const textFilters = useMemo<TableFilterBaseProps['textFilters']>(
    () =>
      textFilterConfigs.map((config) => ({
        ...config,
        className: 'lg:w-full',
        placeholder: t(`bankAccounts.filters.${config.id}`),
        wrapperClassName: 'w-full px-1 sm:w-1/3 xl:w-1/4',
      })),
    [t]
  )
  const facetedFilters = useMemo<TableFilterBaseProps['facetedFilters']>(
    () => [
      {
        className: 'mx-1',
        id: 'bankAccountType',
        options: [
          { label: t('bankAccounts.types.IBAN'), value: 'IBAN' },
          { label: t('bankAccounts.types.CARD'), value: 'CARD' },
        ],
        title: t('bankAccounts.columns.bankAccountType'),
      },
      {
        className: 'mx-1',
        id: 'isValid',
        options: [
          { label: t('common.yes'), value: 'Y' },
          { label: t('common.no'), value: 'N' },
        ],
        title: t('bankAccounts.columns.isValid'),
      },
    ],
    [t]
  )

  return (
    <div className='mb-4'>
      <TableFilterQueryParams
        facetedFilters={facetedFilters}
        showReset
        textFilters={textFilters}
      />
    </div>
  )
}
