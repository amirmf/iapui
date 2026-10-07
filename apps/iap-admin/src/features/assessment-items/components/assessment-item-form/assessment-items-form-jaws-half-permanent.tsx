import { type AssessmentItemFormType } from '@features/assessment-items/model/assessment-item-form-contract'
import { cn } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useFormContext, useWatch } from 'react-hook-form'

const jawsHalf = [906, 904, 902, 90, 91, 92] as const

function AssessmentItemsFormJawsHalfPermanent() {
  const { t } = useTranslate()
  const { control, setValue } = useFormContext<AssessmentItemFormType>()
  const selectedToothNumbers = useWatch<AssessmentItemFormType>({
    control,
    name: 'toothNumbers',
  }) as number[] | undefined | null

  return (
    <div className='mt-3 flex flex-wrap items-center gap-2'>
      {jawsHalf.map((jaw) => {
        const isSelected = selectedToothNumbers?.includes(jaw)
        return (
          <button
            key={jaw}
            type='button'
            aria-pressed={isSelected}
            aria-label={`tooth ${jaw}`}
            onClick={() => {
              if (isSelected) {
                setValue('toothNumbers', [])
              } else {
                setValue('toothNumbers', [jaw])
              }
            }}
            className={cn(
              'rounded border border-border px-2 text-gray-600',
              isSelected && 'bg-primary/10 text-primary'
            )}
          >
            <span className='whitespace-nowrap text-xs font-semibold'>
              {t(
                `assessmentItems.dialog.toothAssessment.fields.jawQuarters.${jaw}`
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default AssessmentItemsFormJawsHalfPermanent
