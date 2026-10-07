import { FanhubTaminDrugPrescriptionCard } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/fanhub-tamin-prescription-section/fanhub-tamin-drug-prescription/fanhub-tamin-drug-prescription-card'
import { FanhubTaminDrugPrescriptionFinancialDetails } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/fanhub-tamin-prescription-section/fanhub-tamin-drug-prescription/fanhub-tamin-drug-prescription-financial-details'
import { FanhubTaminDrugPrescriptionSkeleton } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/fanhub-tamin-prescription-section/fanhub-tamin-drug-prescription/fanhub-tamin-drug-prescription-skeleton'
import {
  type FinancialField,
  calculateFinancialTotals,
  displayValue,
} from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/fanhub-tamin-prescription-section/fanhub-tamin-drug-prescription/fanhub-tamin-drug-prescription-utils'
import type { FanhubDrugPrescription } from '@iap/api-types'
import { Card, CardContent, CardHeader } from '@iap/ui'
import { Separator } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'

type FanhubTaminDrugPrescriptionProps = {
  items: FanhubDrugPrescription[]
  isLoading: boolean
  emptyMessage: string
}

export function FanhubTaminDrugPrescription(
  props: FanhubTaminDrugPrescriptionProps
) {
  const { items, isLoading, emptyMessage } = props
  const { t } = useTranslation()
  const notAvailable = t('common.notAvailable')

  if (isLoading) return <FanhubTaminDrugPrescriptionSkeleton />

  if (items.length === 0) {
    return (
      <div className='rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground'>
        {emptyMessage}
      </div>
    )
  }

  const firstItem = items[0]
  const metadata = [
    {
      label: t('claimRequests.taminPrescriptions.fields.prescDate'),
      value: firstItem.prescDate,
    },
    {
      label: t('claimRequests.taminPrescriptions.fields.patientName'),
      value: firstItem.patientName,
    },
    {
      label: t('claimRequests.taminPrescriptions.fields.patientID'),
      value: firstItem.patientID,
    },
    {
      label: t('claimRequests.taminPrescriptions.fields.docName'),
      value: firstItem.docName,
    },
    {
      label: t('claimRequests.taminPrescriptions.fields.specDesc'),
      value: firstItem.specDesc,
    },
  ].filter((item) => displayValue(item.value, '') !== '')

  const totalLabels: Record<FinancialField, string> = {
    phaPrice: t('claimRequests.taminPrescriptions.totalPhaPrice'),
    phaRequestPrice: t('claimRequests.taminPrescriptions.totalPhaRequestPrice'),
    insurancePayment: t(
      'claimRequests.taminPrescriptions.totalInsurancePayment'
    ),
    ssoPayment: t('claimRequests.taminPrescriptions.totalSsoPayment'),
  }

  return (
    <Card className='gap-0 overflow-hidden border-0 py-0 shadow-none'>
      <CardHeader className='bg-muted/30 px-2 sm:px-4'>
        {metadata.length > 0 && (
          <dl className='grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3'>
            {metadata.map(({ label, value }) => (
              <div key={label} className='flex min-w-0 gap-2'>
                <dt className='shrink-0 text-muted-foreground'>{label}:</dt>
                <dd className='min-w-0 break-words font-medium'>
                  {displayValue(value, notAvailable)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </CardHeader>

      <Separator />

      <CardContent className='my-5 grid gap-3 px-2 sm:px-4 md:grid-cols-2 xl:grid-cols-3'>
        {items.map((item, index) => (
          <FanhubTaminDrugPrescriptionCard
            key={item.id ?? `${item.srvCode}-${index}`}
            item={item}
          />
        ))}
      </CardContent>

      <Separator />

      <CardContent className='bg-muted/30 px-2 py-3 sm:px-4'>
        <h3 className='mb-3 font-semibold'>
          {t('claimRequests.taminPrescriptions.financialSummary')}
        </h3>
        <FanhubTaminDrugPrescriptionFinancialDetails
          values={calculateFinancialTotals(items)}
          labels={totalLabels}
          notAvailable={notAvailable}
          isSummary
        />
      </CardContent>
    </Card>
  )
}
