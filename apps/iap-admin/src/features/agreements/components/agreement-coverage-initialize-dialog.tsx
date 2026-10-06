import { useAgreementStore } from '@features/agreements/context/store/agreement-store'
import { agreementCoverageApplService } from '@features/agreements/services/agreement-coverage-appl-service'
import { ConfirmDialog } from '@iap/dialogs'
import { useTranslate } from '@shared/i18n/i18n'
import { IconSparkles } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function AgreementCoverageInitializeDialog() {
  const { t } = useTranslate()
  const row = useAgreementStore((state) => state.currentRow)
  const openDialog = useAgreementStore((state) => state.openDialog)
  const setCurrentRow = useAgreementStore((state) => state.setCurrentRow)
  const setOpenDialog = useAgreementStore((state) => state.setOpenDialog)
  const queryClient = useQueryClient()
  const close = () => {
    setOpenDialog(null)
    setCurrentRow(null)
  }
  const mutation = useMutation({
    mutationFn: () => agreementCoverageApplService.initialize(row!.id!),
    onSuccess: () => {
      toast.success(t('agreements.messages.coverageInitialized'))
      void queryClient.invalidateQueries({
        queryKey: ['agreement-coverage-appls'],
      })
      close()
    },
  })

  return (
    <ConfirmDialog
      presentation='reference'
      confirmLabel={t('agreements.actions.initializeCoverageAppls')}
      description={t('agreements.initializeCoverageApplsDesc')}
      isLoading={mutation.isPending}
      onConfirm={() => row?.id && mutation.mutate()}
      onOpenChange={(open) => !open && !mutation.isPending && close()}
      open={openDialog === 'initializeCoverageAppls'}
      title={
        <span className='flex items-center gap-2'>
          <IconSparkles aria-hidden='true' size={18} />
          {t('agreements.actions.initializeCoverageAppls')}
        </span>
      }
    />
  )
}
