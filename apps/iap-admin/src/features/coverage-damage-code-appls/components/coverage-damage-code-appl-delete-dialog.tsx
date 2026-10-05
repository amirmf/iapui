import { coverageDamageCodeApplService } from '@features/coverage-damage-code-appls/services/coverage-damage-code-appl-service'
import type { CoverageDamageCodeApplFull } from '@iap/api-types'
import { ConfirmDialog } from '@iap/dialogs'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'

type CoverageDamageCodeApplDeleteDialogProps = {
  currentRow: CoverageDamageCodeApplFull
  onOpenChange: (open: boolean) => void
  open: boolean
}

/** Source-compatible single-record hard-delete dialog for non-page consumers. */
export function CoverageDamageCodeApplDeleteDialog(
  props: CoverageDamageCodeApplDeleteDialogProps
) {
  const { currentRow, onOpenChange, open } = props
  const { t } = useTranslate()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: coverageDamageCodeApplService.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['coverage-damage-code-appls'],
      })
      onOpenChange(false)
    },
  })

  return (
    <ConfirmDialog
      confirmLabel={t('common.delete')}
      description={t('coverageDamageCodeAppls.delete.description' as never)}
      isLoading={mutation.isPending}
      onConfirm={() => {
        if (currentRow.id) mutation.mutate(currentRow.id)
      }}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onOpenChange(false)
      }}
      open={open}
      title={
        <span className='flex items-center gap-2 text-destructive'>
          <Trash2 aria-hidden='true' className='size-4' />
          {t('coverageDamageCodeAppls.delete.title' as never)}
        </span>
      }
      variant='error'
    />
  )
}
