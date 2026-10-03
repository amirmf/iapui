import { coverageDamageCodeApplService } from '@features/coverage-damage-code-appls/services/coverage-damage-code-appl-service'
import { ConfirmDialog } from '@iap/dialogs'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type CoverageDamageCodeApplBulkDeleteDialogProps = {
  applIds: string[]
  onDeleted?: () => void
  onOpenChange: (open: boolean) => void
  open: boolean
}

/** Source-compatible direct hard-delete dialog for non-page consumers. */
export function CoverageDamageCodeApplBulkDeleteDialog(
  props: CoverageDamageCodeApplBulkDeleteDialogProps
) {
  const { applIds, onDeleted, onOpenChange, open } = props
  const { t } = useTranslate()
  const mutation = useMutation({
    mutationFn: () => coverageDamageCodeApplService.bulkDelete(applIds),
    onSuccess: () => {
      toast.success(t('coverageDamageCodeAppls.bulkDelete.success' as never))
      onDeleted?.()
    },
  })
  const confirm = () => {
    if (applIds.length === 0) {
      toast.error(t('coverageDamageCodeAppls.bulkDelete.noSelection' as never))
      return
    }
    mutation.mutate()
  }

  return (
    <ConfirmDialog
      confirmLabel={
        mutation.isPending
          ? t('coverageDamageCodeAppls.bulkDelete.submitting' as never)
          : t('coverageDamageCodeAppls.bulkDelete.confirm' as never)
      }
      description={
        <div className='space-y-2'>
          <p>
            {t('coverageDamageCodeAppls.bulkDelete.description' as never, {
              count: applIds.length,
            })}
          </p>
          <p className='text-sm text-muted-foreground'>
            {t('coverageDamageCodeAppls.bulkDelete.selectionInfo' as never, {
              count: applIds.length,
            })}
          </p>
        </div>
      }
      disableConfirm={applIds.length === 0}
      isLoading={mutation.isPending}
      onConfirm={confirm}
      onOpenChange={onOpenChange}
      open={open}
      title={
        <span className='flex items-center gap-2 text-destructive'>
          <Trash2 aria-hidden='true' className='size-4' />
          {t('coverageDamageCodeAppls.bulkDelete.title' as never)}
        </span>
      }
      variant='error'
    />
  )
}
