import { Button, SheetClose } from '@iap/ui'
import { IconSend, IconX } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

type TicketDetailSheetActionsProps = {
  canCloseTicket: boolean
  canSendMessage: boolean
  isClosingTicket: boolean
  isSendingMessage: boolean
  onCloseTicket: () => void
}

export function TicketDetailSheetActions(props: TicketDetailSheetActionsProps) {
  const {
    canCloseTicket,
    canSendMessage,
    isClosingTicket,
    isSendingMessage,
    onCloseTicket,
  } = props
  const { t } = useTranslation()

  return (
    <div className='flex flex-col gap-2 sm:flex-row sm:justify-end'>
      <SheetClose asChild>
        <Button
          presentation='reference'
          className='w-full sm:w-auto'
          type='button'
          variant='outline'
        >
          {t('tickets.detail.cancel')}
        </Button>
      </SheetClose>
      <Button
        presentation='reference'
        aria-busy={isClosingTicket}
        className='w-full sm:w-auto'
        disabled={!canCloseTicket || isClosingTicket}
        onClick={onCloseTicket}
        type='button'
        variant='destructive'
      >
        <IconX aria-hidden='true' size={18} />
        <span>
          {isClosingTicket
            ? t('tickets.detail.closingTicket')
            : t('tickets.detail.closeTicket')}
        </span>
      </Button>
      <Button
        presentation='reference'
        aria-busy={isSendingMessage}
        className='w-full sm:w-auto'
        disabled={!canSendMessage || isSendingMessage}
        type='submit'
      >
        <IconSend aria-hidden='true' size={18} />
        <span>
          {isSendingMessage
            ? t('tickets.messages.sending')
            : t('tickets.messages.send')}
        </span>
      </Button>
    </div>
  )
}
