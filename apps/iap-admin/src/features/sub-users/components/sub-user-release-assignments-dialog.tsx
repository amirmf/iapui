import { useCallback } from 'react'

import { ConfirmDialog } from '@iap/dialogs'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useSubUser } from '../context/store/sub-user-store'
import { useReleaseAssignments } from '../queries/use-sub-user-mutations'

export function SubUserReleaseAssignmentsDialog() {
  const { t } = useTranslation()
  const open = useSubUser((state) => state.open)
  const setOpen = useSubUser((state) => state.setOpen)
  const currentRow = useSubUser((state) => state.currentRow)
  const setCurrentRow = useSubUser((state) => state.setCurrentRow)
  const isOpen = open === 'releaseAssignments'

  const onClose = useCallback(() => {
    setOpen(null)
    setCurrentRow(null)
  }, [setCurrentRow, setOpen])

  const releaseAssignmentsMutation = useReleaseAssignments(onClose)

  const handleReleaseAssignments = () => {
    if (!currentRow?.id) {
      toast.error(t('subUsers.messages.userIdMissing'))
      return
    }

    releaseAssignmentsMutation.mutate({ userId: currentRow.id })
  }

  return (
    <ConfirmDialog
      confirmLabel={t('subUsers.releaseAssignments.confirm')}
      confirmVariant='destructive'
      description={t('subUsers.releaseAssignments.description', {
        user: currentRow?.displayName ?? currentRow?.username ?? '',
      })}
      isLoading={releaseAssignmentsMutation.isPending}
      onConfirm={handleReleaseAssignments}
      onOpenChange={(value) => {
        if (!value) {
          onClose()
        }
      }}
      open={isOpen}
      presentation='reference'
      title={t('subUsers.releaseAssignments.title')}
    />
  )
}
