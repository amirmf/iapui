import { Form, type FormType, type Submission } from '@formio/react'
import type { TFunction } from 'i18next'

import { emptyForm } from '../model/claim-document-form-data'

type Props = {
  formKey: number
  isLoading: boolean
  onChange: (data: Submission['data']) => void
  onSubmit: (data: Submission['data']) => void
  schema: FormType | null
  submission: Submission['data']
  t: TFunction
  targetDocumentExists: boolean
}

export function ClaimDocumentFormContent(props: Props) {
  const {
    formKey,
    isLoading,
    onChange,
    onSubmit,
    schema,
    submission,
    t,
    targetDocumentExists,
  } = props
  if (isLoading)
    return (
      <div className='flex h-full items-center justify-center p-6 text-muted-foreground'>
        {t('common.loading')}
      </div>
    )
  if (!targetDocumentExists)
    return (
      <div className='flex h-full items-center justify-center p-6 text-muted-foreground'>
        {t('claimRequests.documents.missingDocument')}
      </div>
    )
  if (!schema?.components?.length)
    return (
      <div className='flex h-full flex-col items-center justify-center gap-2 p-6 text-center'>
        <h2 className='text-lg font-semibold'>
          {t('claimRequests.documents.messages.missingSchemaTitle')}
        </h2>
        <p className='max-w-md text-muted-foreground'>
          {t('claimRequests.documents.messages.missingSchemaDescription')}
        </p>
      </div>
    )
  return (
    <div className='formio-form h-full overflow-auto bg-background'>
      <Form
        form={schema}
        key={formKey}
        onChange={(state: unknown) => {
          const data = (state as { data?: Submission['data'] }).data
          if (data) onChange(data)
        }}
        onSubmit={(state: unknown) => {
          const data = (state as { data?: Submission['data'] }).data
          if (data) onSubmit(data)
        }}
        src={schema ?? emptyForm}
        submission={{ data: submission } as Submission}
      />
    </div>
  )
}
