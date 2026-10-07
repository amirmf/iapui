import { type AssessmentItemFormType } from '@features/assessment-items/model/assessment-item-form-contract'
import { Button } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useFormContext } from 'react-hook-form'

interface FormActionButtonsProps {
  isEdit: boolean
  onCancel: () => void
}

export function AssessmentItemsFormActionButtons({
  isEdit,
  onCancel,
}: FormActionButtonsProps) {
  const { t } = useTranslate()
  const {
    formState: { isSubmitting },
  } = useFormContext<AssessmentItemFormType>()

  // const franchizeDeductionAmount = useWatch({
  //   control,
  //   name: 'franchizeDeductionAmount',
  // })
  // const amount = useWatch({
  //   control,
  //   name: 'amount',
  // })
  //
  // const canSubmit =
  //   (franchizeDeductionAmount &&
  //     String(franchizeDeductionAmount).trim() !== '') ||
  //   (amount && String(amount).trim() !== '')

  return (
    <div className='flex justify-end gap-2'>
      <Button
        presentation='reference'
        type='button'
        variant='outline'
        onClick={onCancel}
        disabled={isSubmitting}
        size='sm'
      >
        {t('common.cancel')}
      </Button>
      <Button
        presentation='reference'
        id='assessment_items_submit'
        type='submit'
        // disabled={isLoading || !canSubmit}
        disabled={isSubmitting}
        size='sm'
        // title={
        //   !canSubmit
        //     ? t('assessmentItems.validation.franchizeDeductionAmount')
        //     : undefined
        // }
      >
        {isSubmitting
          ? t('common.loading')
          : isEdit
            ? t('common.submitEdit')
            : t('assessmentItems.actions.calculate')}
      </Button>
    </div>
  )
}
