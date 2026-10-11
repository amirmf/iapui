import { useMemo, useState } from 'react'

import { FileUploader } from '@features/my-claims/components/file-uploader'
import {
  type MyClaimRequestObjectionFormValues,
  myClaimRequestObjectionFormSchema,
} from '@features/my-claims/pages/detail/model/my-claim-request-objection-schema'
import myClaimRequestService from '@features/my-claims/pages/detail/services/my-claim-request-objection-service'
import { useMyClaimRequestQuery } from '@features/my-claims/queries/my-claim-request-query'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { Button } from '@iap/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface MyClaimRequestObjectionFormProps {
  isCompleteDoc?: boolean
}

export function MyClaimRequestObjectionForm(
  props: MyClaimRequestObjectionFormProps
) {
  const { isCompleteDoc } = props
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { data: claim, refetch } = useMyClaimRequestQuery()
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<MyClaimRequestObjectionFormValues>({
    resolver: zodResolver(
      useMemo(() => myClaimRequestObjectionFormSchema(t), [t])
    ),
    defaultValues: {
      formDescription: '-',
      attachments: [],
    },
  })

  const submitFormMutation = useMutation({
    mutationFn: async (values: MyClaimRequestObjectionFormValues) => {
      if (!claim?.id) {
        toast.error(t('myiap.claimRequest.messages.claimIdMissing'))
        throw new Error('validation_failed')
      }

      return myClaimRequestService.submitObjection({
        claimRequestId: claim.id,
        description: values.formDescription,
        attachments: values.attachments || [],
        claimRequestStatus: 'IN_ASSESSMENT',
      })
    },
    onSuccess: async (updatedClaim) => {
      await queryClient.invalidateQueries({ queryKey: ['myClaimRequests'] })
      await refetch()

      if (claim?.id) {
        queryClient.setQueryData(['myClaimRequest', claim.id], updatedClaim)
      }

      toast.success(t('myiap.claimRequest.messages.formSubmitSuccess'))
      form.reset()
    },
  })

  const onSubmit = (values: MyClaimRequestObjectionFormValues) => {
    submitFormMutation.mutate(values)
  }

  const handleCompletionDocument = () => {
    submitFormMutation.mutate({
      formDescription: '-',
      attachments: [],
    })
  }

  const isSubmittingForm = submitFormMutation.isPending

  const hasCompletionDocument = useMemo(() => {
    if (claim?.objections?.length) {
      const sortedObjections = [...claim.objections].sort(
        (a, b) =>
          new Date(a.createdAt || '').getTime() -
          new Date(b.createdAt || '').getTime()
      )
      const lastItem = sortedObjections[sortedObjections.length - 1]
      return (
        lastItem.description?.search('بیمه نامه خارجی') !== -1 ||
        lastItem.description?.search('بیمه نامه خارجی') !== -1 ||
        lastItem.description?.search('بیمهنامه خارجی') !== -1
      )
    }
    return false
  }, [claim?.objections])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='attachments'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('myiap.claimRequest.detail.uploadAttachments')}
              </FormLabel>
              <FormControl>
                <FileUploader
                  value={field.value || []}
                  onChange={field.onChange}
                  onUploadingChange={setIsUploading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end gap-2'>
          {hasCompletionDocument && (
            <Button
              presentation='reference'
              variant='secondary'
              type='button'
              disabled={isSubmittingForm || isUploading}
              onClick={handleCompletionDocument}
            >
              {isSubmittingForm
                ? t('common.loading')
                : t('myiap.claimRequest.detail.completionDocument')}
            </Button>
          )}
          <Button
            presentation='reference'
            type='submit'
            disabled={isSubmittingForm || isUploading}
          >
            {isSubmittingForm
              ? t('common.loading')
              : isCompleteDoc
                ? t('myiap.claimRequest.detail.submitCompleteDoc')
                : t('myiap.claimRequest.detail.submitForm')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
