import { Button } from '@iap/ui'
import { branchService } from '@modules/branches'
import { useMutation } from '@tanstack/react-query'
import { RotateCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type BranchSyncButtonProps = { onSuccess?: () => void }

export function BranchSyncButton(props: BranchSyncButtonProps) {
  const { onSuccess } = props
  const { t } = useTranslation()
  const mutation = useMutation({
    mutationFn: branchService.sync,
    onSuccess: () => {
      toast.success(t('branches.messages.synced'))
      onSuccess?.()
    },
  })

  return (
    <Button
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
      variant='outline'
      className='space-x-2'
    >
      <RotateCw
        aria-hidden='true'
        className={
          mutation.isPending ? 'size-[18px] animate-spin' : 'size-[18px]'
        }
      />
      <span>{t('branches.actions.sync')}</span>
    </Button>
  )
}
