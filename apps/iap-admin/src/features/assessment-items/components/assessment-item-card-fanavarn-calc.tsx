import { useMemo } from 'react'

import { formatAssessmentAmount as formatAmount } from '@features/assessment-items/components/format-assessment-amount'
import type { DmgCase } from '@iap/api-types'
import { cn } from '@iap/ui'
import { useTranslation } from 'react-i18next'

interface AssessmentItemCardFanavarnCalcProps {
  calculationResults: DmgCase[]
}

function AssessmentItemCardFanavarnCalc(
  props: AssessmentItemCardFanavarnCalcProps
) {
  const { calculationResults } = props
  const { t } = useTranslation()

  const calculationRows = useMemo(
    () =>
      calculationResults.map((calculationResult) => [
        {
          label: t('assessmentItems.fanavarnCalc.approvedAmount'),
          value: formatAmount(calculationResult.approvedAmount),
          // valueClass: 'font-semibold text-green-600 dark:text-green-400',
        },
        {
          label: t('assessmentItems.fanavarnCalc.franchize'),
          value: formatAmount(calculationResult.franchise),
          valueClass: 'text-destructive',
        },
        // {
        //   label: t('assessmentItems.fanavarnCalc.deductionAmount'),
        //   value: formatAmount(calculationResult.deductionAmount),
        //   valueClass: 'text-destructive',
        // },
        {
          label: t('assessmentItems.fanavarnCalc.totalAmount'),
          value: formatAmount(calculationResult.totalAmount),
          valueClass: 'font-semibold text-green-600 dark:text-green-400',
        },
      ]),
    [calculationResults, t]
  )

  if (!calculationRows.length) {
    return null
  }

  return (
    <>
      <div className='mb-2 mt-3 flex items-center justify-between border-b border-border pb-2 text-sm'>
        <p className='font-medium text-sky-700'>
          {t('assessmentItems.fanavarnCalc.title')}
        </p>
      </div>
      <div className='space-y-2'>
        {calculationRows.map((rowData, index) => (
          <div
            key={index}
            className='grid grid-cols-2 gap-4 rounded bg-sky-50 p-2 text-sm'
          >
            {rowData.map(({ label, value, valueClass }) => {
              if (!value) return null
              return (
                <div
                  key={label}
                  className='flex items-center justify-between gap-1'
                >
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
        ))}
      </div>
    </>
  )
}

export default AssessmentItemCardFanavarnCalc
