import { useEffect } from 'react'

import {
  type DocTypeFormInput,
  createDocTypeFormDefaultValues,
} from '@features/doc-types/model/doc-type-form-default-values'
import { zodResolver } from '@hookform/resolvers/zod'
import type {
  AdminDocType,
  DocTypeForm as DocTypeFormValues,
} from '@iap/api-types'
import { docTypeFormSchema } from '@iap/api-types'
import { Form, TextField, TextareaField } from '@iap/forms'
import { Button } from '@iap/ui'
import { docTypeService } from '@modules/doc-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type Props = {
  docType?: AdminDocType
  mode: 'create' | 'edit'
  onCancel: () => void
  onSuccess: () => void
}

const textFields = [
  'docType',
  'docTypeCode',
  'ceilingControlDamageCode',
] as const

export function DocTypeForm(props: Props) {
  const { docType, mode, onCancel, onSuccess } = props
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const isEdit = mode === 'edit'
  const form = useForm<DocTypeFormInput, unknown, DocTypeFormValues>({
    defaultValues: createDocTypeFormDefaultValues(docType),
    resolver: zodResolver(docTypeFormSchema),
  })

  useEffect(() => {
    if (isEdit && docType) form.reset(createDocTypeFormDefaultValues(docType))
  }, [docType, form, isEdit])

  const mutation = useMutation({
    mutationFn: (values: DocTypeFormValues) => {
      if (!isEdit) return docTypeService.create(values)
      if (!docType?.id) throw new Error('Document type id is required.')

      return docTypeService.update(docType.id, values)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['doc-types', 'page'] })
      toast.success(
        t(
          mode === 'edit'
            ? 'docTypes.messages.updated'
            : 'docTypes.messages.created'
        )
      )
      if (!isEdit) form.reset(createDocTypeFormDefaultValues())
      onSuccess()
    },
  })
  const isLoading = mutation.isPending

  const handleCancel = () => {
    if (!isLoading) onCancel()
  }

  const handleSubmit = (values: DocTypeFormValues) => {
    if (isEdit && !docType?.id) {
      toast.error(t('docTypes.messages.updateError'))
      return
    }

    mutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(handleSubmit)}>
        {textFields.map((name) => (
          <TextField
            key={name}
            control={form.control}
            label={t(`docTypes.dialog.fields.${name}`)}
            name={name}
          />
        ))}
        <TextareaField
          control={form.control}
          label={t('docTypes.dialog.fields.ceilingControlErrorDescription')}
          name='ceilingControlErrorDescription'
          rows={2}
        />
        <TextareaField
          control={form.control}
          label={t('docTypes.dialog.fields.noCoverageErrorDescription')}
          name='noCoverageErrorDescription'
          rows={2}
        />
        <TextareaField
          control={form.control}
          label={t('docTypes.dialog.fields.documentGuide')}
          name='documentGuide'
          rows={3}
        />
        <div className='grid gap-4 sm:grid-cols-2'>
          {(
            [
              'minThreshold',
              'sequence',
              'maxThreshold',
              'maxThresholdItem',
              'maxThresholdCountItem',
            ] as const
          ).map((name) => (
            <TextField
              key={name}
              control={form.control}
              label={t(`docTypes.dialog.fields.${name}`)}
              name={name}
              type='number'
            />
          ))}
        </div>
        <TextareaField
          control={form.control}
          label={t('docTypes.dialog.fields.prompt')}
          name='prompt'
          rows={3}
        />
        <TextareaField
          control={form.control}
          label={t('docTypes.dialog.fields.dataJsonSchema')}
          name='dataJsonSchema'
          placeholder='{"key": "value"}'
          rows={6}
        />
        <div className='flex justify-end gap-2 pt-2'>
          <Button
            disabled={isLoading}
            onClick={handleCancel}
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
        </div>
      </form>
    </Form>
  )
}
