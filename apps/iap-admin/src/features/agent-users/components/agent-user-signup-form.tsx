import { useMemo } from 'react'

import { AgentUserIdentityFields } from '@features/agent-users/components/agent-user-identity-fields'
import { AgentUserNationalityField } from '@features/agent-users/components/agent-user-nationality-field'
import { AgentUserPasswordFields } from '@features/agent-users/components/agent-user-password-fields'
import {
  type AgentSignupFormValues,
  createAgentSignupFormSchema,
} from '@features/agent-users/model/agent-signup-schema'
import { useAgentUserSignup } from '@features/agent-users/queries/use-agent-user-signup'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@iap/forms'
import { Button } from '@iap/ui'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { z } from 'zod'

const defaultValues: AgentSignupFormValues = {
  phoneNumber: '',
  nationalCode: '',
  password: '',
  confirmPassword: '',
  nationalityType: 'IR',
}

export function AgentUserSignupForm() {
  const { t } = useTranslation()
  const schema = useMemo(() => createAgentSignupFormSchema(t), [t])
  const form = useForm<z.input<typeof schema>, unknown, AgentSignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })
  const signupMutation = useAgentUserSignup(() => {
    form.reset(defaultValues)
    toast.success(t('agent.users.messages.created'))
  })
  return (
    <Form {...form}>
      <form
        className='space-y-6'
        noValidate
        onSubmit={form.handleSubmit((values) =>
          signupMutation.mutate({
            phoneNumber: values.phoneNumber,
            nationalCode: values.nationalCode,
            password: values.password,
            nationalityType: values.nationalityType,
          })
        )}
      >
        <AgentUserNationalityField />
        <AgentUserIdentityFields />
        <AgentUserPasswordFields />
        <div className='flex justify-end'>
          <Button
            presentation='reference'
            type='submit'
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending
              ? t('agent.users.actions.creating')
              : t('agent.users.actions.create')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
