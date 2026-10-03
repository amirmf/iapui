import { useEffect, useMemo } from 'react'

import {
  type RepetitiveResponseGroupForm,
  createRepetitiveResponseGroupFormSchema,
} from '@features/repetitive-responses/model/repetitive-response-form-schema'
import { repetitiveResponseGroupService } from '@features/repetitive-responses/services/repetitive-response-group-service'
import { zodResolver } from '@hookform/resolvers/zod'
import type { RepetitiveResponseGroup } from '@iap/api-types'
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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'

type Props = {
  currentRow?: RepetitiveResponseGroup | null
  onOpenChange: (open: boolean) => void
  open: boolean
}

type RepetitiveResponseGroupFormInput = z.input<
  ReturnType<typeof createRepetitiveResponseGroupFormSchema>
>

const getDefaultValues = (
  currentRow?: RepetitiveResponseGroup | null
): RepetitiveResponseGroupForm => ({
  seqNum: currentRow?.seqNum ?? 0,
  title: currentRow?.title ?? '',
})

export function RepetitiveResponseGroupFormDialog({
  currentRow,
  onOpenChange,
  open,
}: Props) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const isEdit = Boolean(currentRow?.id)
  const schema = useMemo(() => createRepetitiveResponseGroupFormSchema(t), [t])
  const form = useForm<
    RepetitiveResponseGroupFormInput,
    unknown,
    RepetitiveResponseGroupForm
  >({
    defaultValues: getDefaultValues(currentRow),
    resolver: zodResolver(schema),
  })
  const createMutation = useMutation({
    mutationFn: repetitiveResponseGroupService.create,
    onError: () => {
      toast.error(t('repetitiveResponseGroups.messages.createError'))
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['repetitive-response-groups'],
      })
      toast.success(t('repetitiveResponseGroups.messages.created'))
      onOpenChange(false)
      form.reset()
    },
  })
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string
      values: RepetitiveResponseGroupForm
    }) => repetitiveResponseGroupService.update(id, values),
    onError: () => {
      toast.error(t('repetitiveResponseGroups.messages.updateError'))
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['repetitive-response-groups'],
      })
      toast.success(t('repetitiveResponseGroups.messages.updated'))
      onOpenChange(false)
      form.reset()
    },
  })
  const isLoading = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (open) form.reset(getDefaultValues(currentRow))
  }, [currentRow, form, open])

  const onSubmit: SubmitHandler<RepetitiveResponseGroupForm> = (values) => {
    if (isEdit && currentRow?.id) {
      updateMutation.mutate({ id: currentRow.id, values })
      return
    }

    createMutation.mutate(values)
  }
  const handleClose = () => {
    if (isLoading) return

    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog onOpenChange={(next) => !next && handleClose()} open={open}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {t(
              isEdit
                ? 'repetitiveResponseGroups.dialog.edit'
                : 'repetitiveResponseGroups.dialog.create'
            )}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className='flex h-full flex-col'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('repetitiveResponseGroups.dialog.fields.title')}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='seqNum'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('repetitiveResponseGroups.dialog.fields.seqNum')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        inputMode='numeric'
                        onChange={(event) => {
                          const value = event.target.value
                          field.onChange(value === '' ? 0 : Number(value))
                        }}
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
            <DialogFooter className='mt-4'>
              <Button
                disabled={isLoading}
                onClick={handleClose}
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
