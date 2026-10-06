import {
  getAssessmentPromptPlaceTypeOptions,
  getAssessmentPromptRuleStateOptions,
  getAssessmentPromptStatusOptions,
} from '@features/assessment-prompts/constants/assessment-prompts-constant'
import { useDocTypesData } from '@modules/doc-types'
import { useTranslate } from '@shared/i18n/i18n'
import { TableFilterQueryParams } from '@shared/tables'

export function AssessmentPromptsDataTableToolbar() {
  const { t } = useTranslate()
  const { options: docTypeOptions } = useDocTypesData.optionsCode()
  return (
    <TableFilterQueryParams
      controlQueryParamKeys={['page', 'size', 'sort', 'direction']}
      pageQueryParamKey='page'
      defaultVisibleFilterCount={10}
      showReset
      presentation='reference'
      resetPageToFirst
      labels={{
        reset: t('common.resetFilter'),
        expand: t('common.more'),
        collapse: t('common.collapse'),
      }}
      textFilters={[
        {
          className: 'lg:w-full',
          id: 'title',
          placeholder: t('assessmentPrompts.filters.title'),
          wrapperClassName: 'w-full px-1 sm:w-1/4 xl:w-1/5',
        },
        {
          className: 'lg:w-full',
          id: 'agreement.title',
          placeholder: t('assessmentPrompts.filters.agreementTitle'),
          wrapperClassName: 'w-full px-1 sm:w-1/4 xl:w-1/5',
        },
        {
          className: 'lg:w-full',
          id: 'agreement.code',
          placeholder: t('assessmentPrompts.filters.agreementCode'),
          wrapperClassName: 'w-full px-1 sm:w-1/4 xl:w-1/5',
        },
      ]}
      dateRangeFilters={[
        {
          className: 'lg:w-full',
          fromPlaceholder: t('assessmentPrompts.filters.thruDateFrom'),
          id: 'thruDate',
          fromKey: 'thruDate__from',
          toKey: 'thruDate__to',
          toPlaceholder: t('assessmentPrompts.filters.thruDateTo'),
          wrapperClassName: 'w-full px-1 sm:w-1/4 xl:w-1/5',
        },
      ]}
      facetedFilters={[
        {
          className: 'mx-1',
          id: 'docTypeCode',
          options: docTypeOptions,
          multiple: false,
          placeholder: t('assessmentPrompts.columns.docType'),
        },
        {
          className: 'mx-1',
          id: 'ruleState',
          options: getAssessmentPromptRuleStateOptions(t),
          placeholder: t('assessmentPrompts.columns.ruleState'),
        },
        {
          className: 'mx-1',
          id: 'status',
          options: getAssessmentPromptStatusOptions(t),
          placeholder: t('assessmentPrompts.columns.status'),
        },
        {
          className: 'mx-1',
          id: 'placeType',
          options: getAssessmentPromptPlaceTypeOptions(t),
          placeholder: t('assessmentPrompts.columns.placeType'),
        },
      ]}
    />
  )
}
