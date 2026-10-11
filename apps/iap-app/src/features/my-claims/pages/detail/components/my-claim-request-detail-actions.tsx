import { MyClaimRequestDetailDeleteAction } from '@features/my-claims/pages/detail/components/my-claim-request-detail-delete-action'
import { useMyClaimRequestQuery } from '@features/my-claims/queries/my-claim-request-query'
import { Button, Permission } from '@iap/ui'
import { IconEye } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export function MyClaimRequestDetailActions() {
  const { data: claimData } = useMyClaimRequestQuery()
  const { t } = useTranslation()
  const canDelete =
    claimData?.status === 'RETURN' ||
    claimData?.status === 'REJECTED' ||
    claimData?.status === 'IN_ASSESSMENT' ||
    claimData?.status === 'DEDICATED_TO_USER' ||
    claimData?.status === 'DELEGATED'
  const adminOrigin =
    import.meta.env.VITE_IAP_ADMIN_DOMAIN_URL || 'http://localhost:5174'
  const adjustmentUrl = new URL(
    `/claim-requests/${encodeURIComponent(claimData?.baseClaimRequestId || '')}/claim-request-management`,
    adminOrigin
  ).href

  return (
    <div className='flex justify-end gap-2'>
      <Permission hasPermission={canDelete}>
        <MyClaimRequestDetailDeleteAction claimData={claimData} />
      </Permission>
      <Permission hasPermission={!!claimData?.baseClaimRequestId}>
        <a href={adjustmentUrl} target='_blank' rel='noopener noreferrer'>
          <Button
            presentation='reference'
            variant='secondary'
            type='button'
            size='sm'
            className='w-full'
          >
            <IconEye className='size-5' />
            {t('myiap.claimRequest.actions.viewDetailsAdjustment')}
          </Button>
        </a>
      </Permission>
    </div>
  )
}

export default MyClaimRequestDetailActions
