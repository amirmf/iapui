import { useEffect, useMemo } from 'react'

import { FanhubTaminPrescriptionResponse } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/fanhub-tamin-prescription-section/fanhub-tamin-prescription-response'
import {
  type FanhubTaminNationalCodeForm,
  fanhubTaminNationalCodeFormSchema,
  typedZodResolver,
} from '@features/claim-requests/pages/claim-request-management/model/claim-request-management-forms'
import type {
  FanhubDrugPrescriptionResponse,
  FanhubOfficeServiceResponse,
  FanhubParaClinicPrescriptionResponse,
} from '@iap/api-types'
import { Form, TextField } from '@iap/forms'
import { Button } from '@iap/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { useForm } from 'react-hook-form'

type InquiryType = 'drug' | 'paraClinic' | 'officeService'
type FanhubPrescriptionResponse =
  | FanhubDrugPrescriptionResponse
  | FanhubParaClinicPrescriptionResponse
  | FanhubOfficeServiceResponse
type FanhubTaminPrescriptionDialogProps = {
  type: InquiryType
  open: boolean
  onOpenChange: (open: boolean) => void
  nationalCode: string
  onSubmit: (nationalCode: string) => void
  data?: FanhubPrescriptionResponse
  error: Error | null
  isPending: boolean
  isError: boolean
}

export function FanhubTaminPrescriptionDialog(
  props: FanhubTaminPrescriptionDialogProps
) {
  const {
    type,
    open,
    onOpenChange,
    nationalCode,
    onSubmit,
    data,
    error,
    isPending,
    isError,
  } = props
  const { t } = useTranslation()
  const schema = useMemo(() => fanhubTaminNationalCodeFormSchema(t), [t])
  const form = useForm<FanhubTaminNationalCodeForm>({
    resolver: typedZodResolver(schema),
    defaultValues: { nationalCode: '' },
  })

  useEffect(() => {
    if (open) form.reset({ nationalCode })
  }, [form, nationalCode, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        presentation='reference'
        className='max-h-[90vh] min-w-0 overflow-y-auto overflow-x-hidden sm:max-w-6xl'
      >
        <DialogHeader>
          <DialogTitle>
            {t(`claimRequests.taminPrescriptions.types.${type}` as never)}
          </DialogTitle>
          <DialogDescription>
            {t('claimRequests.taminPrescriptions.description')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(({ nationalCode }) =>
              onSubmit(nationalCode)
            )}
            className='space-y-4'
          >
            <TextField
              control={form.control}
              name='nationalCode'
              label={t('claimRequests.taminPrescriptions.fields.nationalCode')}
              numerical
              inputMode='numeric'
              maxLength={10}
              disabled={isPending}
            />
            <DialogFooter className='gap-2 sm:space-x-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {t('common.cancel')}
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending
                  ? t('common.loading')
                  : t('claimRequests.taminPrescriptions.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>

        <FanhubTaminPrescriptionResponse
          type={type}
          data={data}
          error={error}
          isPending={isPending}
          isError={isError}
        />
      </DialogContent>
    </Dialog>
  )
}
