import { useMemo } from 'react'
import type { ComponentType, ReactNode } from 'react'

import {
  CLAIM_REQUEST_STATUS_TRANSLATION_KEYS,
  MY_IAP_SENT_TO_BANK_FILTER_VALUE,
  claimStatusColors,
} from '@features/claim-requests/constants/claim-request-status'
import {
  getClaimRequestDisplayStatus,
  getClaimRequestDisplayStatusColor,
} from '@features/claim-requests/model/claim-request-display-status'
import { CLAIM_REQUEST_STATUS_ICON_MAP } from '@features/claim-requests/pages/claim-request-management/components/claim-request-status-history-icons'
import {
  type ClaimRequestStatus,
  type statusHistoryItemType,
} from '@iap/api-types'
import { cn } from '@iap/ui'
import { formatDateTime } from '@iap/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

interface ClaimRequestStatusHistoryDialogProps {
  statusHistory?: statusHistoryItemType[]
  status?: ClaimRequestStatus | null
  extPaymentDate?: string | null
  children: ReactNode
}

function getUserLabel(entry: statusHistoryItemType) {
  const displayName = entry.userIdDisplayName?.trim()
  const username = entry.userIdUsername?.trim()
  const userId = entry.userId?.trim()

  if (displayName && username) return `${displayName} (${username})`
  if (displayName) return displayName
  if (username) return username
  return userId || null
}

export function ClaimRequestStatusHistoryDialog(
  props: ClaimRequestStatusHistoryDialogProps
) {
  const { statusHistory, status, extPaymentDate, children } = props
  const { t, i18n } = useTranslate()

  const history = useMemo(() => {
    return [...(statusHistory ?? [])].sort(
      (a, b) =>
        new Date(b.timestamp ?? '').getTime() -
        new Date(a.timestamp ?? '').getTime()
    )
  }, [statusHistory])

  const getIcon = (
    status: string | null | undefined
  ): ComponentType<{ className?: string }> => {
    if (!status || !(status in CLAIM_REQUEST_STATUS_ICON_MAP)) {
      return CLAIM_REQUEST_STATUS_ICON_MAP.SUBMITTED
    }

    return (
      CLAIM_REQUEST_STATUS_ICON_MAP as Record<
        string,
        ComponentType<{ className?: string }>
      >
    )[status]
  }

  const getStatusLabel = (status: string | null | undefined) => {
    if (status === MY_IAP_SENT_TO_BANK_FILTER_VALUE) {
      return t('claimRequests.status.sentToBank')
    }

    if (!status || !(status in CLAIM_REQUEST_STATUS_TRANSLATION_KEYS)) {
      return '-'
    }

    return t(
      (CLAIM_REQUEST_STATUS_TRANSLATION_KEYS as Record<string, string>)[
        status
      ] as never
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild disabled={!history.length}>
        {children}
      </DialogTrigger>
      <DialogContent presentation='reference' className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>{t('claimRequests.statusHistory.title')}</DialogTitle>
          <DialogDescription>
            {t('claimRequests.statusHistory.description')}
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[60vh] overflow-auto pe-4'>
          <ol className='space-y-0'>
            {history.map((entry, index) => {
              const isLatest = index === 0
              const displayedStatus = isLatest
                ? getClaimRequestDisplayStatus({
                    status: status ?? entry.status,
                    extPaymentDate,
                  })
                : entry.status
              const statusColor = isLatest
                ? getClaimRequestDisplayStatusColor(displayedStatus)
                : entry.status
              const Icon = getIcon(statusColor)
              const formattedTimestamp = formatDateTime(
                entry.timestamp,
                'HH:mm yyyy/MM/dd',
                {
                  language: i18n.language,
                  normalizeTimezone: false,
                  invalidDate: 'throw',
                }
              )
              const statusLabel = getStatusLabel(displayedStatus)
              const userLabel = getUserLabel(entry)

              return (
                <li
                  key={`${entry.status ?? 'status'}-${entry.timestamp ?? index}`}
                  className='relative flex gap-3 pb-6 last:pb-0'
                >
                  {index < history.length - 1 && (
                    <span className='absolute bottom-0 top-10 h-full w-px bg-border ltr:left-5 rtl:right-5' />
                  )}
                  <span
                    className={cn(
                      'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 ring-4 ring-dialog-background',
                      isLatest && statusColor && claimStatusColors[statusColor]
                    )}
                  >
                    <Icon className='h-5 w-5' />
                  </span>
                  <div
                    className={cn(
                      'min-w-0 flex-1 rounded-lg border bg-background p-3 text-sm shadow-sm',
                      isLatest && statusColor && claimStatusColors[statusColor]
                    )}
                  >
                    <div className='flex flex-wrap items-start justify-between gap-2'>
                      <p className={cn('font-medium')}>{statusLabel}</p>
                      {formattedTimestamp && (
                        <time className='text-xs'>{formattedTimestamp}</time>
                      )}
                    </div>
                    {userLabel && (
                      <p className='mt-2 text-xs'>
                        {t('claimRequests.statusHistory.user', {
                          userId: String(userLabel),
                        })}
                      </p>
                    )}
                    {entry.notes && (
                      <p className='mt-2 whitespace-pre-wrap text-xs text-muted-foreground'>
                        {entry.notes}
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  )
}
