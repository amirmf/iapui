import { useCallback, useEffect, useMemo, useState } from 'react'

import { claimRequestService } from '@features/claim-requests'
import '@formio/js/dist/formio.full.min.css'
import type { Submission } from '@formio/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { ClaimDocumentFormActions } from '../components/claim-document-form-actions'
import { ClaimDocumentFormContent } from '../components/claim-document-form-content'
import { FormioStandaloneLayout } from '../components/formio-standalone-layout'
import {
  cloneSubmission,
  parseFormSchema,
  parseSubmission,
} from '../model/claim-document-form-data'

export function ClaimDocumentFormRendererFrame() {
  const { claimRequestId, documentId } = useParams({
    from: '/formio/claim-requests/$claimRequestId/documents/$documentId',
  })
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [formKey, setFormKey] = useState(0)
  const [initialSubmission, setInitialSubmission] = useState<
    Submission['data']
  >({})
  const [submission, setSubmission] = useState<Submission['data']>({})
  const { data: claimRequest, isLoading } = useQuery({
    enabled: Boolean(claimRequestId),
    queryFn: ({ signal }) =>
      claimRequestService.findById(claimRequestId, signal),
    queryKey: ['claimRequest', claimRequestId],
  })
  const documents = useMemo(
    () => claimRequest?.documents ?? [],
    [claimRequest?.documents]
  )
  const targetDocument = useMemo(
    () =>
      documents.find((document) => String(document.id ?? '') === documentId),
    [documentId, documents]
  )
  const schema = useMemo(
    () => parseFormSchema(targetDocument?.dataJsonSchema),
    [targetDocument?.dataJsonSchema]
  )

  useEffect(() => {
    const next = cloneSubmission(parseSubmission(targetDocument?.extractedData))
    setInitialSubmission(next)
    setSubmission(next)
    setFormKey((key) => key + 1)
  }, [targetDocument])

  const { isPending: isSaving, mutate: saveDocument } = useMutation({
    mutationFn: (data: Submission['data']) =>
      claimRequestService.updateDocuments({
        body: {
          documents: documents.map((document) =>
            String(document.id ?? '') === documentId
              ? { ...document, extractedData: cloneSubmission(data) }
              : document
          ),
        },
        path: { id: claimRequestId },
      }),
    onSuccess: async (updated) => {
      toast.success(t('claimRequests.documents.messages.updateSuccess'))
      const next = cloneSubmission(
        parseSubmission(
          updated.documents?.find(
            (document) => String(document.id ?? '') === documentId
          )?.extractedData
        )
      )
      setInitialSubmission(next)
      setSubmission(next)
      setFormKey((key) => key + 1)
      await queryClient.invalidateQueries({
        queryKey: ['claimRequest', claimRequestId],
      })
    },
  })
  const handleReset = useCallback(() => {
    setSubmission(cloneSubmission(initialSubmission))
    setFormKey((key) => key + 1)
  }, [initialSubmission])
  const handleSave = useCallback(
    (data = submission) => {
      if (!targetDocument) {
        toast.error(t('claimRequests.documents.unavailable'))
        return
      }
      saveDocument(data)
    },
    [saveDocument, submission, t, targetDocument]
  )
  const actions = useMemo(
    () => (
      <ClaimDocumentFormActions
        disabled={isSaving || isLoading || !schema?.components?.length}
        onReset={handleReset}
        onSave={() => handleSave()}
        t={t}
      />
    ),
    [
      handleReset,
      handleSave,
      isLoading,
      isSaving,
      schema?.components?.length,
      t,
    ]
  )

  return (
    <FormioStandaloneLayout actions={actions}>
      <ClaimDocumentFormContent
        formKey={formKey}
        isLoading={isLoading}
        onChange={setSubmission}
        onSubmit={handleSave}
        schema={schema}
        submission={submission}
        t={t}
        targetDocumentExists={Boolean(targetDocument)}
      />
    </FormioStandaloneLayout>
  )
}
