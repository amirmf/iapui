import { ConfirmDialog } from '@iap/dialogs'
import { Button } from '@iap/ui'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export interface AgentClaimRequestAccountNotFoundDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AgentClaimRequestAccountNotFoundDialog({
  open,
  onOpenChange,
}: AgentClaimRequestAccountNotFoundDialogProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      presentation='reference'
      title={t('agent.claimRequests.create.accountNotFound.title')}
      desc={
        <>
          <span>
            {t('agent.claimRequests.create.accountNotFound.description1')}
          </span>
          <span className='font-bold'>
            {t('agent.claimRequests.create.accountNotFound.description2')}
          </span>
          <span>
            {t('agent.claimRequests.create.accountNotFound.description3')}
          </span>
        </>
      }
      confirmText={t('agent.claimRequests.create.accountNotFound.understood')}
      footerChildren={
        <Button
          presentation='reference'
          variant='outline'
          onClick={() => navigate({ to: '/agent/users/create/' })}
        >
          {t('agent.claimRequests.create.accountNotFound.registerInsured')}
        </Button>
      }
      hideCancelButton
      handleConfirm={() => onOpenChange(false)}
    />
  )
}

export default AgentClaimRequestAccountNotFoundDialog
