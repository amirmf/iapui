import { useEffect, useMemo, useState } from 'react'

import { FormioStandaloneLayout } from '@features/formio/components/formio-standalone-layout'
import {
  cloneFormSchema,
  createDefaultFormSchema,
  parseDocTypeFormSchema,
} from '@features/formio/model/doc-type-form-schema'
import '@formio/js/dist/formio.builder.min.css'
import '@formio/js/dist/formio.full.min.css'
import { FormBuilder } from '@formio/react'
import type { FormType } from '@formio/react'
import { Button } from '@iap/ui'
import { docTypeService } from '@modules/doc-types'
import { IconDeviceFloppy, IconRotate } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function DocTypeFormBuilderFrame() {
  const { docTypeId } = useParams({
    from: '/formio/doc-types/$docTypeId/builder',
  })
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [currentSchema, setCurrentSchema] = useState<FormType>(
    createDefaultFormSchema
  )
  const [newSchema, setNewSchema] = useState<FormType>(createDefaultFormSchema)
  const [builderKey, setBuilderKey] = useState(0)
  const docTypeQuery = useQuery({
    enabled: Boolean(docTypeId),
    queryFn: () => docTypeService.getById(docTypeId),
    queryKey: ['doc-types', 'detail', docTypeId],
  })
  const builderOptions = useMemo(
    () => ({
      builder: {},
      i18n: {},
      language: 'en',
      noDefaultSubmitButton: true,
      noSource: true,
      template: 'bootstrap',
    }),
    []
  )

  useEffect(() => {
    if (!docTypeQuery.data) {
      return
    }

    const parsed = parseDocTypeFormSchema(docTypeQuery.data.dataJsonSchema)
    setCurrentSchema(parsed)
    setNewSchema(parsed)
    setBuilderKey((key) => key + 1)
  }, [docTypeQuery.data])

  const saveSchemaMutation = useMutation({
    mutationFn: (schema: FormType) => {
      if (!docTypeId) {
        throw new Error('Missing doc type identifier')
      }

      return docTypeService.updateSchema(docTypeId, JSON.stringify(schema))
    },
    onSuccess: async (updatedDocType) => {
      toast.success(t('docTypes.messages.schemaUpdated'))
      const parsed = parseDocTypeFormSchema(updatedDocType.dataJsonSchema)
      setCurrentSchema(parsed)
      setNewSchema(parsed)
      setBuilderKey((key) => key + 1)
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'doc-types',
      })
    },
  })
  const isSaving = saveSchemaMutation.isPending
  const isLoading = docTypeQuery.isLoading
  const builderActions = useMemo(
    () => (
      <>
        <Button
          className='space-x-1'
          disabled={isSaving || isLoading}
          onClick={() => {
            setNewSchema(cloneFormSchema(currentSchema))
            setBuilderKey((key) => key + 1)
          }}
          size='sm'
          type='button'
          variant='outline'
        >
          <IconRotate size={16} />
          <span>{t('common.reset')}</span>
        </Button>
        <Button
          className='space-x-1'
          disabled={isSaving || isLoading}
          onClick={() => saveSchemaMutation.mutate(cloneFormSchema(newSchema))}
          size='sm'
          type='button'
        >
          <IconDeviceFloppy size={16} />
          <span>{t('docTypes.actions.saveSchema')}</span>
        </Button>
      </>
    ),
    [currentSchema, isLoading, isSaving, newSchema, saveSchemaMutation, t]
  )

  return (
    <FormioStandaloneLayout actions={builderActions}>
      <div aria-busy={isLoading} className='flex h-full flex-col'>
        {isLoading ? (
          <div className='flex flex-1 items-center justify-center p-6 text-muted-foreground'>
            {t('common.loading')}
          </div>
        ) : (
          <FormBuilder
            initialForm={currentSchema}
            key={builderKey}
            onChange={(schema) => setNewSchema(cloneFormSchema(schema))}
            options={builderOptions}
          />
        )}
      </div>
    </FormioStandaloneLayout>
  )
}
