import { ClaimRequestInfoListContent } from '@features/claim-requests/components/claim-request-info-list-content'
import { type ClaimRequest } from '@features/claim-requests/model/claim-request-management-forms'
import { ClaimRequestUpdateInfoSection } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/claim-request-update-info-section'
import { useIsSuperAdmin } from '@features/claim-requests/route-adapters/use-claim-request-management-permissions'
import { useClaimRequestRolesActions } from '@features/claim-requests/route-adapters/use-claim-request-management-permissions'
import claimRequestService from '@features/claim-requests/services/claim-request-management-service'
import { Permission } from '@iap/ui'
import { cn } from '@iap/ui'
import { Button } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { IconEye } from '@tabler/icons-react'
import { type QueryObserverResult, useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface ClaimRequestInfoListProps<TData> {
  data?: ClaimRequest
  refetch: () => Promise<QueryObserverResult<TData>>
  viewDetailsAdjustmentLink:
    | '/claim-requests/$claimRequestId/claim-request-management/'
    | '/agent/claim-requests/$claimRequestId/claim-request-management/'
}

function ClaimRequestInfoList<TData>({
  data,
  refetch,
  viewDetailsAdjustmentLink,
}: ClaimRequestInfoListProps<TData>) {
  const { t } = useTranslation()
  const claimRequestId = data?.id
  const isRolesActions = useClaimRequestRolesActions()
  const isSuperAdmin = useIsSuperAdmin()

  const inquiryFanavaranMutation = useMutation({
    mutationFn: () =>
      claimRequestId
        ? claimRequestService.inquiryFanavaranBulk([claimRequestId])
        : Promise.reject(new Error('claimRequestId is required')),
    onSuccess: async () => {
      toast.success(t('claimRequests.messages.inquiryFanavaranSuccess'))
      await refetch()
    },
    onError: () => {
      toast.error(t('claimRequests.messages.inquiryFanavaranError'))
    },
  })
  const showGetFanavaranDataBtn =
    !!data &&
    !data.extDisplayName &&
    !data.extCustomerName &&
    !data.extPlanCaption

  const updateDocTypeStatus =
    data?.status === 'IN_ASSESSMENT' || data?.status === 'SENT_FAILED'
  const updateDocTypeCondition =
    isSuperAdmin || (isRolesActions && updateDocTypeStatus)

  if (showGetFanavaranDataBtn) {
    return (
      <div className='flex items-center justify-center rounded-md border border-gray-400 bg-card px-1 py-5'>
        <Button
          type='button'
          size='lg'
          onClick={() => inquiryFanavaranMutation.mutate()}
          className='max-w-full'
          disabled={inquiryFanavaranMutation.isPending}
        >
          <RefreshCw
            className={cn(
              'size-5',
              inquiryFanavaranMutation.isPending && 'animate-spin'
            )}
          />
          <span className='whitespace-break-spaces'>
            {t('claimRequests.actions.inquiryFanavaranGetData')}
          </span>
        </Button>
      </div>
    )
  }

  return (
    <ClaimRequestInfoListContent
      data={data}
      mobileNumberContent={
        <Button
          size='sm'
          variant='link'
          className='px-0 text-sm'
          onClick={() => {
            window.open(`tel:${data?.extMobileNumber ?? '-'}`, '_self')
          }}
        >
          {data?.extMobileNumber ?? '-'}
        </Button>
      }
      trailingContent={
        <div className='flex flex-wrap gap-3 px-1 pt-1'>
          {data?.baseClaimRequestId ? (
            <Link
              to={viewDetailsAdjustmentLink}
              params={{ claimRequestId: data.baseClaimRequestId }}
              target='_blank'
            >
              <Button variant='secondary' type='button' size='sm'>
                <IconEye className='size-5' />
                {t('claimRequests.actions.viewDetailsAdjustment')}
              </Button>
            </Link>
          ) : null}
          <Permission hasPermission={updateDocTypeCondition}>
            <ClaimRequestUpdateInfoSection />
          </Permission>
          <Button
            type='button'
            size='xs'
            // className='ms-auto size-8'
            onClick={() => inquiryFanavaranMutation.mutate()}
            disabled={inquiryFanavaranMutation.isPending}
          >
            {t('claimRequests.actions.inquiryFanavaran')}
            {/*<RefreshCw*/}
            {/*  className={cn(*/}
            {/*    'size-5',*/}
            {/*    inquiryFanavaranMutation.isPending && 'animate-spin'*/}
            {/*  )}*/}
            {/*/>*/}
          </Button>
        </div>
      }
    />
  )
}

export default ClaimRequestInfoList
