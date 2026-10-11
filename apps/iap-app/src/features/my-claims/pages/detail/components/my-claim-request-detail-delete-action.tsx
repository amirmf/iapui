import { useState } from 'react'

import myClaimRequestService from '@features/my-claims/services/my-claim-request-service'
import type { ClaimRequest } from '@iap/api-types'
import { ConfirmDialog } from '@iap/dialogs'
import { Button } from '@iap/ui'
import { IconTrash } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface MyClaimRequestDetailDeleteActionProps {
  claimData?: ClaimRequest
}

export default MyClaimRequestDetailDeleteAction

export function MyClaimRequestDetailDeleteAction(
  props: MyClaimRequestDetailDeleteActionProps
) {
  const { claimData } = props
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const deleteMutation = useMutation({
    mutationFn: myClaimRequestService.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['my-claim-request-list'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['my-claim-request-detail', claimData?.id],
      })
      await queryClient.invalidateQueries({ queryKey: ['myClaimRequests'] })
      await queryClient.invalidateQueries({
        queryKey: ['myClaimRequest', claimData?.id],
      })
      toast.success(t('common.deleteSuccess'))
      setOpen(false)
      await navigate({ to: '/myclaims/' })
    },
  })
  const handleDelete = () => {
    if (claimData?.id) deleteMutation.mutate(claimData.id)
  }

  return (
    <>
      <Button
        presentation='reference'
        size='sm'
        variant='destructive'
        type='button'
        onClick={() => setOpen(true)}
      >
        <IconTrash className='size-4' />
        {t('myiap.claimRequest.actions.delete')}
      </Button>
      <ConfirmDialog
        presentation='reference'
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        title={
          <span className='flex items-center gap-2 text-destructive'>
            <IconTrash size={18} />
            {t('myiap.claimRequest.deleteDialog.title')}
          </span>
        }
        description={t('myiap.claimRequest.deleteDialog.desc')}
        confirmLabel={t('common.delete')}
        confirmVariant='destructive'
      />
    </>
  )
}
