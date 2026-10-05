import type { Branch } from '@iap/api-types'
import { ConfirmDialog } from '@iap/dialogs'
import { branchService } from '@modules/branches'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function BranchDeleteDialog(props: {
  currentRow?: Branch | null
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const { currentRow, onOpenChange, open } = props
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: branchService.delete,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success(t('branches.messages.deleted'))
      onOpenChange(false)
    },
  })

  return (
    <ConfirmDialog
      confirmLabel={t('common.delete')}
      confirmVariant='destructive'
      description={t('branches.dialog.deleteDesc')}
      onConfirm={() => currentRow?.id && mutation.mutate(currentRow.id)}
      onOpenChange={onOpenChange}
      open={open}
      title={t('branches.dialog.delete')}
    />
  )
}
