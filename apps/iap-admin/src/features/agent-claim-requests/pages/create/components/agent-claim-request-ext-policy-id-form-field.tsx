import { useEffect, useMemo } from 'react'

import type { RegisteryAgentInquiryResponse } from '@iap/api-types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { SupportFeatureButton } from '@iap/support'
import { SearchableSelect } from '@iap/ui'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { AgentClaimRequestFormValues } from '../model/agent-claim-request-form-schema'

type PolicyItem = {
  label: string
  value: string
}

export type AgentClaimRequestExtPolicyIdFormFieldProps = {
  policies?: RegisteryAgentInquiryResponse['policies']
  isInquiryLoading: boolean
}

export function AgentClaimRequestExtPolicyIdFormField({
  policies,
  isInquiryLoading,
}: AgentClaimRequestExtPolicyIdFormFieldProps) {
  const { t } = useTranslation()
  const { clearErrors, control, setValue } =
    useFormContext<AgentClaimRequestFormValues>()

  const policyItems = useMemo<PolicyItem[]>(() => {
    return (policies ?? []).map((policy) => ({
      label: policy.title,
      value: String(policy.id),
    }))
  }, [policies])

  const selectedPolicyId = useWatch({
    control,
    name: 'extPolicyId',
  })

  useEffect(() => {
    if (!selectedPolicyId && policyItems.length > 0) {
      setValue('extPolicyId', Number(policyItems[0].value))
      clearErrors('extPolicyId')
      setValue('extNationalCode', { id: 0, nationalCode: '', fullName: '' })
    } else if (selectedPolicyId && !policyItems?.length) {
      setValue('extPolicyId', 0)
      setValue('extNationalCode', { id: 0, nationalCode: '', fullName: '' })
    }
  }, [clearErrors, policyItems, selectedPolicyId, setValue])

  return (
    <FormField
      control={control}
      name='extPolicyId'
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {t('claimRequests.dialog.fields.insurancePolicy')}
            <span className='text-destructive'>*</span>
            <SupportFeatureButton
              featureKey='help_insurancePolicy'
              size='xs'
              variant='default'
            />
          </FormLabel>
          <FormControl>
            <SearchableSelect
              value={field.value ? String(field.value) : undefined}
              onChange={(value) => {
                setValue('extNationalCode', {
                  id: 0,
                  nationalCode: '',
                  fullName: '',
                })
                field.onChange(value ? Number(value) : undefined)
              }}
              items={policyItems}
              placeholder={t(
                'claimRequests.dialog.fields.selectInsurancePolicy'
              )}
              isLoading={isInquiryLoading}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default AgentClaimRequestExtPolicyIdFormField
