import { useDamageCasesDialog } from '@features/outpatient-doc-acceptances/context/store/damage-cases-dialog-store'
import { Card, CardContent } from '@iap/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@iap/ui'
import { useTranslation } from 'react-i18next'

const InfoItem = (props: { label: string; value?: React.ReactNode }) => {
  const { label, value } = props
  return (
    <div className='space-y-1 rounded-md border p-3'>
      <div className='text-xs font-medium uppercase text-muted-foreground'>
        {label}
      </div>
      <div className='text-sm font-semibold'>{value ?? '-'}</div>
    </div>
  )
}

export function DmgCaseViewDialog() {
  const { t } = useTranslation()
  const { mode, selectedCase, reset } = useDamageCasesDialog()
  const isOpen = mode === 'view' && Boolean(selectedCase)
  const formatBoolean = (value?: boolean | null) => {
    if (value === undefined || value === null) {
      return '-'
    }
    return value ? t('common.yes') : t('common.no')
  }

  if (!isOpen || !selectedCase) {
    return null
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset()
        }
      }}
    >
      <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-5xl'>
        <DialogHeader>
          <DialogTitle>
            {t('outpatientDocAcceptances.damageCaseDialog.details')}
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardContent className='grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3'>
            {[
              {
                label: t('outpatientDocAcceptances.damageCaseFields.id'),
                value: selectedCase.id,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.insuredPersonId'
                ),
                value: selectedCase.insuredPersonId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.serviceDate'
                ),
                value: selectedCase.serviceDate,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.medicalSystemCode'
                ),
                value: selectedCase.medicalSystemCode,
              },
              {
                label: t('outpatientDocAcceptances.damageCaseFields.illnessId'),
                value: selectedCase.illnessId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.serviceDetailId'
                ),
                value: selectedCase.serviceDetailId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.serviceProvinceId'
                ),
                value: selectedCase.serviceProvinceId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.tariffKindId'
                ),
                value: selectedCase.tariffKindId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.doctorSpecialityId'
                ),
                value: selectedCase.doctorSpecialityId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.isFranchiseDeduction'
                ),
                value: formatBoolean(selectedCase.isFranchiseDeduction),
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.excessFranchiseAmount'
                ),
                value: selectedCase.excessFranchiseAmount,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.deductionKindId'
                ),
                value: selectedCase.deductionKindId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.deductionAmount'
                ),
                value: selectedCase.deductionAmount,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.firstInsurerShareAmount'
                ),
                value: selectedCase.firstInsurerShareAmount,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.expertiseFranchisePercent'
                ),
                value: selectedCase.expertiseFranchisePercent,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.otherOrganizationsShareAmount'
                ),
                value: selectedCase.otherOrganizationsShareAmount,
              },
              {
                label: t('outpatientDocAcceptances.damageCaseFields.toothId'),
                value: selectedCase.toothId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.insuredIsAdult'
                ),
                value: formatBoolean(selectedCase.insuredIsAdult),
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.medicalCenterId'
                ),
                value: selectedCase.medicalCenterId,
              },
              {
                label: t('outpatientDocAcceptances.damageCaseFields.drugCount'),
                value: selectedCase.drugCount,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.deliveredDocTypeId'
                ),
                value: selectedCase.deliveredDocTypeId,
              },
              {
                label: t('outpatientDocAcceptances.damageCaseFields.preAuthId'),
                value: selectedCase.preAuthId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.medicalBookLetSerialNo'
                ),
                value: selectedCase.medicalBookLetSerialNo,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.medicalBookletPageNo'
                ),
                value: selectedCase.medicalBookletPageNo,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.cardSerial'
                ),
                value: selectedCase.cardSerial,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.deductionDesc'
                ),
                value: selectedCase.deductionDesc,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.discountAmount'
                ),
                value: selectedCase.discountAmount,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.excessOfTheInsurersCommitmentAmount'
                ),
                value: selectedCase.excessOfTheInsurersCommitmentAmount,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.outOfTheInsurersCommitmentAmount'
                ),
                value: selectedCase.outOfTheInsurersCommitmentAmount,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.thePatientLedFranchise'
                ),
                value: selectedCase.thePatientLedFranchise,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.otherRecoverableAmount'
                ),
                value: selectedCase.otherRecoverableAmount,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.requestedAmount'
                ),
                value: selectedCase.requestedAmount,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.approvedAmount'
                ),
                value: selectedCase.approvedAmount,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.drugClaimId'
                ),
                value: selectedCase.drugClaimId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.systemCalculated'
                ),
                value: formatBoolean(selectedCase.systemCalculated),
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.dataSenderId'
                ),
                value: selectedCase.dataSenderId,
              },
              {
                label: t('outpatientDocAcceptances.damageCaseFields.claimId'),
                value: selectedCase.claimId,
              },
              {
                label: t('outpatientDocAcceptances.damageCaseFields.draftId'),
                value: selectedCase.draftId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.firstInsurerId'
                ),
                value: selectedCase.firstInsurerId,
              },
              {
                label: t('outpatientDocAcceptances.damageCaseFields.franchise'),
                value: selectedCase.franchise,
              },
              {
                label: t('outpatientDocAcceptances.damageCaseFields.exId'),
                value: selectedCase.exId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.nonPaymentReason'
                ),
                value: selectedCase.nonPaymentReason,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.totalAmount'
                ),
                value: selectedCase.totalAmount,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.isCalculated'
                ),
                value: formatBoolean(selectedCase.isCalculated),
              },
              {
                label: t('outpatientDocAcceptances.damageCaseFields.status'),
                value: selectedCase.status,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.claimRequestId'
                ),
                value: selectedCase.claimRequestId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.damageCaseFields.assessmentItemId'
                ),
                value: selectedCase.assessmentItemId,
              },
              {
                label: t('outpatientDocAcceptances.damageCaseFields.wsResult'),
                value: selectedCase.wsResult,
              },
              {
                label: t('outpatientDocAcceptances.damageCaseFields.wsStatus'),
                value: selectedCase.wsStatus,
              },
            ].map((item) => (
              <InfoItem
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
