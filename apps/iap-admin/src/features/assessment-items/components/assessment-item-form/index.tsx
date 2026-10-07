import { AssessmentItemFormDamageCodeField } from '@features/assessment-items/components/assessment-item-form/assessment-item-form-damage-code-field.tsx'
import { AssessmentItemsFormActionButtons } from '@features/assessment-items/components/assessment-item-form/assessment-items-form-action-buttons.tsx'
import AssessmentItemsFormAmountItem from '@features/assessment-items/components/assessment-item-form/assessment-items-form-amount-item.tsx'
import { AssessmentItemsFormFloatCoverage } from '@features/assessment-items/components/assessment-item-form/assessment-items-form-float-coverage.tsx'
import AssessmentItemsFormQuantity from '@features/assessment-items/components/assessment-item-form/assessment-items-form-quantity.tsx'
import { AssessmentItemsFormTariff } from '@features/assessment-items/components/assessment-item-form/assessment-items-form-tariff.tsx'
import AssessmentItemsFormTooth from '@features/assessment-items/components/assessment-item-form/assessment-items-form-tooth.tsx'
import AssessmentItemsFormTotalAmount from '@features/assessment-items/components/assessment-item-form/assessment-items-form-total-amount.tsx'
import { AssessmentItemsWithFranchize } from '@features/assessment-items/components/assessment-item-form/assessment-items-with-franchize.tsx'
import {
  type AssessmentItemFormProps,
  useAssessmentItemForm,
} from '@features/assessment-items/components/assessment-item-form/use-assessment-item-form'
import { Form } from '@iap/forms'
import { cn } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

export default function AssessmentItemForm(props: AssessmentItemFormProps) {
  const { t } = useTranslate()
  const {
    form,
    handleSubmit,
    onSubmit,
    isLoadingApiCall,
    isEdit,
    isAdjustment,
    claimRequestData,
    tariffAmountItemRemain,
    isToothDocType,
    claimRequestId,
    onReset,
    className,
  } = useAssessmentItemForm(props)
  if (isLoadingApiCall) {
    return (
      <div className='rounded-md border border-border px-2 py-5 text-center text-sm text-muted-foreground'>
        {t('common.loading')}
      </div>
    )
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={cn('space-y-4 p-2', className)}
        >
          {!isEdit && !isAdjustment && (
            <div className='text-center text-base'>
              {t('assessmentItems.dialog.formTitle')}
            </div>
          )}
          <AssessmentItemFormDamageCodeField
            claimRequestData={claimRequestData}
            isEdit={isEdit}
          />
          <div className='flex flex-wrap gap-2'>
            <AssessmentItemsFormAmountItem />
            <AssessmentItemsFormQuantity />
            <AssessmentItemsFormTotalAmount />
          </div>
          <div className='flex flex-wrap justify-between gap-4 sm:flex-nowrap sm:gap-2'>
            <AssessmentItemsFormTariff
              tariffAmountItemRemain={tariffAmountItemRemain}
              isEdit={isEdit}
              claimRequestData={claimRequestData}
            />
            <AssessmentItemsWithFranchize />
          </div>
          <AssessmentItemsFormFloatCoverage
            isToothDocType={isToothDocType}
            claimRequestId={claimRequestId}
          />
          <AssessmentItemsFormTooth />
          <AssessmentItemsFormActionButtons
            onCancel={onReset}
            isEdit={isEdit}
          />
        </form>
      </Form>
    </>
  )
}
