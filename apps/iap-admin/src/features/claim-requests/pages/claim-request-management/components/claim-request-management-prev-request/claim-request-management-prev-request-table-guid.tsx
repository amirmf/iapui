import { CLAIM_REQUEST_STATUS_TRANSLATION_KEYS } from '@features/claim-requests/constants/claim-request-status'
import { cn } from '@iap/ui'
import { useTranslation } from 'react-i18next'

function ClaimRequestManagementPrevRequestTableGuid() {
  const { t } = useTranslation()
  return (
    <div className='flex flex-wrap items-center gap-2'>
      <GuidCard
        color='bg-yellow-300'
        text={t(CLAIM_REQUEST_STATUS_TRANSLATION_KEYS['RETURN'])}
      />
      <GuidCard
        color='bg-red-300'
        text={t(CLAIM_REQUEST_STATUS_TRANSLATION_KEYS['REJECTED'])}
      />
    </div>
  )
}

export default ClaimRequestManagementPrevRequestTableGuid

interface GuidCardProps {
  color?: string
  text?: string
}

function GuidCard(props: GuidCardProps) {
  const { color, text } = props
  return (
    <div className='flex flex-wrap items-center gap-1'>
      <div className={cn('size-3 min-w-3 rounded-full', color)} />
      <p className='text-xs font-medium text-muted-foreground'>{text}</p>
    </div>
  )
}
