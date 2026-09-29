import type { SupportTicket } from '@iap/api-types'
import { SheetDescription, SheetHeader, SheetTitle } from '@iap/ui'
import { useTranslation } from 'react-i18next'

type TicketDetailSheetHeaderProps = {
  ticket?: SupportTicket
}

export function TicketDetailSheetHeader(props: TicketDetailSheetHeaderProps) {
  const { ticket } = props
  const { t } = useTranslation()

  return (
    <SheetHeader>
      <SheetTitle className='break-all'>
        {ticket?.ticketNumber
          ? `#${ticket.ticketNumber} — ${ticket.subject ?? ''}`
          : t('tickets.detail.title')}
      </SheetTitle>
      <SheetDescription>{t('tickets.detail.description')}</SheetDescription>
    </SheetHeader>
  )
}
