import { useEffect, useMemo } from 'react'

import {
  type CreateSupportQuestionPayload,
  type SupportFeature,
  type SupportPage,
} from '@iap/api-types'
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
  SearchableSelect,
} from '@iap/ui'
import {
  type QueryObserverResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import {
  getPartyRoleOptions,
  getSupportRequiredParamInputDisplayOptions,
} from '../../constants/support-question-constant'
import { useSupportQuestion } from '../../context'
import {
  type SupportQuestionForm,
  supportQuestionFormSchema,
} from '../../model'
import {
  supportFeatureService,
  supportPageService,
  supportQuestionService,
} from '../../services'
import { typedZodResolver } from '../../utils/typed-zod-resolver'
import { MarkdownEditor } from '../markdown-editor/markdown-editor'
import { SupportQuestionNextSelectableQuestionKeysField } from './support-question-next-selectable-question-keys-field'

const defaultValues: SupportQuestionForm = {
  active: true,
  questionKey: '',
  level: '',
  requiredParam: '',
  requiredParamInputDisplay: undefined,
  sequence: '',
  nextSelectableQuestionKeys: [],
  pageTags: [],
  featureTags: [],
  roles: [],
  staticResponse: '',
  title: '',
}

interface SupportQuestionFormDialogProps<TData> {
  refetch: () => Promise<QueryObserverResult<TData>>
}

export function SupportQuestionFormDialog<TData>(
  props: SupportQuestionFormDialogProps<TData>
) {
  const { refetch } = props
  const open = useSupportQuestion((state) => state.open)
  const setOpen = useSupportQuestion((state) => state.setOpen)
  const currentRow = useSupportQuestion((state) => state.currentRow)
  const setCurrentRow = useSupportQuestion((state) => state.setCurrentRow)

  const isOpen = open === 'create' || open === 'edit'
  const isEdit = open === 'edit'
  const { t } = useTranslation()
  const form = useForm<SupportQuestionForm>({
    resolver: typedZodResolver(supportQuestionFormSchema(t)),
    defaultValues,
  })

  const { reset } = form

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

  const { data: supportFeatures = [], isLoading: isSupportFeaturesLoading } =
    useQuery<SupportFeature[]>({
      queryKey: ['support-features', 'page', 0, 500],
      queryFn: async ({ signal }) => {
        const response = await supportFeatureService.getPage({
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
      supportPages.map(({ pageKey, title }) => ({
        value: pageKey,
        label: `${title} (${pageKey})`,
      })),
    [supportPages]
  )

  const supportFeatureOptions = useMemo(
    () =>
      supportFeatures.map(({ featureKey, title }) => ({
        value: featureKey || '',
        label: `${title} (${featureKey})`,
      })),
    [supportFeatures]
  )

  const roleOptions = useMemo(() => getPartyRoleOptions(t), [t])

  useEffect(() => {
    if (!open || !isEdit || !currentRow) return

    reset({
      questionKey: currentRow?.questionKey ?? '',
      title: currentRow?.title ?? '',
      staticResponse: currentRow?.staticResponse ?? '',
      level: currentRow?.level?.toString() ?? '',
      requiredParam: currentRow?.requiredParam ?? '',
      requiredParamInputDisplay:
        currentRow?.requiredParamInputDisplay ?? undefined,
      sequence: currentRow?.sequence?.toString() ?? '',
      nextSelectableQuestionKeys:
        currentRow?.nextSelectableQuestionKeys?.map((item) => ({
          label: item,
          value: item,
        })) ?? [],
      pageTags: currentRow?.pageTags ?? [],
      featureTags: currentRow?.featureTags ?? [],
      roles: currentRow?.roles ?? [],
      active: currentRow?.active ?? true,
    })
  }, [currentRow, isEdit, open, reset])

  const close = () => {
    setOpen(null)
    setCurrentRow(null)
    reset(defaultValues)
  }

  const createMutation = useMutation({
    mutationFn: supportQuestionService.create,
    onSuccess: async () => {
      await refetch()
      toast.success(t('supportQuestions.messages.created' as never))
      close()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: CreateSupportQuestionPayload
    }) => supportQuestionService.update(id, data),
    onSuccess: async () => {
      await refetch()
      toast.success(t('supportQuestions.messages.updated' as never))
      close()
    },
  })

  const onSubmit: SubmitHandler<SupportQuestionForm> = (data) => {
    const payload: CreateSupportQuestionPayload = {
      ...data,
      staticResponse: data.staticResponse ?? undefined,
      level: data.level ? Number(data.level) : undefined,
      requiredParam: data.requiredParam || undefined,
      requiredParamInputDisplay: data.requiredParamInputDisplay || undefined,
      sequence: data.sequence ? Number(data.sequence) : undefined,
      nextSelectableQuestionKeys:
        data.nextSelectableQuestionKeys?.map((item) => item.value) ?? [],
      pageTags: data.pageTags ?? [],
      featureTags: data.featureTags ?? [],
    }
    if (isEdit && currentRow?.id) {
      updateMutation.mutate({ id: currentRow.id, data: payload })
      return
    }
    createMutation.mutate(payload)
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={() => !isLoading && close()}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t('supportQuestions.dialog.edit' as never)
              : t('supportQuestions.dialog.create' as never)}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='questionKey'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('supportQuestions.fields.key' as never)}
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
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('supportQuestions.fields.title' as never)}
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
                name='level'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('supportQuestions.fields.level' as never)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        numerical
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='requiredParam'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('supportQuestions.fields.requiredParam' as never)}
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
                name='requiredParamInputDisplay'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        'supportQuestions.fields.requiredParamInputDisplay' as never
                      )}
                    </FormLabel>
                    <FormControl>
                      <SearchableSelect
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        items={getSupportRequiredParamInputDisplayOptions(t)}
                        placeholder={t(
                          'supportQuestions.fields.selectInputDisplay' as never
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='sequence'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('supportQuestions.fields.sequence' as never)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        numerical
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SupportQuestionNextSelectableQuestionKeysField />
              <FormField
                control={form.control}
                name='roles'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('supportQuestions.fields.roles' as never)}
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        labelKey='label'
                        valueKey='value'
                        options={roleOptions}
                        value={roleOptions.filter((option) =>
                          (field.value ?? []).includes(option.value)
                        )}
                        onValueChange={(selected) =>
                          field.onChange(selected.map((option) => option.value))
                        }
                        placeholder={t(
                          'supportQuestions.fields.selectRoles' as never
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='pageTags'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('supportQuestions.fields.pageTags' as never)}
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
                        isLoading={isSupportPagesLoading}
                        disabled={isLoading}
                        placeholder={t(
                          'supportQuestions.fields.selectPageTags' as never
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='featureTags'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('supportQuestions.fields.featureTags' as never)}
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        labelKey='label'
                        valueKey='value'
                        options={supportFeatureOptions}
                        value={supportFeatureOptions.filter((option) =>
                          (field.value ?? []).includes(option.value)
                        )}
                        onValueChange={(selected) =>
                          field.onChange(selected.map((option) => option.value))
                        }
                        isLoading={isSupportFeaturesLoading}
                        disabled={isLoading}
                        placeholder={t(
                          'supportQuestions.fields.selectFeatureTags' as never
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='staticResponse'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('supportQuestions.fields.staticResponse' as never)}
                  </FormLabel>
                  <FormControl>
                    <MarkdownEditor
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      disabled={isLoading}
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
                <FormItem className='flex items-center gap-2 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>
                    {t('supportQuestions.fields.active' as never)}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={close}
                disabled={isLoading}
              >
                {t('common.cancel' as never)}
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isEdit
                  ? t('common.save' as never)
                  : t('supportQuestions.create' as never)}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
