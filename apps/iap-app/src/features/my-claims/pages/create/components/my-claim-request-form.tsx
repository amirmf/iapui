import { useEffect, useRef, useState } from 'react'

import {
  type MyClaimRequestForm,
  myClaimRequestFormSchema,
} from '@features/my-claims/model/my-claim-request-form-schema'
import { FileUploader } from '@features/my-claims/pages/create/components/file-uploader'
import { MyBankAccountDialog } from '@features/my-claims/pages/create/components/my-bank-account-dialog'
import { MyClaimMyInsurancePolicyFormField } from '@features/my-claims/pages/create/components/my-claim-my-insurance-policy-form-field'
import { MyClaimMyNationalCodeFormField } from '@features/my-claims/pages/create/components/my-claim-my-national-code-form-field'
import MyClaimRequestFormDocTypes from '@features/my-claims/pages/create/components/my-claim-request-form-doc-types'
import myClaimRequestService from '@features/my-claims/services/my-claim-request-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { extractErrorMessage } from '@iap/api-client'
import { ConfirmDialog } from '@iap/dialogs'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  DatePicker,
  Input,
} from '@iap/ui'
import { handleServerError } from '@shared/errors/handle-server-error'
import { i18n } from '@shared/i18n/i18n'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Info } from 'lucide-react'
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const defaultValues: Partial<MyClaimRequestForm> = {
  submitDate: undefined,
  amount: '',
  attachments: [],
  docType: { id: '', docType: '', docTypeCode: '', documentGuide: '' },
  extNationalCode: { id: 0, nationalCode: '', fullName: '' },
  extPolicyId: undefined,
}
export function MyClaimRequestForm({ onSuccess }: { onSuccess?: () => void }) {
  const { t } = useTranslation()
  const translate = t as (key: string, options?: unknown) => string
  const htmlFormRef = useRef<HTMLFormElement>(null)
  const qc = useQueryClient()
  const [uploading, setUploading] = useState(false)
  const [invalidSheba, setInvalidSheba] = useState(false)
  const [bankOpen, setBankOpen] = useState(false)
  const form = useForm<MyClaimRequestForm>({
    resolver: zodResolver(
      myClaimRequestFormSchema(t as (key: string) => string)
    ),
    defaultValues,
  })
  const selected = useWatch({ control: form.control, name: 'docType' })
  useEffect(() => {
    const first = htmlFormRef.current?.querySelector('[data-message-error]')
    if (first) {
      window.scrollTo({
        top: first.getBoundingClientRect().top + window.scrollY - 200,
      })
    }
  }, [form.formState.errors])
  const mutation = useMutation({
    mutationFn: myClaimRequestService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myClaimRequests'] })
      toast.success(translate('claimRequests.messages.created'))
      form.reset(defaultValues)
      onSuccess?.()
    },
    onError: (error) => {
      const invalidMessage = i18n.getFixedT('fa')(
        'myiap.createClaimPage.invalidShebaMessage'
      )
      if ((extractErrorMessage(error) ?? '').includes(invalidMessage)) {
        setInvalidSheba(true)
      } else handleServerError(error)
    },
  })
  const submit: SubmitHandler<MyClaimRequestForm> = (v) =>
    mutation.mutate({
      ...v,
      amount: Number(v.amount),
      docType: { id: v.docType.id ?? '' },
      extNationalCode: v.extNationalCode.nationalCode ?? '',
      isForeign: v.isForeign,
    })
  return (
    <>
      <ConfirmDialog
        open={invalidSheba}
        onOpenChange={setInvalidSheba}
        title={translate('myiap.createClaimPage.invalidShebaTitle')}
        description={translate('myiap.createClaimPage.invalidShebaMessage')}
        confirmLabel={translate('myiap.createClaimPage.invalidShebaConfirm')}
        onConfirm={() => {
          setInvalidSheba(false)
          setBankOpen(true)
        }}
      />
      <MyBankAccountDialog open={bankOpen} onOpenChange={setBankOpen} />
      <Form {...form}>
        <form
          ref={htmlFormRef}
          onSubmit={form.handleSubmit(submit)}
          className='space-y-6'
          noValidate
        >
          <MyClaimMyInsurancePolicyFormField featureKey='help_InsurancePolicy' />
          <MyClaimMyNationalCodeFormField featureKey='help_extNationalCode' />
          <FormField
            control={form.control}
            name='submitDate'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>
                  {translate('claimRequests.dialog.fields.submitDate')} *
                </FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    editable
                    maxDate={new Date(new Date().setHours(23, 59, 59, 999))}
                    placeholder={translate(
                      'claimRequests.dialog.fields.submitDatePlaceholder'
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Alert className='mb-6 border-primary/50 bg-primary/5'>
            <Info className='size-4' />
            <AlertTitle>
              {translate('myiap.createClaimPage.submitDateAlertTitle')}
            </AlertTitle>
            <AlertDescription className='whitespace-pre-wrap'>
              {translate('myiap.createClaimPage.submitDateAlertDescription')}
            </AlertDescription>
          </Alert>
          <FormField
            control={form.control}
            name='amount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {translate('claimRequests.dialog.fields.amount')} (
                  {translate('common.rial')}) *
                </FormLabel>
                <FormControl>
                  <Input {...field} numerical numberWithComma maxLength={11} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <MyClaimRequestFormDocTypes />
          {selected?.documentGuide && (
            <Alert className='mb-6 border-primary/50 bg-primary/5'>
              <Info className='size-4' />
              <AlertTitle>
                {translate('myiap.docTypeAlert', { docType: selected.docType })}
              </AlertTitle>
              <AlertDescription className='whitespace-pre-wrap'>
                {selected.documentGuide}
              </AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name='attachments'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {translate('claimRequests.dialog.fields.attachments')} *
                </FormLabel>
                <FormControl>
                  <FileUploader
                    value={field.value ?? []}
                    onChange={field.onChange}
                    onUploadingChange={setUploading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex items-center justify-end gap-3'>
            <Button type='submit' disabled={mutation.isPending || uploading}>
              {mutation.isPending
                ? translate('form.creating')
                : uploading
                  ? translate('form.uploading')
                  : translate('myiap.claimRequests.create')}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
