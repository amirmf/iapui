import { memo, useEffect, useMemo } from 'react'

import {
  type ClaimRequestReplayForm as ClaimRequestReplayFormValues,
  claimRequestReplayFormSchema,
} from '@features/claim-requests/model/claim-request-management-forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@iap/forms'
import { Button } from '@iap/ui'
import { DialogFooter } from '@iap/ui'
import { Textarea } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { useForm } from 'react-hook-form'

type ClaimRequestReplayFormProps = {
  isPending: boolean
  open: boolean
  onCancel: () => void
  onSubmit: (values: ClaimRequestReplayFormValues) => void
}

function ClaimRequestReplayFormComponent(props: ClaimRequestReplayFormProps) {
  const { isPending, open, onCancel, onSubmit } = props
  const { t } = useTranslation()
  const schema = useMemo(() => claimRequestReplayFormSchema(t), [t])
  const form = useForm<ClaimRequestReplayFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: '',
    },
  })

  const { handleSubmit, reset } = form

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder={t('claimRequests.replay.descriptionPlaceholder')}
                  rows={4}
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className='gap-2 sm:space-x-2'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isPending}
          >
            {t('common.cancel')}
          </Button>
          <Button type='submit' disabled={isPending}>
            {t('common.submit')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export const ClaimRequestReplayForm = memo(ClaimRequestReplayFormComponent)
