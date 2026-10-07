import { Button } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'

interface StartCoreAiWorkflowButtonProps {
  coreAiWorkflowMutationPending: boolean
  coreAiApproveWorkflowMutationPending: boolean
  submitDisabled: boolean
  onClick: () => void
}

function StartCoreAiWorkflowButton(props: StartCoreAiWorkflowButtonProps) {
  const {
    coreAiWorkflowMutationPending,
    coreAiApproveWorkflowMutationPending,
    submitDisabled,
    onClick,
  } = props
  const { t } = useTranslation()

  const disabled =
    submitDisabled ||
    coreAiWorkflowMutationPending ||
    coreAiApproveWorkflowMutationPending

  return (
    <Button
      type='button'
      className='bg-gray-600 hover:bg-gray-500'
      onClick={onClick}
      disabled={disabled}
    >
      {coreAiWorkflowMutationPending
        ? t('common.loading')
        : t('claimRequests.actions.startCoreAiWorkflow')}
    </Button>
  )
}

export default StartCoreAiWorkflowButton
