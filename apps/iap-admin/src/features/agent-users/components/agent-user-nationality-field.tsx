import { NATIONALITY_TYPE_TRANSLATION_KEYS } from '@features/agent-users/constants/agent-user-constant'
import type { AgentSignupFormValues } from '@features/agent-users/model/agent-signup-schema'
import { nationalityTypeSchema } from '@iap/api-types'
import { FormField, FormItem, FormLabel, FormMessage } from '@iap/forms'
import { Tabs, TabsList, TabsTrigger } from '@iap/ui'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function AgentUserNationalityField() {
  const { control } = useFormContext<AgentSignupFormValues>()
  const { t } = useTranslation()
  return (
    <FormField
      control={control}
      name='nationalityType'
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('agent.users.fields.nationalityType')}</FormLabel>
          <Tabs
            data-slot='tabs'
            className='flex flex-col gap-2'
            value={field.value}
            onValueChange={(value) => {
              const result = nationalityTypeSchema.safeParse(value)
              if (result.success) field.onChange(result.data)
            }}
          >
            <TabsList dir='rtl' className='grid w-full grid-cols-2'>
              {nationalityTypeSchema.options.map((value) => (
                <TabsTrigger
                  presentation='reference'
                  key={value}
                  value={value}
                  className='data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground'
                >
                  {t(NATIONALITY_TYPE_TRANSLATION_KEYS[value])}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <FormMessage presentation='reference' />
        </FormItem>
      )}
    />
  )
}
