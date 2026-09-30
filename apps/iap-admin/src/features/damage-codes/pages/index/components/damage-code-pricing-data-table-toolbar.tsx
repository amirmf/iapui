import { getDamageCodePriceTypeOptions } from '@features/damage-codes/constants/damage-code-options'
import {
  type TableFilterBaseProps,
  TableFilterState,
  type TableFilterValues,
} from '@shared/tables'
import { useTranslation } from 'react-i18next'

const filterClassName = 'lg:w-full'
const filterWrapperClassName = 'w-full px-1 sm:w-1/4 xl:w-1/5'

type DamageCodePricingDataTableToolbarProps = TableFilterBaseProps & {
  onValuesChange: (
    updater: (previous: TableFilterValues) => TableFilterValues
  ) => void
  values: TableFilterValues
}

export function DamageCodePricingDataTableToolbar(
  props: DamageCodePricingDataTableToolbarProps
) {
  const { t } = useTranslation()

  return (
    <TableFilterState
      {...props}
      dateRangeFilters={[
        {
          className: filterClassName,
          fromPlaceholder: t('damageCodePricings.filters.thruDateFrom'),
          id: 'thruDate',
          toPlaceholder: t('damageCodePricings.filters.thruDateTo'),
          wrapperClassName: filterWrapperClassName,
        },
      ]}
      facetedFilters={[
        {
          className: 'mx-1',
          id: 'priceType',
          options: getDamageCodePriceTypeOptions(t),
          placeholder: t('damageCodePricings.columns.priceType'),
        },
      ]}
      textFilters={[
        {
          className: filterClassName,
          id: 'damageCode.code',
          placeholder: t('damageCodePricings.columns.damageCode'),
          wrapperClassName: filterWrapperClassName,
        },
        {
          className: filterClassName,
          id: 'damageCode.title',
          placeholder: t('damageCodePricings.columns.damageCodeTitle'),
          wrapperClassName: filterWrapperClassName,
        },
      ]}
    />
  )
}
