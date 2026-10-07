import { useCallback, useMemo } from 'react'

import type { SupportTicket } from '@iap/api-types'
import { Badge, Button, LongText, cn, formatDateTime } from '@iap/ui'
import { TwoLineCell, TwoLineCellWrapper, TwoLineHeader } from '@shared/tables'
import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { useTicketStore } from '../context/store/ticket-store'
import {
  ticketCategoryClasses,
  ticketCategoryTranslationKeys,
  ticketPriorityClasses,
  ticketPriorityTranslationKeys,
  ticketStatusClasses,
  ticketStatusTranslationKeys,
} from '../model/ticket-presentation'
import { TicketRowActions } from './ticket-row-actions'

const columnHelper = createColumnHelper<SupportTicket>()

export type TicketColumnsVariant = 'claim-request-context' | 'default'

export function useTicketColumns(variant: TicketColumnsVariant = 'default') {
  const { t, i18n } = useTranslation()
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
                presentation='reference'
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
              presentation='reference'
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
            <TwoLineCellWrapper>
              {[
                <LongText presentation='reference' className='max-w-48'>
                  {context.getValue() || '-'}
                </LongText>,
                category ? (
                  <Badge
                    presentation='reference'
                    key={category}
                    className={cn('w-fit', ticketCategoryClasses[category])}
                    variant='outline'
                  >
                    {t(ticketCategoryTranslationKeys[category])}
                  </Badge>
                ) : (
                  '-'
                ),
              ]}
            </TwoLineCellWrapper>
          )
        },
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
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
            presentation='reference'
            emptyValue='-'
            primary={context.row.original.ownerUserAccount?.displayName}
            secondary={context.row.original.ownerUserAccount?.username}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
            column={column}
            primary={t('tickets.columns.ownerDisplayName')}
            secondary={t('tickets.columns.ownerUsername')}
          />
        ),
        id: 'extDisplayName',
        enableSorting: true,
      }),
      columnHelper.display({
        cell: (context) => (
          <span className='truncate text-sm font-medium'>
            {context.row.original.assignedUserAccount?.displayName ?? '-'}
          </span>
        ),
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
            column={column}
            primary={t('tickets.columns.assignedUserDisplayName')}
          />
        ),
        id: 'assignedUserDisplayName',
        enableSorting: true,
      }),
      columnHelper.accessor('status', {
        cell: (context) => {
          const { priority } = context.row.original
          const status = context.getValue()

          return (
            <div className='flex flex-col gap-1'>
              {status ? (
                <Badge
                  presentation='reference'
                  className={cn('w-fit', ticketStatusClasses[status])}
                  variant='outline'
                >
                  {t(ticketStatusTranslationKeys[status])}
                </Badge>
              ) : (
                '-'
              )}
              {priority ? (
                <Badge
                  presentation='reference'
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
            presentation='reference'
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
            presentation='reference'
            emptyValue='-'
            primary={formatDateTime(context.getValue(), undefined, {
              language: i18n.language,
              normalizeTimezone: false,
              invalidDate: 'throw',
            })}
            secondary={formatDateTime(
              context.row.original.createdAt,
              undefined,
              {
                language: i18n.language,
                normalizeTimezone: false,
                invalidDate: 'throw',
              }
            )}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            presentation='reference'
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
    [i18n.language, openTicket, showClaimRequestId, t]
  )
}
