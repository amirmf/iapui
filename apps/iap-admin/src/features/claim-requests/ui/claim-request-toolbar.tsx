import {
  type TableFilterBaseProps,
  TableFilterQueryParams,
} from '@shared/tables'
import { useTranslation } from 'react-i18next'

import type { ClaimRequestQuickStatus } from '../model/claim-request-filters'
import { ClaimRequestQuickStatusFilter } from './claim-request-quick-status-filter'

const textFilterIds = [
  'extNationalCode',
  'extMainNationalCode',
  'extDisplayName',
  'extCustomerName',
  'businessKey',
  'extPolicyId',
  'extContractId',
  'extWorkUnitName',
  'latestAssignementDisplayName',
] as const

export function ClaimRequestToolbar(props: {
  count?: number
  isFetching: boolean
  onQuickStatusChange: (status: ClaimRequestQuickStatus) => void
  quickStatus: ClaimRequestQuickStatus
}) {
  const { count, isFetching, onQuickStatusChange, quickStatus } = props
  const { t } = useTranslation()
  const textFilters: NonNullable<TableFilterBaseProps['textFilters']> =
    textFilterIds.map((id) => ({
      asLike: ![
        'businessKey',
        'extContractId',
        'extNationalCode',
        'extMainNationalCode',
        'extPolicyId',
      ].includes(id),
      id,
      queryKey: [
        'extDisplayName',
        'extCustomerName',
        'extWorkUnitName',
        'latestAssignementDisplayName',
      ].includes(id)
        ? `${id}__like`
        : id,
      placeholder: t(`claimRequests.filters.${id}`),
      wrapperClassName:
        'w-full sm:w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)]',
    }))

  return (
    <div className='mb-4 space-y-4'>
      <TableFilterQueryParams
        dateRangeFilters={[
          {
            fromKey: 'submitDate__from',
            id: 'submitDate',
            fromPlaceholder: t('claimRequests.filters.submitDateFrom'),
            toKey: 'submitDate__to',
            toPlaceholder: t('claimRequests.filters.submitDateTo'),
          },
          {
            fromKey: 'createdAt__from',
            id: 'createdAt',
            fromPlaceholder: t('claimRequests.filters.createdAtFrom'),
            toKey: 'createdAt__to',
            toPlaceholder: t('claimRequests.filters.createdAtTo'),
          },
          {
            fromKey: 'assessedAt__from',
            id: 'assessedAt',
            fromPlaceholder: t('claimRequests.filters.assessedAtFrom'),
            toKey: 'assessedAt__to',
            toPlaceholder: t('claimRequests.filters.assessedAtTo'),
          },
        ]}
        defaultVisibleFilterCount={5}
        facetedFilters={[
          {
            id: 'aiStatus',
            multiple: true,
            options: [
              {
                label: t('claimRequests.aiStatus.approved'),
                value: 'APPROVED',
              },
              { label: t('claimRequests.aiStatus.return'), value: 'RETURN' },
              {
                label: t('claimRequests.aiStatus.reviewRequired'),
                value: 'REVIEW_REQUIRED',
              },
              { label: t('claimRequests.aiStatus.reject'), value: 'REJECT' },
            ],
            placeholder: t('claimRequests.columns.aiStatus'),
          },
          {
            id: 'isReturn',
            multiple: false,
            options: [
              { label: t('common.yes'), value: 'Y' },
              { label: t('common.no'), value: 'N' },
            ],
            placeholder: t('claimRequests.filters.isReturn'),
          },
        ]}
        ignoreQueryParams={['quickStatus']}
        labels={{
          collapse: t('common.showLess'),
          expand: t('common.showMore'),
          reset: t('common.reset'),
        }}
        numberRangeFilters={[
          {
            fromKey: 'amount__fromNum',
            id: 'amount',
            fromPlaceholder: t('claimRequests.filters.amountFrom'),
            numberWithComma: true,
            toKey: 'amount__toNum',
            toPlaceholder: t('claimRequests.filters.amountTo'),
          },
          {
            fromKey: 'totalSumAmount__fromNum',
            id: 'totalSumAmount',
            fromPlaceholder: t('claimRequests.filters.totalSumAmountFrom'),
            numberWithComma: true,
            toKey: 'totalSumAmount__toNum',
            toPlaceholder: t('claimRequests.filters.totalSumAmountTo'),
          },
        ]}
        showReset
        textFilters={textFilters}
      />
      <ClaimRequestQuickStatusFilter
        count={count}
        isFetching={isFetching}
        onStatusChange={onQuickStatusChange}
        selectedStatus={quickStatus}
      />
    </div>
  )
}
