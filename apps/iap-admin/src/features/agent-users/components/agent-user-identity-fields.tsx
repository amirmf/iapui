import type { AgentSignupFormValues } from '@features/agent-users/model/agent-signup-schema'
import { TextField } from '@iap/forms'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function AgentUserIdentityFields() {
  const { control } = useFormContext<AgentSignupFormValues>()
  const nationalityType = useWatch({ control, name: 'nationalityType' })
  const { t } = useTranslation()
  return (
    <>
      <TextField
        presentation='reference'
        control={control}
        name='phoneNumber'
        label={
          <>
            {t('agent.users.fields.phoneNumber')}
            <span className='text-destructive'>*</span>
          </>
        }
        autoComplete='tel'
        dir='ltr'
        inputMode='tel'
        placeholder={t('agent.users.fields.phoneNumberPlaceholder')}
      />
      <TextField
        presentation='reference'
        control={control}
        name='nationalCode'
        label={
          <>
            {t(
              nationalityType === 'IR'
                ? 'agent.users.fields.nationalCode'
                : 'agent.users.fields.foreignNationalCode'
            )}
            <span className='text-destructive'>*</span>
          </>
        }
        autoComplete='off'
        dir='ltr'
      />
    </>
  )
}
