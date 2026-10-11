import type { AgentSignupFormValues } from '@features/agent-users/model/agent-signup-schema'
import { TextField } from '@iap/forms'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function AgentUserPasswordFields() {
  const { control } = useFormContext<AgentSignupFormValues>()
  const { t } = useTranslation()
  return (
    <>
      <TextField
        presentation='reference'
        control={control}
        name='password'
        label={
          <>
            {t('agent.users.fields.password')}
            <span className='text-destructive'>*</span>
          </>
        }
        type='password'
        autoComplete='new-password'
        description={t('agent.users.passwordHint')}
      />
      <TextField
        presentation='reference'
        control={control}
        name='confirmPassword'
        label={
          <>
            {t('agent.users.fields.confirmPassword')}
            <span className='text-destructive'>*</span>
          </>
        }
        type='password'
        autoComplete='new-password'
      />
    </>
  )
}
