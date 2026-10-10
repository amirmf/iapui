import {
  type FinancialField,
  contributionFields,
  financialFields,
  normalizeFinancialValue,
} from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/fanhub-tamin-prescription-section/fanhub-tamin-drug-prescription/fanhub-tamin-drug-prescription-utils'
import { formatPrescriptionAmount as formatAmount } from '@features/claim-requests/pages/claim-request-management/model/claim-request-management-format'
import { cn } from '@iap/ui'

type FanhubTaminDrugPrescriptionFinancialDetailsProps = {
  values: Partial<Record<FinancialField, unknown>>
  labels: Record<FinancialField, string>
  notAvailable: string
  isSummary?: boolean
}

export function FanhubTaminDrugPrescriptionFinancialDetails(
  props: FanhubTaminDrugPrescriptionFinancialDetailsProps
) {
  const { values, labels, notAvailable, isSummary = false } = props
  const financialItems = financialFields.map((field) => ({
    field,
    label: labels[field],
    value: formatAmount(normalizeFinancialValue(values[field])) ?? notAvailable,
  }))

  return (
    <dl className='grid min-w-0 grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2 xl:grid-cols-4'>
      {financialItems.map(({ field, label, value }) => (
        <div
          key={field}
          className={cn(
            'flex min-w-0 items-center justify-between space-y-0.5',
            contributionFields.has(field) && 'xl:border-s xl:ps-4'
          )}
        >
          <dt className='min-w-0 text-xs leading-4 text-muted-foreground'>
            {label}
          </dt>
          <dd
            className={cn(
              'whitespace-nowrap tabular-nums',
              isSummary ? 'text-base font-bold' : 'text-sm font-semibold'
            )}
            dir='ltr'
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
