import { useMemo } from 'react'

import { useDocTypesData } from '@modules/doc-types'
import { useTranslate } from '@shared/i18n/i18n'
import {
  type TableFilterBaseProps,
  TableFilterQueryParams,
} from '@shared/tables'

import {
  getAiAssessmentRuleDefinitionTypeOptions,
  getAiAssessmentRuleStateOptions,
  getAiAssessmentRuleStatusOptions,
} from '../constants/ai-assessment-rule-constant'

const filterInputClassName = 'lg:w-full'
const filterWrapperClassName = 'w-full sm:w-1/4 xl:w-1/5 px-1'
const facetedFilterClassName = 'mx-1'

export function AiAssessmentRulesDataTableToolbar() {
  const { t } = useTranslate()
  const { options: docTypeOptions } = useDocTypesData.optionsCode()

  const textFilters = useMemo<TableFilterBaseProps['textFilters']>(
    () => [
      {
        className: filterInputClassName,
        id: 'agreementTemplateCode',
        placeholder: t('aiAssessmentRules.fields.agreementTemplateCode'),
        wrapperClassName: filterWrapperClassName,
      },
      {
        className: filterInputClassName,
        id: 'extContractId',
        numerical: true,
        placeholder: t('aiAssessmentRules.fields.extContractId'),
        wrapperClassName: filterWrapperClassName,
      },
      {
        className: filterInputClassName,
        id: 'extPolicyId',
        numerical: true,
        placeholder: t('aiAssessmentRules.fields.extPolicyId'),
        wrapperClassName: filterWrapperClassName,
      },
    ],
    [t]
  )

  const facetedFilters = useMemo<TableFilterBaseProps['facetedFilters']>(
    () => [
      {
        className: facetedFilterClassName,
        id: 'definitionType',
        options: getAiAssessmentRuleDefinitionTypeOptions(t),
        placeholder: t('aiAssessmentRules.fields.definitionType'),
      },
      {
        className: facetedFilterClassName,
        id: 'docTypes.docTypeCode',
        options: docTypeOptions,
        placeholder: t('aiAssessmentRules.fields.docTypes'),
      },
      {
        className: facetedFilterClassName,
        id: 'ruleState',
        options: getAiAssessmentRuleStateOptions(t),
        placeholder: t('aiAssessmentRules.fields.ruleState'),
      },
      {
        className: facetedFilterClassName,
        id: 'status',
        options: getAiAssessmentRuleStatusOptions(t),
        placeholder: t('aiAssessmentRules.fields.status'),
      },
    ],
    [docTypeOptions, t]
  )

  return (
    <div className='mb-4'>
      <TableFilterQueryParams
        controlQueryParamKeys={['page', 'size', 'sort', 'direction']}
        defaultVisibleFilterCount={10}
        facetedFilters={facetedFilters}
        labels={{
          collapse: t('common.collapse'),
          expand: t('common.more'),
          reset: t('common.resetFilter'),
        }}
        pageQueryParamKey='page'
        presentation='reference'
        resetPageToFirst
        showReset
        textFilters={textFilters}
      />
    </div>
  )
}
