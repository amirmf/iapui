import { useAssignementRule } from '@features/assignement-rules/context/store/assignement-rule-store'
import { useBulkDeleteAssignementRules } from '@features/assignement-rules/queries/use-assignement-rule-mutations'
import { ConfirmDialog } from '@iap/dialogs'
import { IconTrash } from '@tabler/icons-react'
import type { QueryObserverResult } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

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

  const mutation = useBulkDeleteAssignementRules(ids, async () => {
    await refetch()
    setRowSelection({})
    toast.success(t('assignementRules.messages.bulkDeleted'))
    handleClose()
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
