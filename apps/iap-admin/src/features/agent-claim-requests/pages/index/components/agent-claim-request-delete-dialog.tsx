import { ConfirmDialog } from '@iap/dialogs'
import { IconTrash } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import agentClaimRequestService from '../../../services/agent-claim-request-service'
import { useAgentClaimRequestStore } from '../context'

interface AgentClaimRequestDeleteDialogProps {
  refetch?: () => void
}

export function AgentClaimRequestDeleteDialog({
  refetch,
}: AgentClaimRequestDeleteDialogProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const open = useAgentClaimRequestStore((state) => state.open)
  const setOpen = useAgentClaimRequestStore((state) => state.setOpen)
  const setCurrentRow = useAgentClaimRequestStore(
    (state) => state.setCurrentRow
  )
  const currentRow = useAgentClaimRequestStore((state) => state.currentRow)

  const handleClose = () => {
    setOpen(null)
    setTimeout(() => setCurrentRow(null), 500)
  }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => agentClaimRequestService.delete(id),
    onSuccess: async () => {
      refetch?.()
      await queryClient.invalidateQueries({ queryKey: ['agentClaimRequests'] })
      toast.success(t('agent.claimRequests.messages.deleted'))
      handleClose()
    },
  })

  const handleDelete = () => {
    if (currentRow?.id) {
      deleteMutation.mutate(currentRow.id)
    }
  }

  if (!currentRow) return null

  return (
    <ConfirmDialog
      confirmLabel={t('common.delete')}
      description={t('common.dialog.deleteDialog.confirmMessage')}
      isLoading={deleteMutation.isPending}
      onConfirm={handleDelete}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose()
      }}
      open={open === 'delete'}
      presentation='reference'
      title={
        <span className='flex items-center gap-2 text-destructive'>
          <IconTrash size={18} />{' '}
          {t('common.dialog.deleteDialog.permanentTitle')}
        </span>
      }
      variant='error'
    />
  )
}

export default AgentClaimRequestDeleteDialog
