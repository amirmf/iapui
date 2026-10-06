import { useEffect, useMemo, useRef } from 'react'

import { IssuanceFields } from '@features/outpatient-doc-acceptances/components/issuance-form-dialog-fields'
import { typedZodResolver } from '@features/outpatient-doc-acceptances/components/typed-zod-resolver'
import { useOutpatientDocAcceptance } from '@features/outpatient-doc-acceptances/context/store/outpatient-doc-acceptance-store'
import { outpatientDocAcceptanceService } from '@features/outpatient-doc-acceptances/services/outpatient-doc-acceptance-service'
import {
  type Issuance,
  type IssuanceForm,
  issuanceFormSchema,
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

const getDefaultIssuanceValues = (
  issuance?: Issuance | null,
  docAcceptanceId?: string
): IssuanceForm => ({
  draftKindId:
    issuance?.draftKindId != null ? String(issuance.draftKindId) : undefined,
  description: issuance?.description ?? undefined,
  certificationExpertId:
    issuance?.certificationExpertId != null
      ? String(issuance.certificationExpertId)
      : undefined,
  complementReasonId:
    issuance?.complementReasonId != null
      ? String(issuance.complementReasonId)
      : undefined,
  dataSenderId:
    issuance?.dataSenderId != null ? String(issuance.dataSenderId) : undefined,
  amount: issuance?.amount != null ? String(issuance.amount) : undefined,
  autoCalc: issuance?.autoCalc ?? false,
  claimId: issuance?.claimId != null ? String(issuance.claimId) : undefined,
  docAcceptanceId:
    issuance?.docAcceptanceId != null
      ? String(issuance.docAcceptanceId)
      : docAcceptanceId,
  draftNo: issuance?.draftNo ?? undefined,
  draftReasonId:
    issuance?.draftReasonId != null
      ? String(issuance.draftReasonId)
      : undefined,
  reasonId: issuance?.reasonId != null ? String(issuance.reasonId) : undefined,
  exId: issuance?.exId != null ? String(issuance.exId) : undefined,
  isComfort: issuance?.isComfort ?? false,
  issuDate: issuance?.issuDate ?? undefined,
  sourceId: issuance?.sourceId != null ? String(issuance.sourceId) : undefined,
  exStatus: issuance?.exStatus != null ? String(issuance.exStatus) : undefined,
  calcTime: issuance?.calcTime ?? undefined,
  changeTime: issuance?.changeTime ?? undefined,
  paymentPreparationTime: issuance?.paymentPreparationTime ?? undefined,
  calcJobStatus:
    issuance?.calcJobStatus != null
      ? String(issuance.calcJobStatus)
      : undefined,
  status: issuance?.status ?? 'SUBMIT',
  claimRequestId: issuance?.claimRequestId ?? undefined,
  wsResult: issuance?.wsResult ?? undefined,
  wsStatus: issuance?.wsStatus ?? 'PROGRESS',
})

export function IssuanceFormDialog() {
  const { t } = useTranslation()
  const { open, currentRow, closeDialog } = useOutpatientDocAcceptance()
  const isModalOpen = open === 'manageIssuance'
  const docAcceptanceId = currentRow?.id ?? null
  const issuance = currentRow?.outpatientClaim?.issuance ?? null
  const fallbackIdRef = useRef<string | null>(null)
  if (docAcceptanceId) {
    fallbackIdRef.current = docAcceptanceId
  }
  const effectiveDocAcceptanceId = fallbackIdRef.current
  const isEdit = Boolean(issuance?.id)
  const queryClient = useQueryClient()

  const defaultValues = useMemo(
    () =>
      getDefaultIssuanceValues(issuance, effectiveDocAcceptanceId ?? undefined),
    [issuance, effectiveDocAcceptanceId]
  )

  const form = useForm<IssuanceForm>({
    resolver: typedZodResolver(issuanceFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (isModalOpen && effectiveDocAcceptanceId) {
      form.reset(getDefaultIssuanceValues(issuance, effectiveDocAcceptanceId))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, issuance?.id, effectiveDocAcceptanceId])

  const createMutation = useMutation({
    mutationFn: async (data: IssuanceForm) => {
      if (!effectiveDocAcceptanceId)
        throw new Error('Missing doc acceptance id')
      return outpatientDocAcceptanceService.createIssuance(
        effectiveDocAcceptanceId,
        data
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['outpatient-doc-acceptances'],
      })
      toast.success(t('outpatientDocAcceptances.messages.issuanceCreated'))
      closeDialog()
      form.reset(
        getDefaultIssuanceValues(
          undefined,
          effectiveDocAcceptanceId ?? undefined
        )
      )
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: IssuanceForm) => {
      if (!effectiveDocAcceptanceId)
        throw new Error('Missing doc acceptance id')
      return outpatientDocAcceptanceService.updateIssuance(
        effectiveDocAcceptanceId,
        data
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['outpatient-doc-acceptances'],
      })
      toast.success(t('outpatientDocAcceptances.messages.issuanceUpdated'))
      closeDialog()
      form.reset(
        getDefaultIssuanceValues(
          undefined,
          effectiveDocAcceptanceId ?? undefined
        )
      )
    },
  })

  const onSubmit: SubmitHandler<IssuanceForm> = (data) => {
    if (isEdit) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !isLoading) {
      closeDialog()
      form.reset(
        getDefaultIssuanceValues(
          issuance,
          effectiveDocAcceptanceId ?? undefined
        )
      )
    }
  }

  const handleClose = () => {
    handleOpenChange(false)
  }

  if (!effectiveDocAcceptanceId) {
    return null
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-6xl'>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t('outpatientDocAcceptances.issuanceDialog.edit')
              : t('outpatientDocAcceptances.issuanceDialog.create')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex h-full flex-col gap-4'
          >
            <IssuanceFields />

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
