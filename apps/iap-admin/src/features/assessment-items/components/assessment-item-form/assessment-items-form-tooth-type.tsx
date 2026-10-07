import { useMemo } from 'react'

import { getAgreementItemsToothTypeOptions } from '@features/assessment-items/constants/assessment-items-constant'
import { type AssessmentItemFormType } from '@features/assessment-items/model/assessment-item-form-contract'
import { type DamageCode } from '@iap/api-types'
import { FormField, FormItem, FormLabel } from '@iap/forms'
import { RadioGroup, RadioGroupItem } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useFormContext, useWatch } from 'react-hook-form'

function AssessmentItemsFormToothType() {
  const { t } = useTranslate()
  const { control, setValue } = useFormContext<AssessmentItemFormType>()

  const damageCode = useWatch<AssessmentItemFormType>({
    control,
    name: 'damageCode',
  }) as DamageCode

  const hasTooth = useMemo(() => {
    return damageCode?.isDentalService === 1
  }, [damageCode?.isDentalService])

  if (!hasTooth) return null

  return (
    <FormField
      control={control}
      name='toothType'
      render={({ field }) => (
        <FormItem className='my-3 space-y-2'>
          <RadioGroup
            id={field.name}
            onValueChange={(value) => {
              setValue('toothNumbers', [])
              field.onChange(value)
            }}
            value={field.value}
            className='flex flex-wrap items-center'
          >
            {getAgreementItemsToothTypeOptions(t).map((option) => (
              <div key={option.value} className='flex items-center'>
                <RadioGroupItem id={option.value} value={option.value} />
                <FormLabel
                  htmlFor={option.value}
                  className='cursor-pointer pr-2 text-xs'
                >
                  {option.label}
                </FormLabel>
              </div>
            ))}
          </RadioGroup>
        </FormItem>
      )}
    />
  )
}

export default AssessmentItemsFormToothType
