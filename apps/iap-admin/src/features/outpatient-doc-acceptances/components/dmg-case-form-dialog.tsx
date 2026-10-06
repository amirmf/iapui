import { useEffect } from 'react'

import { DmgCaseFields } from '@features/outpatient-doc-acceptances/components/dmg-case-form-dialog-fields'
import { typedZodResolver } from '@features/outpatient-doc-acceptances/components/typed-zod-resolver'
import { useDamageCasesDialog } from '@features/outpatient-doc-acceptances/context/store/damage-cases-dialog-store'
import { outpatientDocAcceptanceService } from '@features/outpatient-doc-acceptances/services/outpatient-doc-acceptance-service'
import {
  type DmgCase,
  type DmgCaseForm,
  dmgCaseFormSchema,
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

interface Props {
  docAcceptanceId: string
}

const getDefaultDmgCaseValues = (dmgCase?: DmgCase | null): DmgCaseForm => ({
  insuredPersonId:
    dmgCase?.insuredPersonId != null
      ? String(dmgCase.insuredPersonId)
      : undefined,
  serviceDate: dmgCase?.serviceDate ?? undefined,
  medicalSystemCode:
    dmgCase?.medicalSystemCode != null
      ? String(dmgCase.medicalSystemCode)
      : undefined,
  illnessId: dmgCase?.illnessId != null ? String(dmgCase.illnessId) : undefined,
  serviceDetailId:
    dmgCase?.serviceDetailId != null
      ? String(dmgCase.serviceDetailId)
      : undefined,
  serviceProvinceId:
    dmgCase?.serviceProvinceId != null
      ? String(dmgCase.serviceProvinceId)
      : undefined,
  tariffKindId:
    dmgCase?.tariffKindId != null ? String(dmgCase.tariffKindId) : undefined,
  doctorSpecialityId:
    dmgCase?.doctorSpecialityId != null
      ? String(dmgCase.doctorSpecialityId)
      : undefined,
  isFranchiseDeduction: dmgCase?.isFranchiseDeduction ?? false,
  excessFranchiseAmount:
    dmgCase?.excessFranchiseAmount != null
      ? String(dmgCase.excessFranchiseAmount)
      : undefined,
  deductionKindId:
    dmgCase?.deductionKindId != null
      ? String(dmgCase.deductionKindId)
      : undefined,
  deductionAmount:
    dmgCase?.deductionAmount != null
      ? String(dmgCase.deductionAmount)
      : undefined,
  firstInsurerShareAmount:
    dmgCase?.firstInsurerShareAmount != null
      ? String(dmgCase.firstInsurerShareAmount)
      : undefined,
  expertiseFranchisePercent:
    dmgCase?.expertiseFranchisePercent != null
      ? String(dmgCase.expertiseFranchisePercent)
      : undefined,
  otherOrganizationsShareAmount:
    dmgCase?.otherOrganizationsShareAmount != null
      ? String(dmgCase.otherOrganizationsShareAmount)
      : undefined,
  toothId: dmgCase?.toothId != null ? String(dmgCase.toothId) : undefined,
  insuredIsAdult: dmgCase?.insuredIsAdult ?? false,
  medicalCenterId:
    dmgCase?.medicalCenterId != null
      ? String(dmgCase.medicalCenterId)
      : undefined,
  drugCount: dmgCase?.drugCount != null ? String(dmgCase.drugCount) : undefined,
  deliveredDocTypeId:
    dmgCase?.deliveredDocTypeId != null
      ? String(dmgCase.deliveredDocTypeId)
      : undefined,
  preAuthId: dmgCase?.preAuthId != null ? String(dmgCase.preAuthId) : undefined,
  medicalBookLetSerialNo:
    dmgCase?.medicalBookLetSerialNo != null
      ? String(dmgCase.medicalBookLetSerialNo)
      : undefined,
  medicalBookletPageNo:
    dmgCase?.medicalBookletPageNo != null
      ? String(dmgCase.medicalBookletPageNo)
      : undefined,
  cardSerial: dmgCase?.cardSerial ?? undefined,
  deductionDesc: dmgCase?.deductionDesc ?? undefined,
  discountAmount:
    dmgCase?.discountAmount != null
      ? String(dmgCase.discountAmount)
      : undefined,
  excessOfTheInsurersCommitmentAmount:
    dmgCase?.excessOfTheInsurersCommitmentAmount != null
      ? String(dmgCase.excessOfTheInsurersCommitmentAmount)
      : undefined,
  outOfTheInsurersCommitmentAmount:
    dmgCase?.outOfTheInsurersCommitmentAmount != null
      ? String(dmgCase.outOfTheInsurersCommitmentAmount)
      : undefined,
  thePatientLedFranchise:
    dmgCase?.thePatientLedFranchise != null
      ? String(dmgCase.thePatientLedFranchise)
      : undefined,
  otherRecoverableAmount:
    dmgCase?.otherRecoverableAmount != null
      ? String(dmgCase.otherRecoverableAmount)
      : undefined,
  requestedAmount:
    dmgCase?.requestedAmount != null
      ? String(dmgCase.requestedAmount)
      : undefined,
  approvedAmount:
    dmgCase?.approvedAmount != null
      ? String(dmgCase.approvedAmount)
      : undefined,
  drugClaimId:
    dmgCase?.drugClaimId != null ? String(dmgCase.drugClaimId) : undefined,
  systemCalculated: dmgCase?.systemCalculated ?? false,
  dataSenderId:
    dmgCase?.dataSenderId != null ? String(dmgCase.dataSenderId) : undefined,
  claimId: dmgCase?.claimId != null ? String(dmgCase.claimId) : undefined,
  draftId: dmgCase?.draftId != null ? String(dmgCase.draftId) : undefined,
  firstInsurerId:
    dmgCase?.firstInsurerId != null
      ? String(dmgCase.firstInsurerId)
      : undefined,
  franchise: dmgCase?.franchise != null ? String(dmgCase.franchise) : undefined,
  exId: dmgCase?.exId != null ? String(dmgCase.exId) : undefined,
  nonPaymentReason: dmgCase?.nonPaymentReason ?? undefined,
  totalAmount:
    dmgCase?.totalAmount != null ? String(dmgCase.totalAmount) : undefined,
  isCalculated: dmgCase?.isCalculated ?? false,
  status: dmgCase?.status ?? 'SUBMIT',
  claimRequestId: dmgCase?.claimRequestId ?? undefined,
  assessmentItemId: dmgCase?.assessmentItemId ?? undefined,
  wsResult: dmgCase?.wsResult ?? undefined,
  wsStatus: dmgCase?.wsStatus ?? 'PROGRESS',
})

export function DmgCaseFormDialog(props: Props) {
  const { docAcceptanceId } = props
  const { t } = useTranslation()
  const { mode, selectedCase, reset } = useDamageCasesDialog()
  const isFormOpen = mode === 'create' || mode === 'edit'
  const activeCase = mode === 'edit' ? selectedCase : null
  const isEdit = mode === 'edit' && Boolean(activeCase?.id)
  const queryClient = useQueryClient()

  const form = useForm<DmgCaseForm>({
    resolver: typedZodResolver(dmgCaseFormSchema),
    defaultValues: getDefaultDmgCaseValues(activeCase),
  })

  useEffect(() => {
    if (isFormOpen) {
      form.reset(getDefaultDmgCaseValues(activeCase))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormOpen, activeCase?.id])

  const createMutation = useMutation({
    mutationFn: (data: DmgCaseForm) =>
      outpatientDocAcceptanceService.createDmgCase(docAcceptanceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dmg-cases', docAcceptanceId],
      })
      queryClient.invalidateQueries({
        queryKey: ['outpatient-doc-acceptances'],
      })
      toast.success(t('outpatientDocAcceptances.messages.damageCaseCreated'))
      reset()
      form.reset(getDefaultDmgCaseValues())
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: DmgCaseForm }) =>
      outpatientDocAcceptanceService.updateDmgCase(docAcceptanceId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dmg-cases', docAcceptanceId],
      })
      queryClient.invalidateQueries({
        queryKey: ['outpatient-doc-acceptances'],
      })
      toast.success(t('outpatientDocAcceptances.messages.damageCaseUpdated'))
      reset()
      form.reset(getDefaultDmgCaseValues())
    },
  })

  const onSubmit: SubmitHandler<DmgCaseForm> = (data) => {
    if (isEdit && activeCase?.id) {
      updateMutation.mutate({ id: activeCase.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !isLoading) {
      reset()
      form.reset(getDefaultDmgCaseValues())
    }
  }

  const handleClose = () => {
    handleOpenChange(false)
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-6xl'>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t('outpatientDocAcceptances.damageCaseDialog.edit')
              : t('outpatientDocAcceptances.damageCaseDialog.create')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex h-full flex-col gap-4'
          >
            <DmgCaseFields />

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
