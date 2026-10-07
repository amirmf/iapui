import { formatPrescriptionAmount as formatAmount } from '@features/claim-requests/model/claim-request-management-format'
import { displayValue } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/fanhub-tamin-prescription-section/fanhub-tamin-drug-prescription/fanhub-tamin-drug-prescription-utils'
import type { FanhubDrugPrescription } from '@iap/api-types'
import { cn } from '@iap/ui'
import { Card, CardContent } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'

type FanhubTaminDrugPrescriptionCardProps = {
  item: FanhubDrugPrescription
}

type DetailRowProps = {
  label: string
  value?: string | number | null
  classNameValue?: string
}

function DetailRow(props: DetailRowProps) {
  const { label, value, classNameValue } = props
  const valueText =
    value === null || value === undefined ? '' : String(value).trim()
  const displayText = valueText || '-'

  return (
    <div className='flex min-w-0 gap-1 text-xs'>
      <dt className='shrink-0 font-medium text-muted-foreground'>{label}</dt>
      <dd
        className={cn('min-w-0 break-words font-semibold', classNameValue)}
        title={displayText !== '-' ? displayText : undefined}
      >
        {displayText}
      </dd>
    </div>
  )
}

export function FanhubTaminDrugPrescriptionCard(
  props: FanhubTaminDrugPrescriptionCardProps
) {
  const { item } = props
  const { t } = useTranslation()
  const notAvailable = t('common.notAvailable')

  return (
    <Card className='h-full w-full border-gray-400 py-2 shadow-none'>
      <CardContent className='space-y-2 px-3'>
        <div className='min-w-0 break-words text-sm font-medium'>
          {displayValue(
            `${item.srvNameMain || item.srvName} (${displayValue(item.srvCode, '-')})`,
            notAvailable
          )}
        </div>

        <dl className='space-y-3 py-1'>
          <div className='flex flex-col justify-between gap-y-3 min-[420px]:flex-row min-[420px]:gap-x-4 min-[420px]:gap-y-0'>
            <DetailRow
              label={t('claimRequests.taminPrescriptions.fields.druqAmt')}
              value={item.druqAmt}
            />
            <DetailRow
              label={t('claimRequests.taminPrescriptions.drugQuantity')}
              value={item.qtyPha ?? item.qtyDoc}
              classNameValue='whitespace-nowrap'
            />
          </div>
          <DetailRow
            label={t('claimRequests.taminPrescriptions.fields.drgUsg')}
            value={item.drgUsg}
          />
          <div className='flex flex-col justify-between gap-y-3 min-[420px]:flex-row min-[420px]:gap-x-4 min-[420px]:gap-y-0'>
            <DetailRow
              label={t('claimRequests.taminPrescriptions.fields.phaPrice')}
              value={formatAmount(item.phaPrice)}
            />
            <DetailRow
              label={t(
                'claimRequests.taminPrescriptions.fields.phaRequestPrice'
              )}
              value={formatAmount(item.phaRequestPrice)}
            />
          </div>
          <div className='flex flex-col justify-between gap-y-3 min-[420px]:flex-row min-[420px]:gap-x-4 min-[420px]:gap-y-0'>
            <DetailRow
              label={t(
                'claimRequests.taminPrescriptions.fields.insurancePayment'
              )}
              value={formatAmount(item.insurancePayment)}
            />
            <DetailRow
              label={t('claimRequests.taminPrescriptions.fields.ssoPayment')}
              value={formatAmount(item.ssoPayment)}
            />
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
