import { useMemo, useState } from 'react'

import {
  type MyClaimRequestObjectionFormValues,
  myClaimRequestObjectionFormSchema,
} from '@features/agent-claim-requests/pages/detail/model/my-claim-request-objection-schema'
import { useSubmitAgentClaimRequestObjection } from '@features/agent-claim-requests/pages/detail/queries/use-submit-agent-claim-request-objection'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  TextareaField,
} from '@iap/forms'
import { Button } from '@iap/ui'
import { FileUploader } from '@modules/files'
import { useTranslate } from '@shared/i18n/i18n'
import { useForm } from 'react-hook-form'

interface AgentClaimRequestObjectionFormProps {
  isCompleteDoc?: boolean
}

export function AgentClaimRequestObjectionForm(
  props: AgentClaimRequestObjectionFormProps
) {
  const { isCompleteDoc } = props
  const { t } = useTranslate()
  const [isUploading, setIsUploading] = useState(false)
  const schema = useMemo(() => myClaimRequestObjectionFormSchema(t), [t])
  const form = useForm<MyClaimRequestObjectionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { formDescription: '', attachments: [] },
  })
  const submitFormMutation = useSubmitAgentClaimRequestObjection(() =>
    form.reset()
  )
  const isSubmittingForm = submitFormMutation.isPending

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          submitFormMutation.mutate(values)
        )}
        className='space-y-4'
      >
        <FormField
          control={form.control}
          name='attachments'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('agent.claimRequests.detail.uploadAttachments')}
              </FormLabel>
              <FormControl>
                <FileUploader
                  value={field.value || []}
                  onChange={field.onChange}
                  onUploadingChange={setIsUploading}
                />
              </FormControl>
              <FormMessage presentation='reference' />
            </FormItem>
          )}
        />
        <TextareaField
          presentation='reference'
          control={form.control}
          name='formDescription'
          label={t('agent.claimRequests.detail.description')}
          placeholder={t('agent.claimRequests.detail.descriptionPlaceholder')}
          disabled={isSubmittingForm}
          rows={5}
        />
        <div className='flex justify-end gap-2'>
          <Button
            presentation='reference'
            type='submit'
            disabled={isSubmittingForm || isUploading}
          >
            {isSubmittingForm
              ? t('common.loading')
              : isCompleteDoc
                ? t('agent.claimRequests.detail.submitCompleteDoc')
                : t('agent.claimRequests.detail.submitForm')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
