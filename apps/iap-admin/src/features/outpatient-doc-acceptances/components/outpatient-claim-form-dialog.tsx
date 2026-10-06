import { useEffect, useMemo } from 'react'

import { OutpatientClaimFields } from '@features/outpatient-doc-acceptances/components/outpatient-claim-form-dialog-fields'
import { typedZodResolver } from '@features/outpatient-doc-acceptances/components/typed-zod-resolver'
import { useOutpatientDocAcceptance } from '@features/outpatient-doc-acceptances/context/store/outpatient-doc-acceptance-store'
import { outpatientDocAcceptanceService } from '@features/outpatient-doc-acceptances/services/outpatient-doc-acceptance-service'
import {
  type OutpatientClaim,
  type OutpatientClaimForm,
  outpatientClaimFormSchema,
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

const getDefaultClaimValues = (
  claim?: OutpatientClaim | null,
  docAcceptanceId?: string
): OutpatientClaimForm => ({
  acceptanceId:
    claim?.acceptanceId != null ? String(claim.acceptanceId) : docAcceptanceId,
  announcementDate: claim?.announcementDate ?? undefined,
  chargePlanId:
    claim?.chargePlanId != null ? String(claim.chargePlanId) : undefined,
  claimExpertId:
    claim?.claimExpertId != null ? String(claim.claimExpertId) : undefined,
  dataSenderId:
    claim?.dataSenderId != null ? String(claim.dataSenderId) : undefined,
  description: claim?.description ?? undefined,
  dmgRegisterarId:
    claim?.dmgRegisterarId != null ? String(claim.dmgRegisterarId) : undefined,
  docDelivererAgentId:
    claim?.docDelivererAgentId != null
      ? String(claim.docDelivererAgentId)
      : undefined,
  docDeliveryKindId:
    claim?.docDeliveryKindId != null
      ? String(claim.docDeliveryKindId)
      : undefined,
  draftExpertId:
    claim?.draftExpertId != null ? String(claim.draftExpertId) : undefined,
  estimateAmount:
    claim?.estimateAmount != null ? String(claim.estimateAmount) : undefined,
  expertiseEndDate: claim?.expertiseEndDate ?? undefined,
  hasPreAuth: claim?.hasPreAuth ?? false,
  hasReturnDocs: claim?.hasReturnDocs ?? false,
  exId: claim?.exId != null ? String(claim.exId) : undefined,
  claimNo: claim?.claimNo != null ? String(claim.claimNo) : undefined,
  insuredPersonId:
    claim?.insuredPersonId != null ? String(claim.insuredPersonId) : undefined,
  isMatchedWithList: claim?.isMatchedWithList ?? false,
  isPaymentFromCash: claim?.isPaymentFromCash ?? false,
  letterNo: claim?.letterNo ?? undefined,
  medicalCenterId:
    claim?.medicalCenterId != null ? String(claim.medicalCenterId) : undefined,
  policyId: claim?.policyId != null ? String(claim.policyId) : undefined,
  statusChangeDate: claim?.statusChangeDate ?? undefined,
  exStatus: claim?.exStatus != null ? String(claim.exStatus) : undefined,
  status: claim?.status ?? 'SUBMIT',
  claimRequestId: claim?.claimRequestId ?? undefined,
  wsResult: claim?.wsResult ?? undefined,
  wsStatus: claim?.wsStatus ?? 'PROGRESS',
})

export function OutpatientClaimFormDialog() {
  const { t } = useTranslation()
  const { open, currentRow, closeDialog } = useOutpatientDocAcceptance()
  const isModalOpen = open === 'manageClaim'
  const docAcceptanceId = currentRow?.id ?? null
  const currentClaim = currentRow?.outpatientClaim ?? null
  const isEdit = Boolean(currentClaim?.id)

  const queryClient = useQueryClient()

  const defaultValues = useMemo(
    () => getDefaultClaimValues(currentClaim, docAcceptanceId ?? undefined),
    [currentClaim, docAcceptanceId]
  )

  const form = useForm<OutpatientClaimForm>({
    resolver: typedZodResolver(outpatientClaimFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (isModalOpen && docAcceptanceId) {
      form.reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, currentClaim?.id, docAcceptanceId])

  const createMutation = useMutation({
    mutationFn: async (data: OutpatientClaimForm) => {
      if (!docAcceptanceId) throw new Error('Missing doc acceptance id')
      return outpatientDocAcceptanceService.createClaim(docAcceptanceId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['outpatient-doc-acceptances'],
      })
      toast.success(t('outpatientDocAcceptances.messages.claimCreated'))
      closeDialog()
      form.reset(getDefaultClaimValues(undefined, docAcceptanceId ?? undefined))
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: OutpatientClaimForm) => {
      if (!docAcceptanceId) throw new Error('Missing doc acceptance id')
      return outpatientDocAcceptanceService.updateClaim(docAcceptanceId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['outpatient-doc-acceptances'],
      })
      toast.success(t('outpatientDocAcceptances.messages.claimUpdated'))
      closeDialog()
      form.reset(getDefaultClaimValues(undefined, docAcceptanceId ?? undefined))
    },
  })

  const onSubmit: SubmitHandler<OutpatientClaimForm> = (data) => {
    if (isEdit) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !isLoading && docAcceptanceId) {
      closeDialog()
      form.reset(getDefaultClaimValues(currentClaim, docAcceptanceId))
    }
  }

  const handleClose = () => {
    handleOpenChange(false)
  }

  if (!docAcceptanceId) {
    return null
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-6xl'>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t('outpatientDocAcceptances.claimDialog.edit')
              : t('outpatientDocAcceptances.claimDialog.create')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex h-full flex-col gap-4'
          >
            <OutpatientClaimFields />

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
