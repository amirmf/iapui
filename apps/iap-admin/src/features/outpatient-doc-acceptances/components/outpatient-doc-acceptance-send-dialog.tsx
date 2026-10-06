import { useEffect, useMemo } from 'react'

import { typedZodResolver } from '@features/outpatient-doc-acceptances/components/typed-zod-resolver'
import { useOutpatientDocAcceptance } from '@features/outpatient-doc-acceptances/context/store/outpatient-doc-acceptance-store'
import { outpatientDocAcceptanceService } from '@features/outpatient-doc-acceptances/services/outpatient-doc-acceptance-service'
import {
  type OutpatientDocAcceptanceSubmissionForm,
  outpatientDocAcceptanceSubmissionFormSchema,
} from '@iap/api-types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { Button } from '@iap/ui'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { Input } from '@iap/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const getDefaultValues = (
  initialAcceptanceId?: string | null
): OutpatientDocAcceptanceSubmissionForm => ({
  outpatientDocAcceptanceId: initialAcceptanceId ?? '',
  date: new Date(),
})

export function OutpatientDocAcceptanceSendDialog() {
  const { t: translate } = useTranslation()
  const t = translate as (
    key: string,
    options?: Record<string, unknown>
  ) => string
  const queryClient = useQueryClient()
  const { open, currentRow, closeDialog } = useOutpatientDocAcceptance()
  const isModalOpen = open === 'send'
  const defaultValues = useMemo(
    () => getDefaultValues(currentRow?.id),
    [currentRow?.id]
  )

  const form = useForm<OutpatientDocAcceptanceSubmissionForm>({
    resolver: typedZodResolver(outpatientDocAcceptanceSubmissionFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (isModalOpen) {
      form.reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, defaultValues.outpatientDocAcceptanceId])

  const sendMutation = useMutation({
    mutationFn: outpatientDocAcceptanceService.send,
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ['outpatient-doc-acceptances'],
      })
      toast.success(
        t('outpatientDocAcceptances.messages.sent', {
          count: result.length,
        })
      )
      closeDialog()
      form.reset(defaultValues)
    },
  })

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen && !sendMutation.isPending) {
      closeDialog()
      form.reset(defaultValues)
    }
  }

  const handleSubmit = (values: OutpatientDocAcceptanceSubmissionForm) => {
    sendMutation.mutate(values)
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent presentation='reference' className='h-200 sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>
            {t('outpatientDocAcceptances.sendDialog.title')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='flex flex-col gap-4'
          >
            <div className='grid grid-cols-1 gap-4 md:grid-cols-1'>
              <FormField
                control={form.control}
                name='outpatientDocAcceptanceId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        'outpatientDocAcceptances.sendDialog.fields.outpatientDocAcceptanceId'
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleDialogChange(false)}
                disabled={sendMutation.isPending}
              >
                {t('common.cancel')}
              </Button>
              <Button type='submit' disabled={sendMutation.isPending}>
                {sendMutation.isPending
                  ? t('common.loading')
                  : t('common.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
