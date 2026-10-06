import { ConfirmDialog } from '@iap/dialogs'
import type { QueryObserverResult } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useAssignementRule } from '../context/assignement-rule-context'
import assignementRuleService from '../services/assignement-rule-service'

export function AssignementRuleDeleteDialog<TData>(props: {
  refetch: () => Promise<QueryObserverResult<TData>> | Promise<unknown> | void
}) {
  const { refetch } = props
  const { t } = useTranslation()
  const open = useAssignementRule((state) => state.open)
  const currentRule = useAssignementRule((state) => state.currentRow)
  const setOpen = useAssignementRule((state) => state.setOpen)
  const setCurrentRow = useAssignementRule((state) => state.setCurrentRow)

  const handleClose = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  const mutation = useMutation({
    mutationFn: (id: string) => assignementRuleService.delete(id),
    onError: () => toast.error(t('assignementRules.messages.deleteFailed')),
    onSuccess: async () => {
      await refetch()
      toast.success(t('assignementRules.messages.deleted'))
      handleClose()
    },
  })

  return (
    <ConfirmDialog
      confirmLabel={t('common.delete')}
      confirmVariant='destructive'
      description={t('assignementRules.dialog.deleteDescription')}
      isLoading={mutation.isPending}
      onConfirm={() => currentRule?.id && mutation.mutate(currentRule.id)}
      onOpenChange={(isOpen) => !isOpen && handleClose()}
      open={open === 'delete'}
      presentation='reference'
      title={t('assignementRules.dialog.delete')}
      variant='error'
    />
  )
}
