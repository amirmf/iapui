import { useMemo } from 'react'

import {
  type TableFilterBaseProps,
  TableFilterQueryParams,
} from '@shared/tables'
import { useTranslation } from 'react-i18next'

import { TicketStatusFilter } from './ticket-status-filter'

const filterInputClassName = 'lg:w-full'
const filterWrapperClassName = 'w-full sm:w-1/4 xl:w-1/5 px-1'

type TicketToolbarProps = {
  count?: number
  isFetching?: boolean
}

export function TicketToolbar(props: TicketToolbarProps) {
  const { count, isFetching } = props
  const { t } = useTranslation()
  const textFilters = useMemo<TableFilterBaseProps['textFilters']>(
    () => [
      {
        className: filterInputClassName,
        id: 'ticketNumber',
        numerical: true,
        placeholder: t('tickets.columns.ticketNumber'),
        wrapperClassName: filterWrapperClassName,
      },
      {
        asLike: true,
        className: filterInputClassName,
        id: 'ownerUserAccount.displayName',
        placeholder: t('tickets.columns.ownerDisplayName'),
        wrapperClassName: filterWrapperClassName,
      },
      {
        asLike: true,
        className: filterInputClassName,
        id: 'assignedUserAccount.displayName',
        placeholder: t('tickets.columns.assignedUserDisplayName'),
        wrapperClassName: filterWrapperClassName,
      },
    ],
    [t]
  )
  const facetedFilters = useMemo<TableFilterBaseProps['facetedFilters']>(
    () => [
      {
        id: 'priority',
        options: ['LOW', 'NORMAL', 'HIGH', 'URGENT'].map((value) => ({
          label: t(`tickets.priority.${value}` as never),
          value,
        })),
        placeholder: t('tickets.columns.priority'),
      },
      {
        id: 'category',
        options: ['PAYMENT', 'CLAIM_ISSUE', 'INFO_ISSUE'].map((value) => ({
          label: t(`tickets.category.${value}` as never),
          value,
        })),
        placeholder: t('tickets.columns.category'),
      },
    ],
    [t]
  )
  return (
    <div className='mb-4'>
      <TableFilterQueryParams
        facetedFilters={facetedFilters}
        ignoreQueryParams={['features', 'status', 'size', 'direction']}
        showReset
        textFilters={textFilters}
      />
      <TicketStatusFilter count={count} isFetching={isFetching} />
    </div>
  )
}
