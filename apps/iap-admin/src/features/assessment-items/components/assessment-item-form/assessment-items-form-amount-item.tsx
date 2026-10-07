import { type AssessmentItemFormType } from '@features/assessment-items/model/assessment-item-form-contract'
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

function AssessmentItemsFormAmountItem() {
  const { t } = useTranslate()
  const { control } = useFormContext<AssessmentItemFormType>()
  const overrideRatio = useWatch<AssessmentItemFormType>({
    control,
    name: 'overrideRatio',
  }) as number | null

  return (
    <div className='w-full max-w-40'>
      <FormField
        control={control}
        name='amountItem'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='whitespace-nowrap'>
              {t('assessmentItems.dialog.fields.amountItem')}
              {overrideRatio != null ? (
                <span className='ms-1 text-xs font-normal text-muted-foreground'>
                  {t('assessmentItems.dialog.fields.amountItemOverrideRatio', {
                    overrideRatio,
                  })}
                </span>
              ) : null}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                maxLength={11}
                value={field.value}
                onChange={field.onChange}
                numberWithComma
              />
            </FormControl>
            <FormMessage className='text-xs' />
          </FormItem>
        )}
      />
    </div>
  )
}

export default AssessmentItemsFormAmountItem
