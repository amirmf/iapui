import { type ReactNode, useMemo } from 'react'

import {
  type TableFilterBaseProps,
  TableFilterQueryParams,
} from '@shared/tables'
import { useTranslation } from 'react-i18next'

import {
  getTicketCategoryOptions,
  getTicketPriorityOptions,
} from '../model/ticket-presentation'
import { TicketStatusFilter } from './ticket-status-filter'

const filterInputClassName = 'lg:w-full'
const filterWrapperClassName = 'w-full sm:w-1/4 xl:w-1/5 px-1'

type TicketsDataTableToolbarProps = {
  beforeStatusFilter?: ReactNode
  count?: number
  isLoading?: boolean
  ticketStatusFilterVariant?: 'claim-request-context' | 'default'
}

export function TicketsDataTableToolbar(props: TicketsDataTableToolbarProps) {
  const { beforeStatusFilter, count, isLoading, ticketStatusFilterVariant } =
    props
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
        options: getTicketPriorityOptions(t),
        title: t('tickets.columns.priority'),
        className: 'mx-1',
      },
      {
        id: 'category',
        options: getTicketCategoryOptions(t),
        title: t('tickets.columns.category'),
        className: 'mx-1',
      },
    ],
    [t]
  )
  return (
    <div className='mb-4'>
      <TableFilterQueryParams
        facetedFilters={facetedFilters}
        ignoreQueryParams={['status', 'features']}
        controlQueryParamKeys={['page', 'size', 'sort', 'direction']}
        presentation='reference'
        showReset
        textFilters={textFilters}
      />
      {beforeStatusFilter}
      <TicketStatusFilter
        count={count}
        isLoading={isLoading}
        variant={ticketStatusFilterVariant}
      />
    </div>
  )
}
