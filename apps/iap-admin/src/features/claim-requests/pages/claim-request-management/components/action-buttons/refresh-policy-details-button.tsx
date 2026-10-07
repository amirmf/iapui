import { Button } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'

interface RefreshPolicyDetailsButtonProps {
  visible: boolean
  submitDisabled: boolean
  isPending: boolean
  onClick: () => void
}

function RefreshPolicyDetailsButton(props: RefreshPolicyDetailsButtonProps) {
  const { visible, submitDisabled, isPending, onClick } = props
  const { t } = useTranslation()

  if (!visible) {
    return null
  }

  return (
    <Button
      type='button'
      variant='secondary'
      className='bg-gray-600 hover:bg-gray-500'
      onClick={onClick}
      disabled={submitDisabled || isPending}
    >
      {isPending
        ? t('common.loading')
        : t('claimRequests.actions.refreshPolicyDetails')}
    </Button>
  )
}

export default RefreshPolicyDetailsButton
