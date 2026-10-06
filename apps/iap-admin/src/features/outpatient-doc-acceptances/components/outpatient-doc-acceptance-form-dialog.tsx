import { useEffect } from 'react'

import { OutpatientDocAcceptanceFormFields } from '@features/outpatient-doc-acceptances/components/outpatient-doc-acceptance-form-fields'
import { typedZodResolver } from '@features/outpatient-doc-acceptances/components/typed-zod-resolver'
import { useOutpatientDocAcceptance } from '@features/outpatient-doc-acceptances/context/store/outpatient-doc-acceptance-store'
import { outpatientDocAcceptanceService } from '@features/outpatient-doc-acceptances/services/outpatient-doc-acceptance-service'
import {
  type OutpatientDocAcceptance,
  type OutpatientDocAcceptanceForm,
  outpatientDocAcceptanceFormSchema,
} from '@iap/api-types'
import { Form } from '@iap/forms'
import { Button } from '@iap/ui'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const defaultFormValues: OutpatientDocAcceptanceForm = {
  exId: undefined,
  docDeliveryKindId: undefined,
  deliveryDate: undefined,
  acceptanceKindId: undefined,
  claimCount: undefined,
  dichargeMonth: undefined,
  totalAmount: undefined,
  policyId: undefined,
  insuredPersonId: undefined,
  medicalCenterId: undefined,
  letterDate: undefined,
  letterNo: undefined,
  secretariatNo: undefined,
  secretariatDate: undefined,
  paymentDate: undefined,
  docDelivererAgentId: undefined,
  dataSenderId: undefined,
  claimExpertId: undefined,
  opUnitId: undefined,
  exStatus: undefined,
  status: 'SUBMIT',
  claimRequestId: undefined,
  wsResult: undefined,
  wsStatus: 'PROGRESS',
}

const getDefaultValues = (
  row?: OutpatientDocAcceptance | null
): OutpatientDocAcceptanceForm => ({
  exId: row?.exId != null ? String(row.exId) : undefined,
  docDeliveryKindId:
    row?.docDeliveryKindId != null ? String(row.docDeliveryKindId) : undefined,
  deliveryDate: row?.deliveryDate ?? undefined,
  acceptanceKindId:
    row?.acceptanceKindId != null ? String(row.acceptanceKindId) : undefined,
  claimCount: row?.claimCount != null ? String(row.claimCount) : undefined,
  dichargeMonth:
    row?.dichargeMonth != null ? String(row.dichargeMonth) : undefined,
  totalAmount: row?.totalAmount != null ? String(row.totalAmount) : undefined,
  policyId: row?.policyId != null ? String(row.policyId) : undefined,
  insuredPersonId:
    row?.insuredPersonId != null ? String(row.insuredPersonId) : undefined,
  medicalCenterId:
    row?.medicalCenterId != null ? String(row.medicalCenterId) : undefined,
  letterDate: row?.letterDate ?? undefined,
  letterNo: row?.letterNo ?? undefined,
  secretariatNo: row?.secretariatNo ?? undefined,
  secretariatDate: row?.secretariatDate ?? undefined,
  paymentDate: row?.paymentDate ?? undefined,
  docDelivererAgentId:
    row?.docDelivererAgentId != null
      ? String(row.docDelivererAgentId)
      : undefined,
  dataSenderId:
    row?.dataSenderId != null ? String(row.dataSenderId) : undefined,
  claimExpertId:
    row?.claimExpertId != null ? String(row.claimExpertId) : undefined,
  opUnitId: row?.opUnitId != null ? String(row.opUnitId) : undefined,
  exStatus: row?.exStatus != null ? String(row.exStatus) : undefined,
  status: row?.status ?? 'SUBMIT',
  claimRequestId: row?.claimRequestId ?? undefined,
  wsResult: row?.wsResult ?? undefined,
  wsStatus: row?.wsStatus ?? 'PROGRESS',
})

export function OutpatientDocAcceptanceFormDialog() {
  const { t: translate } = useTranslation()
  const t = translate as (
    key: string,
    options?: Record<string, unknown>
  ) => string
  const { open, currentRow, closeDialog } = useOutpatientDocAcceptance()
  const isModalOpen = open === 'create' || open === 'edit'
  const isEdit = Boolean(currentRow?.id)
  const queryClient = useQueryClient()

  const form = useForm<OutpatientDocAcceptanceForm>({
    resolver: typedZodResolver(outpatientDocAcceptanceFormSchema),
    defaultValues: isEdit ? getDefaultValues(currentRow) : defaultFormValues,
  })

  useEffect(() => {
    if (isModalOpen) {
      form.reset(isEdit ? getDefaultValues(currentRow) : defaultFormValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, currentRow?.id])

  const createMutation = useMutation({
    mutationFn: outpatientDocAcceptanceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['outpatient-doc-acceptances'],
      })
      toast.success(t('outpatientDocAcceptances.messages.created'))
      closeDialog({ clearRow: true })
      form.reset(defaultFormValues)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: OutpatientDocAcceptanceForm
    }) => outpatientDocAcceptanceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['outpatient-doc-acceptances'],
      })
      toast.success(t('outpatientDocAcceptances.messages.updated'))
      closeDialog({ clearRow: true })
      form.reset(defaultFormValues)
    },
  })

  const onSubmit: SubmitHandler<OutpatientDocAcceptanceForm> = (data) => {
    if (isEdit && currentRow?.id) {
      updateMutation.mutate({ id: currentRow.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !isLoading) {
      closeDialog({ clearRow: true })
      form.reset(defaultFormValues)
    }
  }

  const handleClose = () => {
    handleOpenChange(false)
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        presentation='reference'
        className='max-h-[85vh] overflow-y-auto sm:max-w-6xl'
      >
        <DialogHeader className='text-left'>
          <DialogTitle>
            {isEdit
              ? t('outpatientDocAcceptances.dialog.edit')
              : t('outpatientDocAcceptances.dialog.create')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex h-full flex-col gap-4'
          >
            <OutpatientDocAcceptanceFormFields />

            <DialogFooter className='mt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={isLoading}
              >
                {t('common.cancel')}
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading
                  ? isEdit
                    ? t('form.updating')
                    : t('form.creating')
                  : isEdit
                    ? t('form.update')
                    : t('form.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
