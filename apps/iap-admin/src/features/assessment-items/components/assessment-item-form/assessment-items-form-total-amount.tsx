import { useEffect } from 'react'

import { type AssessmentItemFormType } from '@features/assessment-items/model/assessment-item-form-contract'
import { useFormContext, useWatch } from 'react-hook-form'

function AssessmentItemsFormTotalAmount() {
  const { control, setValue } = useFormContext<AssessmentItemFormType>()
  const amountItem = useWatch<AssessmentItemFormType>({
    control,
    name: 'amountItem',
  }) as string

  const quantity = useWatch<AssessmentItemFormType>({
    control,
    name: 'quantity',
  }) as string

  const estimatedAmount = useWatch<AssessmentItemFormType>({
    control,
    name: 'estimatedAmount',
  }) as number

  useEffect(() => {
    if (amountItem && quantity) {
      setValue('estimatedAmount', Number(amountItem) * Number(quantity))
    }
  }, [amountItem, quantity, setValue])

  if (!quantity || !amountItem) return null
  return (
    <div className='flex max-h-22 flex-1 flex-col items-end justify-center text-sm font-medium'>
      <div className='flex gap-x-0.5'>
        <span className='text-primary-700'>
          {estimatedAmount.toLocaleString('en-US')}
        </span>
        <span>=</span>
        <span className='text-orange-700'>{quantity}</span>
        <span>x</span>
        <span className='text-green-700'>
          {Number(amountItem).toLocaleString('en-US')}
        </span>
      </div>
    </div>
  )
}

export default AssessmentItemsFormTotalAmount
