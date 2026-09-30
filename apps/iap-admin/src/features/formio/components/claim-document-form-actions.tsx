import { Button } from '@iap/ui'
import type { TFunction } from 'i18next'
import { RefreshCw, Save } from 'lucide-react'

type Props = {
  disabled: boolean
  onReset: () => void
  onSave: () => void
  t: TFunction
}

export function ClaimDocumentFormActions(props: Props) {
  const { disabled, onReset, onSave, t } = props
  return (
    <>
      <Button
        className='space-x-1'
        disabled={disabled}
        onClick={onReset}
        size='sm'
        type='button'
        variant='outline'
      >
        <RefreshCw aria-hidden='true' className='size-4' />
        <span>{t('common.reset')}</span>
      </Button>
      <Button
        className='space-x-1'
        disabled={disabled}
        onClick={onSave}
        size='sm'
        type='button'
      >
        <Save aria-hidden='true' className='size-4' />
        <span>{t('claimRequests.documents.actions.save')}</span>
      </Button>
    </>
  )
}
