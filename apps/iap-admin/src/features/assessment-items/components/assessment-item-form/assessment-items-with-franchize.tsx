import { type AssessmentItemFormType } from '@features/assessment-items/model/assessment-item-form-contract'
import { FormField, FormItem, FormLabel } from '@iap/forms'
import { Checkbox } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useFormContext } from 'react-hook-form'

// interface AssessmentItemsWithFranchizeProps {
//   calculateMutation: UseMutationResult<
//     PaymentCalculationResponse | undefined,
//     unknown,
//     PaymentCalculationRequest,
//     unknown
//   >
// }

export function AssessmentItemsWithFranchize() {
  const { t } = useTranslate()
  const { control } = useFormContext<AssessmentItemFormType>()
  // const franchizeDeductionAmountValue = useWatch({
  //   control: control,
  //   name: 'franchizeDeductionAmount',
  // })

  return (
    <FormField
      control={control}
      name='withFranchize'
      render={({ field }) => (
        <FormItem className='flex items-center gap-2'>
          <Checkbox
            id={field.name}
            checked={field.value ?? false}
            onCheckedChange={field.onChange}
            className='border-text-primary'
          />
          <FormLabel
            htmlFor={field.name}
            className='m-0 cursor-pointer whitespace-nowrap'
          >
            {t('assessmentItems.dialog.fields.withFranchise')}
          </FormLabel>
        </FormItem>
      )}
    />
  )
}
