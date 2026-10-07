import { useEffect, useMemo } from 'react'

import AssessmentItemsFormJawsHalfPermanent from '@features/assessment-items/components/assessment-item-form/assessment-items-form-jaws-half-permanent.tsx'
import AssessmentItemsFormToothNumbers from '@features/assessment-items/components/assessment-item-form/assessment-items-form-tooth-numbers.tsx'
import AssessmentItemsFormToothType from '@features/assessment-items/components/assessment-item-form/assessment-items-form-tooth-type.tsx'
import {
  type AssessmentItemFormType,
  type AssessmentItemToothType,
} from '@features/assessment-items/model/assessment-item-form-contract'
import { type DamageCode } from '@iap/api-types'
import { Permission } from '@iap/ui'
import { useFormContext, useWatch } from 'react-hook-form'

function AssessmentItemsFormTooth() {
  const {
    control,
    formState: { errors },
  } = useFormContext<AssessmentItemFormType>()

  const damageCode = useWatch<AssessmentItemFormType>({
    control,
    name: 'damageCode',
  }) as DamageCode

  const toothType = useWatch<AssessmentItemFormType>({
    control,
    name: 'toothType',
  }) as AssessmentItemToothType

  const hasTooth = useMemo(() => {
    return damageCode?.isDentalService === 1
  }, [damageCode?.isDentalService])

  useEffect(() => {
    if (hasTooth) {
      // const list = document.getElementById('assessment-items-list')
      // list?.scrollTo({ top: 200 })
    }
  }, [hasTooth])

  if (!hasTooth) return null

  return (
    <div>
      <AssessmentItemsFormToothType />
      <AssessmentItemsFormToothNumbers />
      <Permission hasPermission={toothType === 'PERMANENT'}>
        <AssessmentItemsFormJawsHalfPermanent />
      </Permission>
      {errors?.toothNumbers?.message && (
        <p className='mt-3 text-xs text-destructive'>
          {errors?.toothNumbers?.message}
        </p>
      )}
    </div>
  )
}

export default AssessmentItemsFormTooth
