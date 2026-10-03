import { useMemo } from 'react'
import type { ReactNode } from 'react'

import { damageCodePriceTypeTranslationKeys } from '@features/damage-codes/constants/damage-code-options'
import type { DamageCodePricing, PriceType } from '@iap/api-types'
import {
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  formatDateTime,
} from '@iap/ui'
import { useTranslation } from 'react-i18next'

export function DamageCodePricingViewDialog(props: {
  onOpenChange: (open: boolean) => void
  open: boolean
  pricing: DamageCodePricing
}) {
  const { onOpenChange, open, pricing } = props
  const { t } = useTranslation()
  const priceTypeLabel = useMemo(
    () =>
      t(
        damageCodePriceTypeTranslationKeys[
          pricing.priceType as PriceType
        ] as never
      ),
    [pricing.priceType, t]
  )

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t('damageCodePricings.view.title')}</DialogTitle>
          <DialogDescription>
            {t('damageCodePricings.view.description')}
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-1 rounded-lg border bg-muted/40 p-4'>
            <p className='text-sm font-medium text-muted-foreground'>
              {t('damageCodePricings.columns.damageCode')}
            </p>
            <p className='text-base font-semibold'>
              {pricing.damageCode?.code ?? pricing.damageCodeId ?? '-'}
            </p>
            {pricing.damageCode?.title ? (
              <p className='text-sm text-muted-foreground'>
                {pricing.damageCode.title}
              </p>
            ) : null}
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Detail label={t('damageCodePricings.columns.priceType')}>
              <Badge className='w-fit' variant='outline'>
                {priceTypeLabel}
              </Badge>
            </Detail>
            <Detail
              label={t('damageCodePricings.columns.amount')}
              value={pricing.amount.toLocaleString()}
            />
            <Detail
              label={t('damageCodePricings.columns.unit')}
              value={pricing.unit || t('common.notAvailable')}
            />
            <Detail
              label={t('damageCodePricings.columns.fromDate')}
              value={formatDateTime(pricing.fromDate, 'PPpp')}
            />
            <Detail
              label={t('damageCodePricings.columns.thruDate')}
              value={formatDateTime(pricing.thruDate, 'PPpp')}
            />
            <Detail
              label={t('damageCodePricings.columns.updatedAt')}
              value={formatDateTime(pricing.updatedAt, 'PPpp')}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Detail(props: {
  children?: ReactNode
  label: string
  value?: string
}) {
  const { children, label, value } = props
  return (
    <div className='space-y-1'>
      <p className='text-sm font-medium text-muted-foreground'>{label}</p>
      {children ?? <p className='text-base'>{value ?? '-'}</p>}
    </div>
  )
}
