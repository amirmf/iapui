import { formatAssessmentAmount as formatAmount } from '@features/assessment-items/components/format-assessment-amount'
import {
  PRE_AUTH_STATUS_TRANSLATION_KEYS,
  type PreAuthStatus,
  preAuthStatusBorderColors,
  preAuthStatusColors,
} from '@features/assessment-items/constants/pre-auth-status-constant'
import type { PreAuthInquiry } from '@features/assessment-items/model/assessment-item-form-contract'
import { cn } from '@iap/ui'
import { Badge } from '@iap/ui'
import { Card, CardContent } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

interface PreAuthInquiryCardProps {
  preAuth: PreAuthInquiry
}

interface DetailRowProps {
  label: string
  value?: string | number | null
  classNameValue?: string
}

function DetailRow({ label, value, classNameValue }: DetailRowProps) {
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

export function PreAuthInquiryCard({ preAuth }: PreAuthInquiryCardProps) {
  const { t } = useTranslate()
  const fields = 'assessmentItems.preAuths.fields'
  const statusValue = preAuth.status as PreAuthStatus | undefined
  const hasKnownStatus =
    statusValue !== undefined &&
    Object.prototype.hasOwnProperty.call(
      PRE_AUTH_STATUS_TRANSLATION_KEYS,
      statusValue
    )

  return (
    <Card
      className={cn(
        'h-full w-full border py-2 shadow-none',
        hasKnownStatus
          ? preAuthStatusBorderColors[statusValue]
          : 'border-primary-300'
      )}
    >
      <CardContent className='px-3'>
        <div className='flex items-center justify-between gap-3 pb-2'>
          <dt className='text-sm font-medium'>
            {`${preAuth.illnessDesc ?? '-'} (${preAuth.illnessId ?? '-'})`}
          </dt>
          <dd>
            <Badge
              presentation='reference'
              variant='outline'
              className={cn(hasKnownStatus && preAuthStatusColors[statusValue])}
            >
              {hasKnownStatus
                ? t(PRE_AUTH_STATUS_TRANSLATION_KEYS[statusValue])
                : '-'}
            </Badge>
          </dd>
        </div>
        <div className='space-y-3 py-3'>
          <div className='flex justify-between'>
            <DetailRow
              label={t(`${fields}.amount`)}
              value={formatAmount(preAuth.amount)}
            />
            <DetailRow
              label={t(`${fields}.franchise`)}
              value={formatAmount(preAuth.franchise)}
            />
          </div>
          <div className='flex justify-between'>
            <DetailRow
              label={t(`${fields}.issuDate`)}
              value={preAuth.issuDate}
              classNameValue='whitespace-nowrap'
            />
            <DetailRow
              label={t(`${fields}.receptionDate`)}
              value={preAuth.receptionDate}
              classNameValue='whitespace-nowrap'
            />
          </div>
          <div className='flex flex-col justify-between gap-y-2 min-[360px]:flex-row min-[360px]:gap-y-0'>
            <DetailRow
              label={t(`${fields}.validityBeginDate`)}
              value={preAuth.preAuthValidityBeginDate}
              classNameValue='whitespace-nowrap'
            />
            <DetailRow
              label={t(`${fields}.validityEndDate`)}
              value={preAuth.preAuthValidityEndDate}
              classNameValue='whitespace-nowrap'
            />
          </div>
          <DetailRow label={t(`${fields}.desc`)} value={preAuth.desc} />
        </div>
      </CardContent>
    </Card>
  )
}
