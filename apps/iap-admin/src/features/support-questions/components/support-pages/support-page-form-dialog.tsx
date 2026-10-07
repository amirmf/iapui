import { useEffect } from 'react'

import { type SupportPagePayload } from '@iap/api-types'
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
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from '@iap/ui'
import {
  type QueryObserverResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useSupportPage } from '../../context'
import { type SupportPageForm, supportPageFormSchema } from '../../model'
import { supportPageService } from '../../services'
import { typedZodResolver } from '../../utils/typed-zod-resolver'

const defaultValues: SupportPageForm = {
  pageKey: '',
  title: '',
  description: '',
  active: true,
}

interface SupportPageFormDialogProps<TData> {
  refetch: () => Promise<QueryObserverResult<TData>>
}

export function SupportPageFormDialog<TData>({
  refetch,
}: SupportPageFormDialogProps<TData>) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const open = useSupportPage((state) => state.open)
  const setOpen = useSupportPage((state) => state.setOpen)
  const supportPage = useSupportPage((state) => state.currentRow)
  const setCurrentRow = useSupportPage((state) => state.setCurrentRow)
  const form = useForm<SupportPageForm>({
    resolver: typedZodResolver(supportPageFormSchema(t)),
    defaultValues,
  })
  const isEdit = Boolean(supportPage?.id)
  const isOpen = open === 'create' || open === 'edit'

  useEffect(() => {
    form.reset(
      supportPage
        ? {
            pageKey: supportPage.pageKey ?? '',
            title: supportPage.title ?? '',
            description: supportPage.description ?? '',
            active: supportPage.active ?? true,
          }
        : defaultValues
    )
  }, [form, supportPage])

  const close = () => {
    form.reset(defaultValues)
    setOpen(null)
    setCurrentRow(null)
  }

  const createMutation = useMutation({
    mutationFn: supportPageService.create,
    onSuccess: async () => {
      await Promise.all([
        refetch(),
        queryClient.invalidateQueries({ queryKey: ['support-pages'] }),
      ])
      toast.success(t('supportPages.messages.created' as never))
      close()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SupportPagePayload }) =>
      supportPageService.update(id, data),
    onSuccess: async () => {
      await Promise.all([
        refetch(),
        queryClient.invalidateQueries({ queryKey: ['support-pages'] }),
      ])
      toast.success(t('supportPages.messages.updated' as never))
      close()
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  const onSubmit: SubmitHandler<SupportPageForm> = (data) => {
    const payload: SupportPagePayload = {
      ...data,
      description: data.description || undefined,
    }
    if (supportPage?.id) {
      updateMutation.mutate({ id: supportPage.id, data: payload })
      return
    }
    createMutation.mutate(payload)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => !isPending && !value && close()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t('supportPages.dialog.edit' as never)
              : t('supportPages.dialog.create' as never)}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='pageKey'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('supportPages.fields.key' as never)}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('supportPages.fields.title' as never)}
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
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('supportPages.fields.description' as never)}
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='active'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center gap-2 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>
                    {t('supportPages.fields.active' as never)}
                  </FormLabel>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                disabled={isPending}
                onClick={close}
              >
                {t('common.dialog.cancel' as never)}
              </Button>
              <Button type='submit' disabled={isPending}>
                {isEdit
                  ? t('supportPages.actions.save' as never)
                  : t('supportPages.actions.create' as never)}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
