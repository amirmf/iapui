import { useEffect, useMemo } from 'react'

import type { MyClaimRequestsFilterFormValues } from '@features/my-claims/model/filter-values'
import useGetMyInsurancePolicy from '@features/my-claims/queries/use-get-my-insurance-policy'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { SearchableSelect } from '@iap/ui'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type MyClaimMyInsurancePolicyFormFieldProps = {
  label?: string
  placeholder?: string
  isRequired?: boolean
  isFilter?: boolean
}

function MyClaimMyInsurancePolicyFormField(
  props: MyClaimMyInsurancePolicyFormFieldProps
) {
  const { label, placeholder, isRequired = true } = props
  const { control, setValue } =
    useFormContext<MyClaimRequestsFilterFormValues>()
  const { t } = useTranslation()
  const { data: insurancePolicies, isLoading: isLoadingInsurancePolicies } =
    useGetMyInsurancePolicy()

  const insurancePolicyItems = useMemo(() => {
    return (insurancePolicies ?? []).map((policy) => ({
      label: policy.title,
      value: String(policy.id),
    }))
  }, [insurancePolicies])

  const selectedPolicyId = useWatch({
    control,
    name: 'extPolicyId',
  })

  useEffect(() => {
    if (
      !isLoadingInsurancePolicies &&
      !selectedPolicyId &&
      insurancePolicyItems.length
    ) {
      setValue('extPolicyId', Number(insurancePolicyItems[0].value))
    }
  }, [
    insurancePolicyItems,
    isLoadingInsurancePolicies,
    selectedPolicyId,
    setValue,
  ])

  const renderedLabel =
    label ?? t('claimRequests.dialog.fields.insurancePolicy')
  const placeholderText =
    placeholder ?? t('claimRequests.dialog.fields.selectInsurancePolicy')

  return (
    <FormField
      control={control}
      name='extPolicyId'
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {renderedLabel}
            {isRequired && <span className='text-destructive'>*</span>}
          </FormLabel>
          <FormControl>
            <SearchableSelect
              presentation='reference'
              loadingText={t('common.loading')}
              emptyText={t('common.noResults')}
              clearText={t('common.clear')}
              value={field.value ? String(field.value) : undefined}
              onChange={(value) => {
                setValue('extNationalCode', '')
                field.onChange(value ? Number(value) : undefined)
              }}
              items={insurancePolicyItems}
              placeholder={placeholderText}
              isLoading={isLoadingInsurancePolicies}
              canClear={false}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default MyClaimMyInsurancePolicyFormField
