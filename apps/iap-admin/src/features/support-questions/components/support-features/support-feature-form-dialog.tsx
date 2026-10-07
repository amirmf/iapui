import { useEffect, useMemo } from 'react'

import { type SupportFeaturePayload, type SupportPage } from '@iap/api-types'
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
  MultiSelect,
  Textarea,
} from '@iap/ui'
import {
  type QueryObserverResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useSupportFeature } from '../../context'
import { type SupportFeatureForm, supportFeatureFormSchema } from '../../model'
import { supportFeatureService, supportPageService } from '../../services'
import { typedZodResolver } from '../../utils/typed-zod-resolver'

const defaultValues: SupportFeatureForm = {
  featureKey: '',
  title: '',
  description: '',
  pageKeys: [],
  active: true,
}

export function SupportFeatureFormDialog<TData>({
  refetch,
}: {
  refetch: () => Promise<QueryObserverResult<TData>>
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const open = useSupportFeature((state) => state.open)
  const setOpen = useSupportFeature((state) => state.setOpen)
  const supportFeature = useSupportFeature((state) => state.currentRow)
  const setCurrentRow = useSupportFeature((state) => state.setCurrentRow)
  const form = useForm<SupportFeatureForm>({
    resolver: typedZodResolver(supportFeatureFormSchema(t)),
    defaultValues,
  })
  const isEdit = Boolean(supportFeature?.id)
  const isOpen = open === 'create' || open === 'edit'

  const { data: supportPages = [], isLoading: isSupportPagesLoading } =
    useQuery<SupportPage[]>({
      queryKey: ['support-pages', 'page', 0, 500],
      queryFn: async ({ signal }) => {
        const response = await supportPageService.getPage({
          page: 0,
          size: 500,
          filters: {},
          signal,
        })
        return response.content ?? []
      },
      enabled: isOpen,
      staleTime: 30_000,
    })

  const supportPageOptions = useMemo(
    () =>
      supportPages.flatMap(({ pageKey, title }) =>
        pageKey
          ? [
              {
                value: pageKey,
                label: title ? `${title} (${pageKey})` : pageKey,
              },
            ]
          : []
      ),
    [supportPages]
  )

  useEffect(() => {
    form.reset(
      supportFeature
        ? {
            featureKey: supportFeature.featureKey ?? '',
            title: supportFeature.title ?? '',
            description: supportFeature.description ?? '',
            pageKeys: supportFeature.pageKeys ?? [],
            active: supportFeature.active ?? true,
          }
        : defaultValues
    )
  }, [form, supportFeature])

  const close = () => {
    form.reset(defaultValues)
    setOpen(null)
    setCurrentRow(null)
  }

  const createMutation = useMutation({
    mutationFn: supportFeatureService.create,
    onSuccess: async () => {
      await Promise.all([
        refetch(),
        queryClient.invalidateQueries({ queryKey: ['support-features'] }),
      ])
      toast.success(t('supportFeatures.messages.created' as never))
      close()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SupportFeaturePayload }) =>
      supportFeatureService.update(id, data),
    onSuccess: async () => {
      await Promise.all([
        refetch(),
        queryClient.invalidateQueries({ queryKey: ['support-features'] }),
      ])
      toast.success(t('supportFeatures.messages.updated' as never))
      close()
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  const onSubmit: SubmitHandler<SupportFeatureForm> = (data) => {
    const payload: SupportFeaturePayload = {
      featureKey: data.featureKey,
      title: data.title,
      description: data.description || undefined,
      pageKeys: data.pageKeys ?? [],
      active: data.active,
    }
    if (supportFeature?.id) {
      updateMutation.mutate({ id: supportFeature.id, data: payload })
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
              ? t('supportFeatures.dialog.edit' as never)
              : t('supportFeatures.dialog.create' as never)}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='featureKey'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('supportFeatures.fields.key' as never)}
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
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('supportFeatures.fields.title' as never)}
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
                    {t('supportFeatures.fields.description' as never)}
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
              name='pageKeys'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('supportFeatures.fields.pageKeys' as never)}
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      labelKey='label'
                      valueKey='value'
                      options={supportPageOptions}
                      value={supportPageOptions.filter((option) =>
                        (field.value ?? []).includes(option.value)
                      )}
                      onValueChange={(selected) =>
                        field.onChange(selected.map((option) => option.value))
                      }
                      placeholder={t(
                        'supportFeatures.fields.pageKeysPlaceholder' as never
                      )}
                      isLoading={isSupportPagesLoading}
                      disabled={isPending}
                    />
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
                    {t('supportFeatures.fields.active' as never)}
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
                  ? t('supportFeatures.actions.save' as never)
                  : t('supportFeatures.actions.create' as never)}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
