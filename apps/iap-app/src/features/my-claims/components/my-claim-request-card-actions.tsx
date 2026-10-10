import { useMyClaimRequestStore } from '@features/my-claims/context/store/my-claim-request-store'
import type { ClaimRequest } from '@iap/api-types'
import { Button, Permission } from '@iap/ui'
import { IconTrash } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function MyClaimRequestCardActions(props: { claim: ClaimRequest }) {
  const { claim } = props
  const { t } = useTranslation()
  const setOpen = useMyClaimRequestStore((state) => state.setOpen)
  const setCurrentRow = useMyClaimRequestStore((state) => state.setCurrentRow)
  const canSubmitObjection = claim.status === 'RETURN'
  const canDelete =
    claim.status === 'RETURN' ||
    claim.status === 'REJECTED' ||
    claim.status === 'IN_ASSESSMENT' ||
    claim.status === 'DEDICATED_TO_USER' ||
    claim.status === 'DELEGATED'

  return (
    <div className='mt-auto flex flex-wrap justify-end gap-2 border-t pt-2'>
      <Permission hasPermission={canDelete}>
        <Button
          size='sm'
          variant='destructive'
          className='text-xs font-medium'
          onClick={() => {
            setCurrentRow(claim)
            setOpen('delete')
          }}
        >
          <IconTrash className='size-4' />
          {t('myiap.claimRequest.actions.delete')}
        </Button>
      </Permission>
      <Permission hasPermission={canSubmitObjection}>
        <Button size='sm' className='text-xs font-medium' asChild>
          <Link to='/myclaims/$id/' params={{ id: claim.id ?? '' }}>
            {t('myiap.claimRequest.detail.completeAttachment')}
          </Link>
        </Button>
      </Permission>
      <Button
        asChild
        variant='outline'
        size='sm'
        className='text-xs font-medium'
      >
        <Link to='/myclaims/$id/' params={{ id: claim.id ?? '' }}>
          <ArrowLeft className='h-4 w-4 rtl:hidden' />
          <ArrowRight className='h-4 w-4 ltr:hidden' />
          {t('myiap.claimRequest.actions.viewDetails')}
        </Link>
      </Button>
    </div>
  )
}
