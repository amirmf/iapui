import { useCallback } from 'react'

import { agreementPartyRoleTranslationKeys } from '@features/agreements/constants/agreement-party-role-options'
import { useAgreementPartyApplStore } from '@features/agreements/context/store/agreement-party-appl-store'
import { agreementPartyApplService } from '@features/agreements/services/agreement-party-appl-service'
import { ConfirmDialog } from '@iap/dialogs'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export function AgreementPartyApplDeleteDialog(props: { refetch: () => void }) {
  const { refetch } = props
  const { t } = useTranslate()
  const currentRow = useAgreementPartyApplStore((state) => state.currentRow)
  const openDialog = useAgreementPartyApplStore((state) => state.openDialog)
  const setCurrentRow = useAgreementPartyApplStore(
    (state) => state.setCurrentRow
  )
  const setOpenDialog = useAgreementPartyApplStore(
    (state) => state.setOpenDialog
  )
  const close = useCallback(() => {
    setOpenDialog(null)
    setCurrentRow(null)
  }, [setCurrentRow, setOpenDialog])
  const mutation = useMutation({
    mutationFn: async () => {
      if (!currentRow?.id) return
      await agreementPartyApplService.bulkDeletePartyApplication([
        currentRow.id,
      ])
    },
    onSuccess: () => {
      refetch()
      toast.success(t('common.deleted' as never))
      close()
    },
  })
  const role = currentRow?.role
  const description = t(
    'agreementPartyAppls.delete.descriptionWithAgreementAndRole' as never,
    {
      agreementTitle: currentRow?.agreement?.title ?? '-',
      displayName: currentRow?.userAccount?.displayName ?? '-',
      role: role ? t(agreementPartyRoleTranslationKeys[role] as never) : '-',
    }
  )
  return (
    <ConfirmDialog
      presentation='reference'
      confirmLabel={t('common.delete')}
      confirmVariant='destructive'
      description={description}
      isLoading={mutation.isPending}
      onConfirm={() => mutation.mutate()}
      onOpenChange={(open) => !open && close()}
      open={openDialog === 'delete'}
      title={t('common.dialog.deleteDialog.permanentTitle')}
    />
  )
}
