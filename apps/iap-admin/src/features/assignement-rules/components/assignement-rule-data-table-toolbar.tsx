import { useMemo } from 'react'

import { docTypeService } from '@modules/doc-types'
import {
  type TableFilterBaseProps,
  TableFilterQueryParams,
} from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { getAssignementRuleStatusOptions } from '../constants/assignement-rule-constant'

const filterInputClassName = 'lg:w-full'
const filterWrapperClassName = 'w-full sm:w-1/4 xl:w-1/5 px-1'
const facetedFilterClassName = 'mx-1'

export function AssignementRuleDataTableToolbar() {
  const { t } = useTranslation()

  const docTypesQuery = useQuery({
    queryFn: ({ signal }) =>
      docTypeService.getPage({ page: 0, signal, size: 100 }),
    queryKey: ['doc-types', 'page', 0, 100],
    staleTime: Infinity,
  })

  const docTypeOptions = useMemo(
    () =>
      (docTypesQuery.data?.content ?? [])
        .filter(
          (item): item is typeof item & { docTypeCode: string } =>
            typeof item.docTypeCode === 'string'
        )
        .map((item) => ({
          label: item.docType ?? item.docTypeCode,
          value: item.docTypeCode,
        })),
    [docTypesQuery.data?.content]
  )

  const textFilters = useMemo<TableFilterBaseProps['textFilters']>(
    () => [
      {
        asLike: true,
        className: filterInputClassName,
        id: 'title',
        placeholder: t('assignementRules.fields.title'),
        wrapperClassName: filterWrapperClassName,
      },
      {
        className: filterInputClassName,
        id: 'extPolicyId',
        numerical: true,
        placeholder: t('assignementRules.fields.policyId'),
        wrapperClassName: filterWrapperClassName,
      },
      {
        className: filterInputClassName,
        id: 'extContractId',
        numerical: true,
        placeholder: t('assignementRules.fields.contractId'),
        wrapperClassName: filterWrapperClassName,
      },
      {
        className: filterInputClassName,
        id: 'extWorkUnitCode',
        numerical: true,
        placeholder: t('assignementRules.fields.workUnit'),
        wrapperClassName: filterWrapperClassName,
      },
      {
        className: filterInputClassName,
        id: 'mainAssignedUserUsername',
        placeholder: t('assignementRules.fields.assignee'),
        wrapperClassName: filterWrapperClassName,
      },
    ],
    [t]
  )

  const numberRangeFilters = useMemo<
    TableFilterBaseProps['numberRangeFilters']
  >(
    () => [
      {
        className: filterInputClassName,
        fromPlaceholder: t('assignementRules.fields.amountMin'),
        id: 'amountMin',
        numberWithComma: true,
        toPlaceholder: t('assignementRules.fields.amountMin'),
        wrapperClassName: filterWrapperClassName,
      },
      {
        className: filterInputClassName,
        fromPlaceholder: t('assignementRules.fields.amountMax'),
        id: 'amountMax',
        numberWithComma: true,
        toPlaceholder: t('assignementRules.fields.amountMax'),
        wrapperClassName: filterWrapperClassName,
      },
      {
        className: filterInputClassName,
        fromPlaceholder: t('assignementRules.fields.amountApprovedMin'),
        id: 'amountApprovedMin',
        numberWithComma: true,
        toPlaceholder: t('assignementRules.fields.amountApprovedMin'),
        wrapperClassName: filterWrapperClassName,
      },
      {
        className: filterInputClassName,
        fromPlaceholder: t('assignementRules.fields.amountApprovedMax'),
        id: 'amountApprovedMax',
        numberWithComma: true,
        toPlaceholder: t('assignementRules.fields.amountApprovedMax'),
        wrapperClassName: filterWrapperClassName,
      },
    ],
    [t]
  )

  const dateRangeFilters = useMemo<TableFilterBaseProps['dateRangeFilters']>(
    () => [
      {
        className: filterInputClassName,
        fromPlaceholder: t('assignementRules.fields.fromDate'),
        id: 'fromDate',
        toPlaceholder: t('assignementRules.fields.fromDate'),
        wrapperClassName: filterWrapperClassName,
      },
      {
        className: filterInputClassName,
        fromPlaceholder: t('assignementRules.fields.thruDate'),
        id: 'thruDate',
        toPlaceholder: t('assignementRules.fields.thruDate'),
        wrapperClassName: filterWrapperClassName,
      },
    ],
    [t]
  )

  const statusOptions = useMemo(() => getAssignementRuleStatusOptions(t), [t])

  const facetedFilters = useMemo<TableFilterBaseProps['facetedFilters']>(
    () => [
      {
        className: facetedFilterClassName,
        id: 'status',
        options: statusOptions,
        title: t('assignementRules.fields.status'),
      },
      {
        id: 'docTypeCode',
        options: docTypeOptions,
        title: t('assignementRules.fields.docTypeCode'),
        wrapperClassName: facetedFilterClassName,
      },
    ],
    [docTypeOptions, statusOptions, t]
  )

  return (
    <div className='mb-4'>
      <TableFilterQueryParams
        dateRangeFilters={dateRangeFilters}
        defaultVisibleFilterCount={13}
        facetedFilters={facetedFilters}
        numberRangeFilters={numberRangeFilters}
        textFilters={textFilters}
      />
    </div>
  )
}
