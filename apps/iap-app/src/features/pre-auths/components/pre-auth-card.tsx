import type { PreAuth } from '@iap/api-types'
import { Badge, Card, CardContent, cn } from '@iap/ui'
import { useTranslation } from 'react-i18next'

import {
  PRE_AUTH_STATUS_TRANSLATION_KEYS,
  type PreAuthStatus,
  preAuthStatusBorderColors,
  preAuthStatusColors,
} from '../constants/pre-auth-status-constant'
import { formatAmount } from '../utils/format-amount'

export interface PreAuthCardProps {
  preAuth: PreAuth
}

interface DetailRowProps {
  classNameValue?: string
  label: string
  value?: string | number | null
}

function DetailRow({ classNameValue, label, value }: DetailRowProps) {
  const displayValue =
    value === null || value === undefined || value === '' ? '-' : value

  return (
    <div className='flex gap-1 text-xs'>
      <dt className='font-medium text-muted-foreground'>{label}</dt>
      <dd
        className={cn('min-w-0 break-words font-semibold', classNameValue)}
        title={displayValue !== '-' ? String(displayValue) : undefined}
      >
        {displayValue}
      </dd>
    </div>
  )
}

export function PreAuthCard({ preAuth }: PreAuthCardProps) {
  const { t } = useTranslation()

  const statusValue = preAuth.status as PreAuthStatus | undefined

  return (
    <Card
      className={cn(
        'h-full w-full border py-2 shadow-none',
        statusValue &&
          Object.prototype.hasOwnProperty.call(
            PRE_AUTH_STATUS_TRANSLATION_KEYS,
            statusValue
          )
          ? preAuthStatusBorderColors[statusValue]
          : 'border-primary-300'
      )}
    >
      <CardContent className='px-3'>
        <div className='flex items-center justify-between gap-3 pb-2'>
          <dt className='text-sm font-medium'>
            {`${preAuth.illnessDesc} (${preAuth.illnessId})`}
          </dt>
          <dd>
            <Badge
              className={cn(
                statusValue &&
                  Object.prototype.hasOwnProperty.call(
                    PRE_AUTH_STATUS_TRANSLATION_KEYS,
                    statusValue
                  )
                  ? preAuthStatusColors[statusValue]
                  : ''
              )}
              variant='outline'
            >
              {statusValue &&
              Object.prototype.hasOwnProperty.call(
                PRE_AUTH_STATUS_TRANSLATION_KEYS,
                statusValue
              )
                ? t(PRE_AUTH_STATUS_TRANSLATION_KEYS[statusValue])
                : '-'}
            </Badge>
          </dd>
        </div>
        <div className='space-y-3 py-3'>
          <div className='flex justify-between'>
            <DetailRow
              label={t('myiap.preAuths.fields.amount')}
              value={formatAmount(preAuth.amount)}
            />
            <DetailRow
              label={t('myiap.preAuths.fields.franchise')}
              value={formatAmount(preAuth.franchise)}
            />
          </div>
          <div className='flex justify-between'>
            <DetailRow
              classNameValue='whitespace-nowrap'
              label={t('myiap.preAuths.fields.issueDate')}
              value={preAuth.issuDate}
            />
            <DetailRow
              classNameValue='whitespace-nowrap'
              label={t('myiap.preAuths.fields.receptionDate')}
              value={preAuth.receptionDate}
            />
          </div>
          <div className='flex flex-col justify-between gap-y-2 min-[360px]:flex-row min-[360px]:gap-y-0'>
            <DetailRow
              classNameValue='whitespace-nowrap'
              label={t('myiap.preAuths.fields.validityBeginDate')}
              value={preAuth.preAuthValidityBeginDate}
            />
            <DetailRow
              classNameValue='whitespace-nowrap'
              label={t('myiap.preAuths.fields.validityEndDate')}
              value={preAuth.preAuthValidityEndDate}
            />
          </div>
          <DetailRow
            label={t('myiap.preAuths.fields.description')}
            value={preAuth.desc}
          />
        </div>
      </CardContent>
    </Card>
  )
}
