import { useEffect, useMemo } from 'react'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { SupportFeatureButton } from '@iap/support'
import { SearchableSelect } from '@iap/ui'
import { useGetMyInsurancePolicy } from '@modules/insurance-policies'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export type MyClaimMyInsurancePolicyFormFieldProps = {
  featureKey?: string
  isFilter?: boolean
  isRequired?: boolean
  label?: string
  placeholder?: string
}

export function MyClaimMyInsurancePolicyFormField(
  props: MyClaimMyInsurancePolicyFormFieldProps
) {
  const { featureKey, isFilter, isRequired = true, label, placeholder } = props
  const { control, setValue } = useFormContext()
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
            {featureKey && (
              <SupportFeatureButton
                featureKey={featureKey}
                size='xs'
                variant='secondary'
              />
            )}
          </FormLabel>
          <FormControl>
            <SearchableSelect
              canClear={false}
              isLoading={isLoadingInsurancePolicies}
              items={insurancePolicyItems}
              onChange={(value) => {
                setValue(
                  'extNationalCode',
                  isFilter
                    ? ''
                    : {
                        fullName: '',
                        id: 0,
                        nationalCode: '',
                      }
                )
                field.onChange(value ? Number(value) : undefined)
              }}
              placeholder={placeholderText}
              value={field.value ? String(field.value) : undefined}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default MyClaimMyInsurancePolicyFormField
