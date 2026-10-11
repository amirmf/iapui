import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { SupportFeatureButton } from '@iap/support'
import { Input } from '@iap/ui'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export type AgentClaimRequestInquiryNationalCodeFormFieldProps = {
  selectedUserDisplayName?: string
}

export function AgentClaimRequestInquiryNationalCodeFormField({
  selectedUserDisplayName,
}: AgentClaimRequestInquiryNationalCodeFormFieldProps) {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name='inquiryNationalCode'
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {t('agent.claimRequests.create.fields.inquiryNationalCode')}
            <span className='text-destructive'>*</span>
            <SupportFeatureButton
              featureKey='help_nationalCode'
              size='xs'
              variant='default'
            />
          </FormLabel>
          <FormControl>
            <div>
              <Input
                {...field}
                numerical
                value={field.value ?? ''}
                placeholder={t(
                  'agent.claimRequests.create.fields.inquiryNationalCodePlaceholder'
                )}
                maxLength={10}
              />
              {selectedUserDisplayName && (
                <p className='mt-1 text-xs font-medium'>
                  <span className='text-gray-500'>
                    {t(
                      'agent.claimRequests.create.fields.selectedNationalCode'
                    )}
                    :
                  </span>
                  <span className='pr-1 text-primary-700'>
                    {selectedUserDisplayName}
                  </span>
                </p>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default AgentClaimRequestInquiryNationalCodeFormField
