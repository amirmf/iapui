import { useMemo } from 'react'

import { getAgreementPartyRoleOptions } from '@features/agreements/constants/agreement-party-role-options'
import { useTranslate } from '@shared/i18n/i18n'
import {
  type TableFilterBaseProps,
  TableFilterState,
  type TableFilterValues,
} from '@shared/tables'

const textFilterConfigs = [
  ['userAccount.displayName', 'displayName'],
  ['userAccount.username', 'username'],
  ['agreement.extPolicyId', 'extPolicyId'],
  ['agreement.extContractId', 'extContractId'],
  ['agreement.extLocation', 'extLocation'],
  ['agreement.title', 'agreementTitle'],
] as const

export function AgreementPartyApplDataTableToolbar(props: {
  onReset: () => void
  onValuesChange: (
    updater: (previous: TableFilterValues) => TableFilterValues
  ) => void
  values: TableFilterValues
}) {
  const { onReset, onValuesChange, values } = props
  const { t } = useTranslate()
  const textFilters = useMemo<TableFilterBaseProps['textFilters']>(
    () =>
      textFilterConfigs.map(([id, key]) => ({
        debounceMs: 1200,
        id,
        placeholder: t(`agreements.partyAppls.filters.${key}` as never),
        queryKey: id === 'userAccount.displayName' ? `${id}__like` : id,
      })),
    [t]
  )
  const facetedFilters = useMemo<TableFilterBaseProps['facetedFilters']>(
    () => [
      {
        debounceMs: 1000,
        id: 'role',
        multiple: false,
        options: getAgreementPartyRoleOptions(t),
        placeholder: t('agreements.partyAppls.role' as never),
      },
    ],
    [t]
  )
  return (
    <TableFilterState
      presentation='reference'
      className='gap-2'
      defaultVisibleFilterCount={10}
      facetedFilters={facetedFilters}
      labels={{
        collapse: t('common.collapse'),
        expand: t('common.more'),
        reset: t('common.resetFilter'),
      }}
      onReset={onReset}
      showReset
      onValuesChange={onValuesChange}
      textFilters={textFilters}
      values={values}
    />
  )
}
