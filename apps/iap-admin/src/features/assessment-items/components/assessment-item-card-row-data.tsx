import { useMemo } from 'react'

import { formatAssessmentAmount as formatAmount } from '@features/assessment-items/components/format-assessment-amount'
import { cn } from '@iap/ui'
import { useTranslation } from 'react-i18next'

interface AssessmentItemCardRowDataProps {
  estimatedAmount?: number | null
  quantity?: number | null
  franchizeDeductionAmount?: number | null
  remainCoverageAmount?: number | null
  amount?: number | null
  toothNumber?: number | null
  toothNumbers?: number[] | null
  floatingCoverage?: string
  className?: string
}

function AssessmentItemCardRowData(props: AssessmentItemCardRowDataProps) {
  const {
    franchizeDeductionAmount,
    estimatedAmount,
    amount,
    remainCoverageAmount,
    toothNumber,
    toothNumbers,
    floatingCoverage,
    quantity,
    className,
  } = props
  const { t } = useTranslation()

  const rowData = useMemo(
    () => [
      {
        label: t('assessmentItems.dialog.fields.estimatedAmount'),
        value: (
          <>
            <span className='me-1'>{formatAmount(estimatedAmount)}</span>
            <span className='text-xs font-normal'>
              ({`${formatAmount(quantity || 1)}عدد`})
            </span>
          </>
        ),
      },
      {
        label: t('assessmentItems.dialog.fields.franchizeDeductionAmount'),
        value: formatAmount(franchizeDeductionAmount),
        valueClass: 'text-destructive',
      },
      {
        label: t('assessmentItems.dialog.fields.remainCoverageAmount'),
        value: formatAmount(remainCoverageAmount),
      },
      {
        label: t('assessmentItems.dialog.fields.amountPaid'),
        value: formatAmount(amount),
        valueClass: 'font-semibold text-green-600 dark:text-green-400',
      },
      {
        label: t('assessmentItems.dialog.fields.floatCoverage'),
        value: floatingCoverage,
      },
      {
        label: t('assessmentItems.dialog.fields.toothNumbers'),
        value:
          toothNumber ||
          (toothNumbers?.length === 1 && toothNumbers[0] >= 90
            ? t(
                `assessmentItems.dialog.toothAssessment.fields.jawQuarters.${toothNumbers[0]}` as never
              )
            : toothNumbers?.join(', ')),
      },
    ],
    [
      amount,
      estimatedAmount,
      floatingCoverage,
      franchizeDeductionAmount,
      quantity,
      remainCoverageAmount,
      t,
      toothNumber,
      toothNumbers,
    ]
  )

  return (
    <div className={cn('grid grid-cols-2 gap-4 text-sm', className)}>
      {rowData.map(({ label, value, valueClass }) => {
        if (!value) return null
        return (
          <div key={label} className='flex items-center justify-between gap-1'>
            <p className='text-sm text-muted-foreground'>{label}</p>
            <p
              className={cn(
                'flex-1 text-left text-sm font-medium tabular-nums',
                value === '-' && 'text-muted-foreground',
                valueClass
              )}
            >
              {value}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default AssessmentItemCardRowData
