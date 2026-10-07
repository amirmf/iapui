import { useOpenTicket } from '@features/tickets/context/store/use-open-ticket'
import type { SupportTicket } from '@iap/api-types'
import { TableActionButton, TableActions } from '@shared/tables'
import { IconEye } from '@tabler/icons-react'
import type { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

type TicketRowActionsProps = {
  row: Row<SupportTicket>
}

export function TicketRowActions(props: TicketRowActionsProps) {
  const { row } = props
  const { t } = useTranslation()
  const openTicket = useOpenTicket()

  return (
    <TableActions>
      <TableActionButton
        presentation='reference'
        icon={<IconEye aria-hidden='true' className='size-5' />}
        label={t('tickets.actions.view')}
        onClick={() => openTicket(row.original)}
        tooltipText={t('tickets.actions.viewDetails')}
      />
    </TableActions>
  )
}
