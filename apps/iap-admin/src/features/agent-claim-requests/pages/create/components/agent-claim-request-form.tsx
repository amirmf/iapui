import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { formatLocalDateTime as format } from '@iap/shared-lib'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  DatePicker,
  Input,
} from '@iap/ui'
import { FileUploader } from '@modules/files'
import { handleServerError } from '@shared/errors/handle-server-error'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Info } from 'lucide-react'
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import agentClaimRequestService from '../../../services/agent-claim-request-service'
import {
  type AgentClaimRequestFormValues,
  agentClaimRequestFormSchema,
  defaultAgentClaimRequestFormValues,
} from '../model/agent-claim-request-form-schema'
import {
  AgentClaimRequestAccountNotFoundDialog,
  AgentClaimRequestExtNationalCodeFormField,
  AgentClaimRequestExtPolicyIdFormField,
  AgentClaimRequestFormDocTypes,
  AgentClaimRequestInquiryNationalCodeFormField,
} from './index'

export interface AgentClaimRequestFormProps {
  onSuccess?: () => void
}

export function AgentClaimRequestForm({
  onSuccess,
}: AgentClaimRequestFormProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [isUploadingFiles, setIsUploadingFiles] = useState(false)
  const [isInquiryNotFoundDialogOpen, setIsInquiryNotFoundDialogOpen] =
    useState(false)

  const form = useForm<AgentClaimRequestFormValues>({
    resolver: zodResolver(agentClaimRequestFormSchema(t)),
    defaultValues: defaultAgentClaimRequestFormValues,
  })

  const inquiryNationalCode = useWatch({
    control: form.control,
    name: 'inquiryNationalCode',
  })

  const {
    data: inquiryData,
    error: inquiryError,
    isLoading: isInquiryLoading,
  } = useQuery({
    queryKey: ['agentClaimRequestInquiry', inquiryNationalCode],
    queryFn: ({ signal }) =>
      agentClaimRequestService.inquiry({
        username: inquiryNationalCode,
        signal,
      }),
    enabled: inquiryNationalCode?.length === 10,
    staleTime: 10 * 1000,
  })

  useEffect(() => {
    if (!inquiryError) return

    if (isAxiosError(inquiryError) && inquiryError.response?.status === 404) {
      setIsInquiryNotFoundDialogOpen(true)
      return
    }

    handleServerError(inquiryError)
  }, [inquiryError])

  const selectedDocType = useWatch({
    control: form.control,
    name: 'docType',
  })

  const createMutation = useMutation({
    mutationFn: async (values: AgentClaimRequestFormValues) => {
      const selectedUserId = String(inquiryData?.selectedUser?.userId ?? '')

      return agentClaimRequestService.create({
        selectedUserId,
        claimRequest: {
          submitDate: values.submitDate
            ? format(values.submitDate, 'yyyy-MM-dd')
            : '',
          amount: Number(values.amount),
          attachments: values.attachments ?? [],
          docType: { id: values.docType.id },
          extNationalCode: values.extNationalCode.nationalCode,
          isForeign: values.extNationalCode.isForeign,
          extPolicyId: values.extPolicyId,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agentClaimRequests'] })
      toast.success(t('claimRequests.messages.created'))
      onSuccess?.()
      form.reset(defaultAgentClaimRequestFormValues)
    },
  })

  const onSubmit: SubmitHandler<AgentClaimRequestFormValues> = (values) => {
    createMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6'
        noValidate
      >
        <AgentClaimRequestInquiryNationalCodeFormField
          selectedUserDisplayName={
            inquiryData?.selectedUser?.displayName ?? undefined
          }
        />

        <AgentClaimRequestExtPolicyIdFormField
          policies={inquiryData?.policies ?? undefined}
          isInquiryLoading={isInquiryLoading}
        />

        <AgentClaimRequestExtNationalCodeFormField
          inquiryNationalCode={inquiryData?.selectedUser?.username}
        />

        <FormField
          control={form.control}
          name='submitDate'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>
                {t('claimRequests.dialog.fields.submitDate')}
                <span className='text-destructive'>*</span>
              </FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  editable
                  placeholder={t(
                    'claimRequests.dialog.fields.submitDatePlaceholder'
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Alert className='mb-6 border-primary/50 bg-primary/5 dark:bg-primary/10'>
          <Info className='h-4 w-4' />
          <AlertTitle className='text-sm font-semibold text-gray-700 dark:text-gray-400'>
            {t('myiap.createClaimPage.submitDateAlertTitle')}
          </AlertTitle>
          <AlertDescription className='whitespace-pre-wrap text-sm font-medium leading-6 text-gray-600 dark:text-gray-300'>
            {t('myiap.createClaimPage.submitDateAlertDescription')}
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name='amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('claimRequests.dialog.fields.amount')} ({t('common.rial')})
                <span className='text-destructive'>*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} numerical numberWithComma maxLength={11} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <AgentClaimRequestFormDocTypes />

        {selectedDocType?.documentGuide && (
          <Alert className='mb-6 border-primary/50 bg-primary/5 dark:bg-primary/10'>
            <Info className='h-4 w-4' />
            <AlertTitle className='text-sm font-semibold text-gray-700 dark:text-gray-400'>
              {t('myiap.docTypeAlert', {
                docType: selectedDocType?.docType,
              })}
            </AlertTitle>
            <AlertDescription className='whitespace-pre-wrap text-sm font-medium leading-6 text-gray-600 dark:text-gray-300'>
              {selectedDocType?.documentGuide}
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name='attachments'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('claimRequests.dialog.fields.attachments')}
                <span className='text-destructive'>*</span>
              </FormLabel>
              <FormControl>
                <FileUploader
                  value={field.value ?? []}
                  onChange={field.onChange}
                  onUploadingChange={setIsUploadingFiles}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex items-center justify-end gap-3'>
          <Button
            type='submit'
            disabled={createMutation.isPending || isUploadingFiles}
          >
            {createMutation.isPending
              ? t('form.creating')
              : isUploadingFiles
                ? t('form.uploading')
                : t('claimRequests.create')}
          </Button>
        </div>
      </form>

      <AgentClaimRequestAccountNotFoundDialog
        open={isInquiryNotFoundDialogOpen}
        onOpenChange={setIsInquiryNotFoundDialogOpen}
      />
    </Form>
  )
}

export default AgentClaimRequestForm
