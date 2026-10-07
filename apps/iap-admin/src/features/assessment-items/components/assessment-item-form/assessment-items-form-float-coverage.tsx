import { useEffect, useMemo } from 'react'

import { type AssessmentItemFormType } from '@features/assessment-items/model/assessment-item-form-contract'
import { claimRequestService } from '@features/claim-requests'
import { type DamageCode } from '@iap/api-types'
import { FormField, FormItem, FormLabel, FormMessage } from '@iap/forms'
import { Checkbox } from '@iap/ui'
import { SingleSelect } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useQuery } from '@tanstack/react-query'
import { useFormContext, useWatch } from 'react-hook-form'

interface AssessmentItemsFormFloatCoverageProps {
  claimRequestId: string
  isToothDocType?: boolean
}

export function AssessmentItemsFormFloatCoverage(
  props: AssessmentItemsFormFloatCoverageProps
) {
  const { isToothDocType } = props
  const { control } = useFormContext<AssessmentItemFormType>()

  const damageCode = useWatch<AssessmentItemFormType>({
    control,
    name: 'damageCode',
  }) as DamageCode

  if (!isToothDocType) return null
  if (damageCode.code !== '8356') return null
  return <AssessmentItemsFormFloatCoverageContent {...props} />
}

function AssessmentItemsFormFloatCoverageContent(
  props: AssessmentItemsFormFloatCoverageProps
) {
  const { claimRequestId } = props
  const { t } = useTranslate()
  const { control, setValue } = useFormContext<AssessmentItemFormType>()

  const useFloatCoverage = useWatch({
    control,
    name: 'useFloatCoverage',
  })

  const { data, isPending } = useQuery({
    queryKey: ['claimRequestSubInsuredPeople', claimRequestId],
    queryFn: ({ signal }) =>
      claimRequestService.getSubInsuredPeople(claimRequestId, { signal }),
    enabled: !!claimRequestId && !!useFloatCoverage,
  })

  useEffect(() => {
    return () => {
      setValue('useFloatCoverage', false)
      setValue('overrideInsuredPersonId', null)
    }
  }, [setValue])

  const items = useMemo(
    () =>
      data
        ?.filter((item) => item.id != null)
        .map((item) => ({
          value: String(item.id),
          label:
            item.fullName || item.nationalCode
              ? [item.fullName, item.nationalCode].filter(Boolean).join(' - ')
              : String(item.id),
        })),
    [data]
  )

  return (
    <div className='space-y-4'>
      <FormField
        control={control}
        name='useFloatCoverage'
        render={({ field }) => (
          <FormItem className='flex items-center gap-2'>
            <Checkbox
              id={field.name}
              checked={field.value ?? false}
              onCheckedChange={(checked) => {
                const isChecked = checked === true
                field.onChange(isChecked)
                if (!isChecked) {
                  setValue('overrideInsuredPersonId', null)
                }
              }}
              className='border-text-primary'
            />
            <FormLabel
              htmlFor={field.name}
              className='m-0 cursor-pointer whitespace-nowrap'
            >
              {t('assessmentItems.dialog.fields.useFloatCoverage')}
            </FormLabel>
          </FormItem>
        )}
      />

      {useFloatCoverage && (
        <FormField
          control={control}
          name='overrideInsuredPersonId'
          render={({ field }) => (
            <FormItem className='min-w-52 flex-1'>
              <SingleSelect
                presentation='reference'
                selectText={t('common.select')}
                loadingText={t('common.loading')}
                emptyText={t('common.noResults')}
                clearText={t('common.clear')}
                value={field.value != null ? String(field.value) : undefined}
                onChange={(value) => field.onChange(Number(value))}
                items={items}
                isLoading={isPending}
                placeholder={t(
                  'assessmentItems.dialog.fields.overrideInsuredPersonId'
                )}
                className='w-full'
              />
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}
