import { useMemo } from 'react'

import {
  type TableFilterBaseProps,
  TableFilterQueryParams,
  type TextTableFilterConfig,
} from '@shared/tables'
import { useTranslation } from 'react-i18next'

import { getSupportRequiredParamInputDisplayOptions } from '../../constants/support-question-constant'

const filterInputClassName = 'lg:w-full'
const filterWrapperClassName = 'w-full sm:w-1/4 xl:w-1/5 px-1'
const facetedFilterClassName = 'mx-1'

const textFilterConfigs: TextTableFilterConfig[] = [
  { id: 'questionKey', asLike: true },
  { id: 'title', asLike: true },
]

export function SupportQuestionsDataTableToolbar() {
  const { t } = useTranslation()

  const textFilters = useMemo<TableFilterBaseProps['textFilters']>(
    () =>
      textFilterConfigs.map((config) => ({
        ...config,
        placeholder: t(`supportQuestions.filters.${config.id}` as never),
        className: filterInputClassName,
        wrapperClassName: filterWrapperClassName,
      })),
    [t]
  )

  const facetedFilters = useMemo<TableFilterBaseProps['facetedFilters']>(
    () => [
      {
        id: 'requiredParamInputDisplay',
        title: t('supportQuestions.columns.requiredParamInputDisplay' as never),
        options: getSupportRequiredParamInputDisplayOptions(t),
        className: facetedFilterClassName,
      },
    ],
    [t]
  )

  return (
    <div className='mb-4'>
      <TableFilterQueryParams
        textFilters={textFilters}
        facetedFilters={facetedFilters}
        showReset
      />
    </div>
  )
}
