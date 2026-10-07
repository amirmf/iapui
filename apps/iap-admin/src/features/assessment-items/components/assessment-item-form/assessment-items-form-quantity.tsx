import { useEffect, useMemo, useRef } from 'react'

import { type AssessmentItemFormType } from '@features/assessment-items/model/assessment-item-form-contract'
import { type DamageCode } from '@iap/api-types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { Input } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useFormContext, useWatch } from 'react-hook-form'

function AssessmentItemsFormQuantity() {
  const { t } = useTranslate()
  const { control, setValue } = useFormContext<AssessmentItemFormType>()
  const inputRef = useRef<HTMLInputElement>(null)

  const damageCode = useWatch<AssessmentItemFormType>({
    control,
    name: 'damageCode',
  }) as DamageCode

  const toothNumbers = useWatch<AssessmentItemFormType>({
    control,
    name: 'toothNumbers',
  }) as number[] | undefined

  const hasTooth = useMemo(() => {
    return damageCode?.isDentalService === 1
  }, [damageCode?.isDentalService])

  useEffect(() => {
    if (hasTooth && toothNumbers) {
      setValue('quantity', toothNumbers.length.toString())
    }
  }, [hasTooth, setValue, toothNumbers])

  return (
    <FormField
      control={control}
      name='quantity'
      render={({ field }) => (
        <FormItem className='flex flex-col'>
          <FormLabel>{t('assessmentItems.dialog.fields.quantity')}</FormLabel>
          <FormControl>
            <Input
              {...field}
              ref={inputRef}
              className='w-10 px-1.5 text-center'
              maxLength={3}
              numerical
              value={field.value}
              disabled={hasTooth}
              onFocus={() => {
                inputRef.current?.select()
              }}
              onChange={(event) => {
                field.onChange(event)
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default AssessmentItemsFormQuantity
