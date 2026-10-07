import { useMemo } from 'react'

import { AssessmentItemsToothChart } from '@features/assessment-items/components/assessment-item-form/assessment-items-tooth-chart.tsx'
import { type AssessmentItemFormType } from '@features/assessment-items/model/assessment-item-form-contract'
import { type DamageCode } from '@iap/api-types'
import { useFormContext, useWatch } from 'react-hook-form'

function AssessmentItemsFormToothNumbers() {
  const { control } = useFormContext<AssessmentItemFormType>()
  const damageCode = useWatch<AssessmentItemFormType>({
    control,
    name: 'damageCode',
  }) as DamageCode

  const hasTooth = useMemo(() => {
    return damageCode?.isDentalService === 1
  }, [damageCode?.isDentalService])

  if (!hasTooth) return null

  return (
    <>
      <AssessmentItemsFormToothNumbersContent />
    </>
  )
}

export default AssessmentItemsFormToothNumbers

function AssessmentItemsFormToothNumbersContent() {
  const { control, setValue } = useFormContext<AssessmentItemFormType>()
  const selectedToothNumber = useWatch({
    control,
    name: 'toothNumbers',
  })
  const toothType = useWatch({
    control,
    name: 'toothType',
  })
  const isChild = useMemo(() => toothType === 'DECIDUOUS', [toothType])

  return (
    <>
      <AssessmentItemsToothChart
        isChild={isChild}
        value={selectedToothNumber ?? null}
        onSelect={(number) => {
          setValue('toothNumbers', number)
        }}
      />
    </>
  )
}
