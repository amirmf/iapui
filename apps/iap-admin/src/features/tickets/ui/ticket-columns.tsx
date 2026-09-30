import { useCallback, useMemo } from 'react'

import type { SupportTicket } from '@iap/api-types'
import { Badge, Button, cn, formatDateTime } from '@iap/ui'
import { TwoLineCell, TwoLineHeader } from '@shared/tables'
import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import {
  ticketCategoryClasses,
  ticketCategoryTranslationKeys,
  ticketPriorityClasses,
  ticketPriorityTranslationKeys,
  ticketStatusClasses,
  ticketStatusTranslationKeys,
} from '../model/ticket-presentation'
import { useTicketStore } from '../model/ticket-store'
import { TicketRowActions } from './ticket-row-actions'

const columnHelper = createColumnHelper<SupportTicket>()

export type TicketColumnsVariant = 'claim-request-context' | 'default'

export function useTicketColumns(variant: TicketColumnsVariant = 'default') {
  const { t } = useTranslation()
  const setCurrentRow = useTicketStore((state) => state.setCurrentRow)
  const setOpen = useTicketStore((state) => state.setOpen)
  const showClaimRequestId = variant === 'claim-request-context'

  const openTicket = useCallback(
    (ticket: SupportTicket) => {
      setCurrentRow(ticket)
      setOpen('detail')
    },
    [setCurrentRow, setOpen]
  )

  return useMemo(
    () => [
      columnHelper.accessor(
        showClaimRequestId ? 'claimRequestId' : 'ticketNumber',
        {
          cell: (context) => {
            const identifier = context.getValue()

            return (
              <Button
                className='h-auto max-w-44 justify-start p-0 text-start'
                onClick={() => openTicket(context.row.original)}
                variant='link'
              >
                {showClaimRequestId
                  ? (identifier ?? '-')
                  : identifier
                    ? `#${identifier}`
                    : '-'}
              </Button>
            )
          },
          header: ({ column }) => (
            <TwoLineHeader
              column={column}
              primary={
                showClaimRequestId
                  ? t('tickets.columns.claimRequestId')
                  : t('tickets.columns.ticketNumber')
              }
            />
          ),
          meta: { className: 'max-w-44' },
        }
      ),
      columnHelper.accessor('subject', {
        cell: (context) => {
          const category = context.row.original.category

          return (
            <TwoLineCell
              longText
              primary={context.getValue()}
              secondary={
                category ? (
                  <Badge
                    className={cn('w-fit', ticketCategoryClasses[category])}
                    variant='outline'
                  >
                    {t(ticketCategoryTranslationKeys[category])}
                  </Badge>
                ) : undefined
              }
            />
          )
        },
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('tickets.columns.subject')}
            secondary={t('tickets.columns.category')}
          />
        ),
        meta: { className: 'max-w-72' },
      }),
      columnHelper.display({
        cell: (context) => (
          <TwoLineCell
            primary={context.row.original.ownerUserAccount?.displayName}
            secondary={context.row.original.ownerUserAccount?.username}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('tickets.columns.ownerDisplayName')}
            secondary={t('tickets.columns.ownerUsername')}
          />
        ),
        id: 'ownerUserAccount.displayName',
      }),
      columnHelper.display({
        cell: (context) => (
          <span className='truncate text-sm font-medium'>
            {context.row.original.assignedUserAccount?.displayName ?? '–'}
          </span>
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('tickets.columns.assignedUserDisplayName')}
          />
        ),
        id: 'assignedUserAccount.displayName',
      }),
      columnHelper.accessor('status', {
        cell: (context) => {
          const { priority } = context.row.original
          const status = context.getValue()

          return (
            <div className='flex flex-col gap-1 text-xs'>
              {status ? (
                <Badge
                  className={cn('w-fit', ticketStatusClasses[status])}
                  variant='outline'
                >
                  {t(ticketStatusTranslationKeys[status])}
                </Badge>
              ) : (
                '–'
              )}
              {priority ? (
                <Badge
                  className={cn('w-fit', ticketPriorityClasses[priority])}
                  variant='outline'
                >
                  {t(ticketPriorityTranslationKeys[priority])}
                </Badge>
              ) : null}
            </div>
          )
        },
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('tickets.columns.status')}
            secondary={t('tickets.columns.priority')}
          />
        ),
        meta: { className: 'max-w-40' },
      }),
      columnHelper.accessor('lastMessageAt', {
        cell: (context) => (
          <TwoLineCell
            primary={formatDateTime(context.getValue())}
            secondary={formatDateTime(context.row.original.createdAt)}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('tickets.columns.lastMessageAt')}
            secondary={t('tickets.columns.createdAt')}
          />
        ),
        meta: { className: 'max-w-44' },
      }),
      columnHelper.display({
        cell: (context) => <TicketRowActions row={context.row} />,
        enableSorting: false,
        id: 'actions',
        meta: { className: 'sticky left-0 w-12 max-w-12 bg-background' },
      }),
    ],
    [openTicket, showClaimRequestId, t]
  )
}
