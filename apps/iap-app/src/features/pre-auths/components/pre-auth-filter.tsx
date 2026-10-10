import { useEffect } from 'react'

import { Form } from '@iap/forms'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import MyClaimMyInsurancePolicyFormField from './my-claim-my-insurance-policy-form-field'
import MyClaimMyNationalCodeFormField from './my-claim-my-national-code-form-field'

export interface PreAuthFilterValues {
  nationalCode: string
  policyId: number
}

interface PreAuthFilterFormValues {
  extNationalCode?: string
  extPolicyId?: number
}

export interface PreAuthFilterProps {
  onApply: (values: PreAuthFilterValues) => void
  onClear: () => void
}

export function PreAuthFilter({ onApply, onClear }: PreAuthFilterProps) {
  const { t } = useTranslation()
  const form = useForm<PreAuthFilterFormValues>({
    defaultValues: {
      extNationalCode: '',
      extPolicyId: undefined,
    },
  })
  const policyId = useWatch({ control: form.control, name: 'extPolicyId' })
  const nationalCode = useWatch({
    control: form.control,
    name: 'extNationalCode',
  })

  useEffect(() => {
    if (!policyId || !nationalCode) {
      onClear()
    }
  }, [nationalCode, onClear, policyId])

  useEffect(() => {
    if (policyId && nationalCode) {
      onApply({
        nationalCode,
        policyId,
      })
    }
  }, [nationalCode, onApply, policyId])

  const handleSubmit = form.handleSubmit((values) => {
    if (!values.extPolicyId || !values.extNationalCode) return

    onApply({
      nationalCode: values.extNationalCode,
      policyId: values.extPolicyId,
    })
  })

  return (
    <div className='rounded-lg border bg-card p-4'>
      <Form {...form}>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <div className='grid gap-4 md:grid-cols-2'>
            <MyClaimMyInsurancePolicyFormField
              isFilter
              isRequired
              label={t('myiap.preAuths.filters.policy')}
              placeholder={t('myiap.preAuths.filters.selectPolicy')}
            />
            <MyClaimMyNationalCodeFormField
              isFilter
              isRequired
              label={t('myiap.preAuths.filters.insuredPerson')}
              placeholder={t('myiap.preAuths.filters.selectInsuredPerson')}
            />
          </div>
        </form>
      </Form>
    </div>
  )
}
