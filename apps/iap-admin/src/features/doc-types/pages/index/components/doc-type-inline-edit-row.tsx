import { useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import type { AdminDocType, DocTypeInlineForm } from '@iap/api-types'
import { docTypeInlineFormSchema } from '@iap/api-types'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@iap/forms'
import { Button, Input, TableCell, TableRow, Textarea, cn } from '@iap/ui'
import { docTypeService } from '@modules/doc-types'
import { useMutation } from '@tanstack/react-query'
import type { Row } from '@tanstack/react-table'
import { type Control, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { z } from 'zod'

type DocTypeInlineEditRowProps = {
  onCancel: () => void
  onSuccess: () => void
  row: Row<AdminDocType>
}

type NumberFieldName =
  | 'maxThreshold'
  | 'maxThresholdCountItem'
  | 'maxThresholdItem'
  | 'minThreshold'
  | 'sequence'

type DocTypeInlineFormInput = z.input<typeof docTypeInlineFormSchema>

type NumericCellProps = {
  control: Control<DocTypeInlineFormInput, unknown, DocTypeInlineForm>
  name: NumberFieldName
  placeholder: string
}

function NumericCell(props: NumericCellProps) {
  const { control, name, placeholder } = props
  return (
    <TableCell>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                aria-label={placeholder}
                onChange={(event) =>
                  field.onChange(
                    event.target.value === ''
                      ? undefined
                      : Number(event.target.value)
                  )
                }
                placeholder={placeholder}
                type='number'
                value={
                  typeof field.value === 'number' ||
                  typeof field.value === 'string'
                    ? field.value
                    : ''
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </TableCell>
  )
}

export function DocTypeInlineEditRow(props: DocTypeInlineEditRowProps) {
  const { onCancel, onSuccess, row } = props
  const { t } = useTranslation()
  const docType = row.original
  const defaultValues = useMemo<DocTypeInlineFormInput>(
    () => ({
      dataJsonSchema: docType.dataJsonSchema ?? '{}',
      dataSubmissionExample: docType.dataSubmissionExample ?? '',
      docType: docType.docType ?? '',
      docTypeCode: docType.docTypeCode ?? '',
      documentGuide: docType.documentGuide ?? '',
      maxThreshold: docType.maxThreshold ?? undefined,
      maxThresholdCountItem: docType.maxThresholdCountItem ?? undefined,
      maxThresholdItem: docType.maxThresholdItem ?? undefined,
      minThreshold: docType.minThreshold ?? undefined,
      prompt: docType.prompt ?? '',
      sequence: docType.sequence ?? undefined,
    }),
    [docType]
  )
  const form = useForm<DocTypeInlineFormInput, unknown, DocTypeInlineForm>({
    defaultValues,
    resolver: zodResolver(docTypeInlineFormSchema),
  })
  const updateMutation = useMutation({
    mutationFn: (values: DocTypeInlineForm) => {
      if (!docType.id) throw new Error('Document type id is required.')

      return docTypeService.updateInline(docType.id, values)
    },
    onSuccess: () => {
      toast.success(t('docTypes.messages.updated'))
      onSuccess()
    },
  })

  return (
    <Form {...form}>
      <TableRow className='group/row'>
        <TableCell
          className={cn(
            'sticky left-0 z-10 rounded-tl bg-background',
            'group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
          )}
        />
        <TableCell>
          <FormField
            control={form.control}
            name='docType'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    aria-label={t('docTypes.dialog.fields.docType')}
                    placeholder={t('docTypes.dialog.fields.docType')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell>
          <FormField
            control={form.control}
            name='docTypeCode'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    aria-label={t('docTypes.dialog.fields.docTypeCode')}
                    placeholder={t('docTypes.dialog.fields.docTypeCode')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <NumericCell
          control={form.control}
          name='sequence'
          placeholder={t('docTypes.dialog.fields.sequence')}
        />
        <NumericCell
          control={form.control}
          name='minThreshold'
          placeholder={t('docTypes.dialog.fields.minThreshold')}
        />
        <NumericCell
          control={form.control}
          name='maxThreshold'
          placeholder={t('docTypes.dialog.fields.maxThreshold')}
        />
        <TableCell>
          <FormField
            control={form.control}
            name='prompt'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    aria-label={t('docTypes.dialog.fields.prompt')}
                    placeholder={t('docTypes.dialog.fields.prompt')}
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell className='space-x-2'>
          <Button
            disabled={updateMutation.isPending}
            onClick={onCancel}
            size='sm'
            type='button'
            variant='outline'
          >
            {t('common.cancel')}
          </Button>
          <Button
            disabled={updateMutation.isPending}
            onClick={form.handleSubmit((values) =>
              updateMutation.mutate(values)
            )}
            size='sm'
            type='button'
          >
            {updateMutation.isPending
              ? t('common.loading')
              : t('docTypes.actions.saveInline')}
          </Button>
        </TableCell>
      </TableRow>
    </Form>
  )
}
