import type { SupportTicket } from '@iap/api-types'
import { TableActionButton, TableActions } from '@shared/tables'
import { IconEye } from '@tabler/icons-react'
import type { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { useTicketStore } from '../context/store/ticket-store'

type TicketRowActionsProps = {
  row: Row<SupportTicket>
}

export function TicketRowActions(props: TicketRowActionsProps) {
  const { row } = props
  const { t } = useTranslation()
  const setCurrentRow = useTicketStore((state) => state.setCurrentRow)
  const setOpen = useTicketStore((state) => state.setOpen)

  return (
    <TableActions>
      <TableActionButton
        presentation='reference'
        icon={<IconEye aria-hidden='true' className='size-5' />}
        label={t('tickets.actions.view')}
        onClick={() => {
          setCurrentRow(row.original)
          setOpen('detail')
        }}
        tooltipText={t('tickets.actions.viewDetails')}
      />
    </TableActions>
  )
}
