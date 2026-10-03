import { useCallback, useEffect, useMemo } from 'react'

import {
  type RepetitiveResponseForm,
  createRepetitiveResponseFormSchema,
} from '@features/repetitive-responses/model/repetitive-response-form-schema'
import {
  useRepetitiveResponse,
  useRepetitiveResponseGroup,
} from '@features/repetitive-responses/model/repetitive-response-store'
import { RepetitiveResponseTextarea } from '@features/repetitive-responses/pages/index/components/responses/repetitive-response-textarea'
import { repetitiveResponseGroupService } from '@features/repetitive-responses/services/repetitive-response-group-service'
import { repetitiveResponseService } from '@features/repetitive-responses/services/repetitive-response-service'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from '@iap/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'

type RepetitiveResponseFormInput = z.input<
  ReturnType<typeof createRepetitiveResponseFormSchema>
>

const getDefaultValues = (groupId?: string | null): RepetitiveResponseForm => ({
  description: '',
  repetitiveResponseGroupId: groupId ?? '',
  seqNum: 0,
  title: '',
  usageCount: 0,
})

const toNumber = (value: string) => (value === '' ? 0 : Number(value))

export function RepetitiveResponseFormDialog() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { currentRow, open, setOpen } = useRepetitiveResponse()
  const { currentRow: selectedGroupRow } = useRepetitiveResponseGroup()
  const isOpen = open === 'create' || open === 'edit'
  const isEdit = Boolean(currentRow)
  const selectedGroupId =
    currentRow?.repetitiveResponseGroupId ?? selectedGroupRow?.id ?? null
  const schema = useMemo(() => createRepetitiveResponseFormSchema(t), [t])
  const form = useForm<
    RepetitiveResponseFormInput,
    unknown,
    RepetitiveResponseForm
  >({
    defaultValues: getDefaultValues(selectedGroupRow?.id),
    resolver: zodResolver(schema),
  })

  const selectedGroupQuery = useQuery({
    enabled: Boolean(isOpen && selectedGroupId),
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      repetitiveResponseGroupService.getById(selectedGroupId as string, {
        signal,
      }),
    queryKey: ['repetitive-response-group', selectedGroupId],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })

  useEffect(() => {
    if (!isOpen) return

    form.reset(
      currentRow
        ? {
            description: currentRow.description ?? '',
            repetitiveResponseGroupId:
              currentRow.repetitiveResponseGroupId ??
              selectedGroupRow?.id ??
              '',
            seqNum: currentRow.seqNum ?? 0,
            title: currentRow.title ?? '',
            usageCount: currentRow.usageCount ?? 0,
          }
        : getDefaultValues(selectedGroupRow?.id)
    )
  }, [currentRow, form, isOpen, selectedGroupRow?.id])

  const close = useCallback(() => {
    setOpen(null)
    form.reset()
  }, [form, setOpen])

  const createMutation = useMutation({
    mutationFn: repetitiveResponseService.create,
    onError: () => {
      toast.error(t('repetitiveResponses.messages.createError'))
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['repetitive-responses'],
      })
      toast.success(t('repetitiveResponses.messages.created'))
      close()
    },
  })
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string
      values: RepetitiveResponseForm
    }) => repetitiveResponseService.update(id, values),
    onError: () => {
      toast.error(t('repetitiveResponses.messages.updateError'))
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['repetitive-responses'],
      })
      toast.success(t('repetitiveResponses.messages.updated'))
      close()
    },
  })
  const isLoading = createMutation.isPending || updateMutation.isPending

  const onSubmit: SubmitHandler<RepetitiveResponseForm> = (values) => {
    const formValues = {
      ...values,
      repetitiveResponseGroupId:
        values.repetitiveResponseGroupId || selectedGroupRow?.id || '',
    }

    if (isEdit && currentRow?.id) {
      updateMutation.mutate({ id: currentRow.id, values: formValues })
      return
    }

    createMutation.mutate(formValues)
  }

  const onOpenChange = useCallback(() => {
    if (!isLoading) close()
  }, [close, isLoading])

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {t(
              isEdit
                ? 'repetitiveResponses.dialog.edit'
                : 'repetitiveResponses.dialog.create'
            )}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='max-h-[60vh] flex-1 overflow-y-auto p-2'>
              <div className='space-y-4'>
                <FormItem>
                  <FormLabel>
                    {t('repetitiveResponses.dialog.fields.group')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      value={selectedGroupQuery.data?.title ?? '-'}
                    />
                  </FormControl>
                </FormItem>

                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('repetitiveResponses.dialog.fields.title')}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='seqNum'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('repetitiveResponses.dialog.fields.seqNum')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            inputMode='numeric'
                            onChange={(event) =>
                              field.onChange(toNumber(event.target.value))
                            }
                            type='number'
                            value={
                              typeof field.value === 'number' ? field.value : ''
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='usageCount'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('repetitiveResponses.dialog.fields.usageCount')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            inputMode='numeric'
                            onChange={(event) =>
                              field.onChange(toNumber(event.target.value))
                            }
                            type='number'
                            value={
                              typeof field.value === 'number' ? field.value : ''
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('repetitiveResponses.dialog.fields.response')}
                      </FormLabel>
                      <FormControl>
                        <RepetitiveResponseTextarea
                          isBusy={isLoading}
                          onValueChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className='mt-4'>
              <Button
                disabled={isLoading}
                onClick={onOpenChange}
                type='button'
                variant='outline'
              >
                {t('common.cancel')}
              </Button>
              <Button disabled={isLoading} type='submit'>
                {isLoading
                  ? isEdit
                    ? t('form.updating')
                    : t('form.creating')
                  : isEdit
                    ? t('form.update')
                    : t('form.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
