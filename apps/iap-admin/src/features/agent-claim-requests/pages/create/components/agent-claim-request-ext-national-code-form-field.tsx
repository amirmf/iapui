import { useMemo } from 'react'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { SupportFeatureButton } from '@iap/support'
import { SearchableSelect } from '@iap/ui'
import { useQuery } from '@tanstack/react-query'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import agentClaimRequestService from '../../../services/agent-claim-request-service'
import type { AgentClaimRequestFormValues } from '../model/agent-claim-request-form-schema'

export type AgentClaimRequestExtNationalCodeFormFieldProps = {
  inquiryNationalCode?: string
}

export function AgentClaimRequestExtNationalCodeFormField({
  inquiryNationalCode,
}: AgentClaimRequestExtNationalCodeFormFieldProps) {
  const { t } = useTranslation()
  const { control } = useFormContext<AgentClaimRequestFormValues>()
  const selectedPolicyId = useWatch({
    control,
    name: 'extPolicyId',
  })

  const { data: subInsuredPeople, isLoading: isSubInsuredPeopleLoading } =
    useQuery({
      queryKey: [
        'agentSubInsuredPeople',
        selectedPolicyId,
        inquiryNationalCode,
      ],
      queryFn: ({ signal }) =>
        agentClaimRequestService.getSubInsuredPeople(
          Number(selectedPolicyId),
          inquiryNationalCode || '',
          {
            signal,
          }
        ),
      enabled: Number(selectedPolicyId) > 0 && !!inquiryNationalCode,
    })

  const subInsuredItems = useMemo(() => {
    return (subInsuredPeople ?? []).map((person) => {
      let label = person.fullName || ''
      if (person.isForeign === 'Y') {
        label =
          `${label} (${person.nationalCode}-${t('claimRequests.dialog.fields.foreign')})`.trim()
      } else {
        label = `${label} (${person.nationalCode})`.trim()
      }
      return {
        label,
        value: String(person.nationalCode),
      }
    })
  }, [subInsuredPeople, t])

  return (
    <FormField
      control={control}
      name='extNationalCode'
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {t('claimRequests.dialog.fields.subInsuredPerson')}
            <span className='text-destructive'>*</span>
            <SupportFeatureButton
              featureKey='help_extNationalCode'
              size='xs'
              variant='default'
            />
          </FormLabel>
          <FormControl>
            <SearchableSelect
              value={field.value?.nationalCode}
              onChange={(value) => {
                const selectedItem = subInsuredPeople?.find(
                  (item) => item.nationalCode === value
                )
                field.onChange(
                  selectedItem || {
                    id: 0,
                    nationalCode: '',
                    fullName: '',
                  }
                )
              }}
              items={subInsuredItems}
              placeholder={t(
                'claimRequests.dialog.fields.selectSubInsuredPerson'
              )}
              isLoading={isSubInsuredPeopleLoading}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default AgentClaimRequestExtNationalCodeFormField
