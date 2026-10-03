import { coverageService } from '@features/coverages/services/coverage-service'
import { ConfirmDialog } from '@iap/dialogs'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type CoverageBulkDeleteDialogProps = {
  coverageIds: string[]
  onDeleted?: () => void
  onOpenChange: (open: boolean) => void
  open: boolean
}

/**
 * Compatibility component retained from the reference feature. The page uses
 * the method-selection flow, while consumers that need a direct hard delete
 * can use this source-equivalent dialog.
 */
export function CoverageBulkDeleteDialog(props: CoverageBulkDeleteDialogProps) {
  const { coverageIds, onDeleted, onOpenChange, open } = props
  const { t } = useTranslate()
  const bulkDeleteMutation = useMutation({
    mutationFn: () => coverageService.bulkDelete(coverageIds),
    onSuccess: () => {
      toast.success(t('coverages.bulkDelete.success' as never))
      onDeleted?.()
    },
  })
  const handleConfirm = () => {
    if (coverageIds.length === 0) {
      toast.error(t('coverages.bulkDelete.noSelection' as never))
      return
    }
    bulkDeleteMutation.mutate()
  }
  return (
    <ConfirmDialog
      confirmLabel={
        bulkDeleteMutation.isPending
          ? t('coverages.bulkDelete.submitting' as never)
          : t('coverages.bulkDelete.confirm' as never)
      }
      description={
        <div className='space-y-2'>
          <p>
            {t('coverages.bulkDelete.description' as never, {
              count: coverageIds.length,
            })}
          </p>
          <p className='text-sm text-muted-foreground'>
            {t('coverages.bulkDelete.selectionInfo' as never, {
              count: coverageIds.length,
            })}
          </p>
        </div>
      }
      disableConfirm={coverageIds.length === 0}
      isLoading={bulkDeleteMutation.isPending}
      onConfirm={handleConfirm}
      onOpenChange={onOpenChange}
      open={open}
      title={
        <span className='flex items-center gap-2 text-destructive'>
          <Trash2 aria-hidden='true' className='size-4' />
          {t('coverages.bulkDelete.title' as never)}
        </span>
      }
      variant='error'
    />
  )
}
