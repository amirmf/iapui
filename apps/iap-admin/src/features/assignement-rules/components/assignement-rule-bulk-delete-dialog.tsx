import { ConfirmDialog } from '@iap/dialogs'
import { IconTrash } from '@tabler/icons-react'
import type { QueryObserverResult } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useAssignementRule } from '../context/assignement-rule-context'
import assignementRuleService from '../services/assignement-rule-service'

export function AssignementRuleBulkDeleteDialog<TData>(props: {
  ids: string[]
  refetch: () => Promise<QueryObserverResult<TData>> | Promise<unknown> | void
}) {
  const { ids, refetch } = props
  const { t } = useTranslation()
  const open = useAssignementRule((state) => state.open)
  const setOpen = useAssignementRule((state) => state.setOpen)
  const setCurrentRow = useAssignementRule((state) => state.setCurrentRow)
  const setRowSelection = useAssignementRule((state) => state.setRowSelection)

  const handleClose = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  const mutation = useMutation({
    mutationFn: () => assignementRuleService.bulkDelete(ids),
    onError: () => toast.error(t('assignementRules.messages.bulkDeleteFailed')),
    onSuccess: async () => {
      await refetch()
      setRowSelection({})
      toast.success(t('assignementRules.messages.bulkDeleted'))
      handleClose()
    },
  })

  return (
    <ConfirmDialog
      confirmLabel={t('common.delete')}
      confirmVariant='destructive'
      description={t('assignementRules.bulkDelete.description', {
        count: ids.length,
      })}
      disableConfirm={ids.length === 0}
      isLoading={mutation.isPending}
      onConfirm={() => mutation.mutate()}
      onOpenChange={(isOpen) => !isOpen && handleClose()}
      open={open === 'bulkDelete'}
      presentation='reference'
      title={
        <span className='flex items-center gap-2 text-destructive'>
          <IconTrash size={18} />
          {t('assignementRules.bulkDelete.title')}
        </span>
      }
      variant='error'
    />
  )
}
