import { useMemo } from 'react'

import { MyClaimRequestCardActions } from '@features/my-claims/components/my-claim-request-card-actions'
import { MyClaimRequestCardDates } from '@features/my-claims/components/my-claim-request-card-dates'
import {
  CLAIM_REQUEST_STATUS_TRANSLATION_KEYS,
  CLAIM_REQUEST_STATUS_TRANSLATION_KEYS_MY_IAP,
  MY_IAP_SENT_TO_BANK_FILTER_VALUE,
  claimStatusBorderColors,
  claimStatusColors,
} from '@features/my-claims/constants/claim-status-constant'
import {
  getClaimRequestDisplayStatus,
  getClaimRequestDisplayStatusColor,
} from '@features/my-claims/utils/claim-request-display-status'
import type { ClaimRequest } from '@iap/api-types'
import {
  Badge,
  Card,
  CardContent,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from '@iap/ui'
import { useTranslation } from 'react-i18next'

interface MyClaimRequestCardProps {
  claim: ClaimRequest
}

export function MyClaimRequestCard(props: MyClaimRequestCardProps) {
  const { claim } = props
  const { t } = useTranslation()
  const displayedStatus = getClaimRequestDisplayStatus(claim)

  const getStatusLabel = (status: string | null | undefined): string => {
    if (!status) return '-'
    if (status === MY_IAP_SENT_TO_BANK_FILTER_VALUE) {
      return t('claimRequests.status.sentToBank')
    }
    const key =
      CLAIM_REQUEST_STATUS_TRANSLATION_KEYS_MY_IAP[
        status as keyof typeof CLAIM_REQUEST_STATUS_TRANSLATION_KEYS
      ]
    return key ? t(key) : status
  }

  const statusColorClass = useMemo(() => {
    const status = getClaimRequestDisplayStatusColor(displayedStatus)
    if (status) {
      return claimStatusColors[status] || ''
    }
    return ''
  }, [displayedStatus])

  const borderColor = useMemo(() => {
    const status = getClaimRequestDisplayStatusColor(displayedStatus)
    if (status) {
      return claimStatusBorderColors[status] || ''
    }
    return ''
  }, [displayedStatus])

  const title = useMemo(() => {
    if (claim.docType) {
      return claim.docType.docType
    }
    return claim.documents?.map((item) => item.documentType).join(',')
  }, [claim.docType, claim.documents])

  const lastObjection = useMemo(() => {
    if (!claim.objections || claim.objections.length === 0) {
      return null
    }

    // Filter out ENDUSER roleType and sort by createdAt (latest first)
    const filtered = claim.objections
      .filter((objection) => objection.roleType !== 'ENDUSER')
      .sort((a, b) => {
        const timeA = new Date(a.createdAt || '').getTime()
        const timeB = new Date(b.createdAt || '').getTime()
        return timeB - timeA // Descending order (latest first)
      })

    return filtered.length > 0 ? filtered[0] : null
  }, [claim.objections])

  return (
    <>
      <Card className={cn('h-full w-full py-2 shadow-none', borderColor)}>
        <CardContent className='flex flex-1 flex-col justify-between px-3'>
          <div className='flex flex-1 flex-col space-y-2'>
            <div className='mb-2 flex justify-between gap-3'>
              <div className='truncate text-sm font-bold'>{title}</div>
              <Badge
                presentation='reference'
                className={cn('whitespace-nowrap', statusColorClass)}
              >
                {getStatusLabel(displayedStatus)}
              </Badge>
            </div>
            <div className='flex justify-between'>
              <p className='text-xs font-medium'>
                <span className='text-muted-foreground'>
                  {t('myiap.claimRequest.detail.businessKey')}:{' '}
                </span>
                <span>{claim.businessKey}</span>
              </p>
              {claim.baseClaimRequestId && (
                <Badge
                  presentation='reference'
                  variant='outline'
                  className='border-red-300 bg-red-100 px-1 text-[10px] leading-4 text-red-700'
                >
                  {t('myiap.claimRequest.detail.adjustment')}
                </Badge>
              )}
            </div>
            <MyClaimRequestCardDates claim={claim} />
            {/* Amount */}
            <div className='flex items-center justify-between space-y-1'>
              <div className='flex items-center gap-2'>
                <p className='text-xs font-medium text-muted-foreground'>
                  {t('myiap.claimRequest.detail.beneficiary')}
                </p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className='truncate text-sm font-semibold'>
                      {claim.extDisplayName || '-'}
                    </p>
                  </TooltipTrigger>
                  {claim.extDisplayName && (
                    <TooltipContent presentation='reference'>
                      <p>{claim.extDisplayName}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
              <div className='flex items-center gap-2'>
                <p className='text-xs font-medium text-muted-foreground'>
                  {t('myiap.claimRequest.detail.amount')}
                </p>
                <p className='text-sm font-semibold'>
                  {claim.amount?.toLocaleString('en-US') || '-'}
                </p>
              </div>
            </div>
            {!!claim?.resultReasons?.length || !!lastObjection ? (
              <div className='space-y-1'>
                <p className='text-xs font-medium text-muted-foreground'>
                  {t('myiap.claimRequest.detail.rejectionReasons')}
                </p>
                {!!claim?.resultReasons?.length && (
                  <p className='line-clamp-3 text-sm font-semibold'>
                    {claim?.resultReasons?.join(', ')}
                  </p>
                )}
                {!!lastObjection && (
                  <p className='line-clamp-3 text-sm font-semibold'>
                    {lastObjection.description}
                  </p>
                )}
              </div>
            ) : null}
          </div>

          <MyClaimRequestCardActions claim={claim} />
        </CardContent>
      </Card>
    </>
  )
}
