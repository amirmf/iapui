import { useEffect, useMemo } from 'react'

import { typedZodResolver } from '@features/outpatient-doc-acceptances/components/typed-zod-resolver'
import { useOutpatientDocAcceptance } from '@features/outpatient-doc-acceptances/context/store/outpatient-doc-acceptance-store'
import { outpatientDocAcceptanceService } from '@features/outpatient-doc-acceptances/services/outpatient-doc-acceptance-service'
import {
  type OutpatientDocAcceptanceGenerationForm,
  outpatientDocAcceptanceGenerationFormSchema,
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
import { DatePicker } from '@iap/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const getDefaultValues = (
  initialClaimRequestId?: string | null
): OutpatientDocAcceptanceGenerationForm => ({
  claimRequestId: initialClaimRequestId ?? '',
  date: new Date(),
})

export function OutpatientDocAcceptanceGenerateDialog() {
  const { t: translate, i18n } = useTranslation()
  const t = translate as (
    key: string,
    options?: Record<string, unknown>
  ) => string
  const queryClient = useQueryClient()
  const { open, currentRow, closeDialog } = useOutpatientDocAcceptance()
  const isModalOpen = open === 'generate'
  const defaultValues = useMemo(
    () => getDefaultValues(currentRow?.claimRequestId),
    // Preserve the reference reset boundary when this dialog reopens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentRow?.claimRequestId, isModalOpen]
  )

  const form = useForm<OutpatientDocAcceptanceGenerationForm>({
    resolver: typedZodResolver(outpatientDocAcceptanceGenerationFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (isModalOpen) {
      form.reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, defaultValues.claimRequestId])

  const generateMutation = useMutation({
    mutationFn: outpatientDocAcceptanceService.generate,
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ['outpatient-doc-acceptances'],
      })
      toast.success(
        t('outpatientDocAcceptances.messages.generated', {
          count: result.length,
        })
      )
      closeDialog()
      form.reset(defaultValues)
    },
  })

  const handleSubmit = (values: OutpatientDocAcceptanceGenerationForm) => {
    generateMutation.mutate(values)
  }

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen && !generateMutation.isPending) {
      closeDialog()
      form.reset(defaultValues)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent presentation='reference' className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>
            {t('outpatientDocAcceptances.generateDialog.title')}
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
                name='claimRequestId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        'outpatientDocAcceptances.generateDialog.fields.claimRequestId'
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('outpatientDocAcceptances.generateDialog.fields.date')}
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        presentation='reference'
                        locale={i18n.language === 'fa' ? 'fa' : 'en'}
                        value={field.value}
                        onChange={field.onChange}
                      />
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
                disabled={generateMutation.isPending}
              >
                {t('common.cancel')}
              </Button>
              <Button type='submit' disabled={generateMutation.isPending}>
                {generateMutation.isPending
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
