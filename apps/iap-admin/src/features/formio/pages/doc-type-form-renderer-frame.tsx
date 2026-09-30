import { useEffect, useMemo, useState } from 'react'

import '@formio/js/dist/formio.full.min.css'
import { Form, type FormType, type Submission } from '@formio/react'
import type { DocType } from '@iap/api-types'
import { Button } from '@iap/ui'
import { docTypeService } from '@modules/doc-types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import { RefreshCw, Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { FormioStandaloneLayout } from '../components/formio-standalone-layout'

const emptyForm: FormType = { components: [], display: 'form' }

function isFormSchema(value: unknown): value is FormType {
  if (!value || typeof value !== 'object') return false

  return Array.isArray((value as { components?: unknown }).components)
}

function parseFormSchema(value: string | null | undefined): FormType | null {
  if (!value) return null

  try {
    const parsed = JSON.parse(value)
    return isFormSchema(parsed) ? parsed : null
  } catch {
    return null
  }
}

function parseSubmission(value: string | null | undefined): Submission['data'] {
  if (!value) return {}

  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Submission['data'])
      : {}
  } catch {
    return {}
  }
}

export default function DocTypeFormRendererFrame() {
  const { docTypeId } = useParams({
    from: '/formio/doc-types/$docTypeId/submission-example',
  })
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [schema, setSchema] = useState<FormType | null>(null)
  const [submission, setSubmission] = useState<Submission['data']>({})
  const { data: docType, isLoading } = useQuery({
    enabled: !!docTypeId,
    queryFn: () => docTypeService.getById(docTypeId),
    queryKey: ['doc-types', 'detail', docTypeId],
  })

  useEffect(() => {
    if (!docType) return

    setSchema(parseFormSchema(docType.dataJsonSchema))
    setSubmission(parseSubmission(docType.dataSubmissionExample))
  }, [docType])

  const { mutate: saveSubmission, isPending: isSaving } = useMutation({
    mutationFn: (payload: Submission['data']) =>
      docTypeService.updateSubmissionExample(
        docTypeId,
        JSON.stringify(payload ?? {})
      ),
    onSuccess: async (updatedDocType: DocType) => {
      toast.success(t('docTypes.messages.submissionSaved'))
      setSubmission(parseSubmission(updatedDocType.dataSubmissionExample))
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'doc-types',
      })
    },
  })
  const hasSchema = useMemo(() => Boolean(schema?.components?.length), [schema])
  const actions = useMemo(
    () => (
      <>
        <Button
          className='space-x-1'
          disabled={isSaving || isLoading || !hasSchema}
          onClick={() =>
            docType &&
            setSubmission(parseSubmission(docType.dataSubmissionExample))
          }
          size='sm'
          type='button'
          variant='outline'
        >
          <RefreshCw aria-hidden='true' className='size-4' />
          <span>{t('common.reset')}</span>
        </Button>
        <Button
          className='space-x-1'
          disabled={isSaving || isLoading || !hasSchema}
          onClick={() => saveSubmission(submission)}
          size='sm'
          type='button'
        >
          <Save aria-hidden='true' className='size-4' />
          <span>{t('docTypes.actions.saveSubmission')}</span>
        </Button>
      </>
    ),
    [docType, hasSchema, isLoading, isSaving, saveSubmission, submission, t]
  )

  return (
    <FormioStandaloneLayout actions={actions}>
      {isLoading ? (
        <div className='flex h-full items-center justify-center p-6 text-muted-foreground'>
          {t('common.loading')}
        </div>
      ) : !hasSchema ? (
        <div className='flex h-full flex-col items-center justify-center gap-2 p-6 text-center'>
          <h2 className='text-lg font-semibold'>
            {t('docTypes.dialog.missingSchemaTitle')}
          </h2>
          <p className='max-w-md text-muted-foreground'>
            {t('docTypes.dialog.missingSchemaDescription')}
          </p>
        </div>
      ) : (
        <div className='formio-form h-full overflow-auto bg-background'>
          <Form
            form={schema ?? undefined}
            onChange={(state: unknown) => {
              const next = (state as { data?: Submission['data'] })?.data
              if (next) setSubmission(next)
            }}
            src={schema ?? emptyForm}
            submission={{ data: submission } as Submission}
          />
        </div>
      )}
    </FormioStandaloneLayout>
  )
}
