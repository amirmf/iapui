import { useEffect, useRef } from 'react'

import { useMyClaimRequestStore } from '@features/my-claims/context/store/my-claim-request-store'
import myClaimRequestService from '@features/my-claims/services/my-claim-request-service'
import { ConfirmDialog } from '@iap/dialogs'
import { IconTrash } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function MyClaimRequestDeleteDialog(props: { refetch?: () => void }) {
  const { refetch } = props
  const { t } = useTranslation()
  const open = useMyClaimRequestStore((state) => state.open)
  const currentRow = useMyClaimRequestStore((state) => state.currentRow)
  const setOpen = useMyClaimRequestStore((state) => state.setOpen)
  const setCurrentRow = useMyClaimRequestStore((state) => state.setCurrentRow)
  const cleanupTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )
  useEffect(() => () => clearTimeout(cleanupTimer.current), [])
  const handleClose = () => {
    setOpen(null)
    clearTimeout(cleanupTimer.current)
    cleanupTimer.current = setTimeout(() => setCurrentRow(null), 500)
  }
  const deleteMutation = useMutation({
    mutationFn: myClaimRequestService.delete,
    onSuccess: () => {
      refetch?.()
      toast.success(t('common.deleteSuccess'))
      handleClose()
    },
  })
  if (!currentRow) return null
  return (
    <ConfirmDialog
      presentation='reference'
      open={open === 'delete'}
      onOpenChange={handleClose}
      onConfirm={() => {
        if (currentRow.id) deleteMutation.mutate(currentRow.id)
      }}
      isLoading={deleteMutation.isPending}
      title={
        <span className='flex items-center gap-2 text-destructive'>
          <IconTrash aria-hidden='true' size={18} />
          {t('myiap.claimRequest.deleteDialog.title')}
        </span>
      }
      description={t('myiap.claimRequest.deleteDialog.desc')}
      confirmLabel={t('common.delete')}
      confirmVariant='destructive'
    />
  )
}
