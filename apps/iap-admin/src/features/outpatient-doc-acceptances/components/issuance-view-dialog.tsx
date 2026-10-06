import { useOutpatientDocAcceptance } from '@features/outpatient-doc-acceptances/context/store/outpatient-doc-acceptance-store'
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

export function IssuanceViewDialog() {
  const { t } = useTranslation()
  const { open, currentRow, closeDialog } = useOutpatientDocAcceptance()
  const isModalOpen = open === 'viewIssuance'
  const issuance = currentRow?.outpatientClaim?.issuance ?? null
  const formatBoolean = (value?: boolean | null) => {
    if (value === undefined || value === null) {
      return '-'
    }
    return value ? t('common.yes') : t('common.no')
  }

  if (!issuance) {
    return null
  }

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      closeDialog()
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-4xl'>
        <DialogHeader>
          <DialogTitle>
            {t('outpatientDocAcceptances.issuanceDialog.details')}
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardContent className='grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3'>
            {[
              {
                label: t('outpatientDocAcceptances.issuanceFields.id'),
                value: issuance.id,
              },
              {
                label: t('outpatientDocAcceptances.issuanceFields.draftKindId'),
                value: issuance.draftKindId,
              },
              {
                label: t('outpatientDocAcceptances.issuanceFields.description'),
                value: issuance.description,
              },
              {
                label: t(
                  'outpatientDocAcceptances.issuanceFields.certificationExpertId'
                ),
                value: issuance.certificationExpertId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.issuanceFields.complementReasonId'
                ),
                value: issuance.complementReasonId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.issuanceFields.dataSenderId'
                ),
                value: issuance.dataSenderId,
              },
              {
                label: t('outpatientDocAcceptances.issuanceFields.amount'),
                value: issuance.amount,
              },
              {
                label: t('outpatientDocAcceptances.issuanceFields.autoCalc'),
                value: formatBoolean(issuance.autoCalc),
              },
              {
                label: t('outpatientDocAcceptances.issuanceFields.claimId'),
                value: issuance.claimId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.issuanceFields.docAcceptanceId'
                ),
                value: issuance.docAcceptanceId,
              },
              {
                label: t('outpatientDocAcceptances.issuanceFields.draftNo'),
                value: issuance.draftNo,
              },
              {
                label: t(
                  'outpatientDocAcceptances.issuanceFields.draftReasonId'
                ),
                value: issuance.draftReasonId,
              },
              {
                label: t('outpatientDocAcceptances.issuanceFields.reasonId'),
                value: issuance.reasonId,
              },
              {
                label: t('outpatientDocAcceptances.issuanceFields.exId'),
                value: issuance.exId,
              },
              {
                label: t('outpatientDocAcceptances.issuanceFields.isComfort'),
                value: formatBoolean(issuance.isComfort),
              },
              {
                label: t('outpatientDocAcceptances.issuanceFields.issuDate'),
                value: issuance.issuDate,
              },
              {
                label: t('outpatientDocAcceptances.issuanceFields.sourceId'),
                value: issuance.sourceId,
              },
              {
                label: t('outpatientDocAcceptances.issuanceFields.exStatus'),
                value: issuance.exStatus,
              },
              {
                label: t('outpatientDocAcceptances.issuanceFields.calcTime'),
                value: issuance.calcTime,
              },
              {
                label: t('outpatientDocAcceptances.issuanceFields.changeTime'),
                value: issuance.changeTime,
              },
              {
                label: t(
                  'outpatientDocAcceptances.issuanceFields.paymentPreparationTime'
                ),
                value: issuance.paymentPreparationTime,
              },
              {
                label: t(
                  'outpatientDocAcceptances.issuanceFields.calcJobStatus'
                ),
                value: issuance.calcJobStatus,
              },
              {
                label: t('outpatientDocAcceptances.issuanceFields.status'),
                value: issuance.status,
              },
              {
                label: t(
                  'outpatientDocAcceptances.issuanceFields.claimRequestId'
                ),
                value: issuance.claimRequestId,
              },
              {
                label: t('outpatientDocAcceptances.issuanceFields.wsStatus'),
                value: issuance.wsStatus,
              },
              {
                label: t('outpatientDocAcceptances.issuanceFields.wsResult'),
                value: issuance.wsResult,
              },
              {
                label: t('outpatientDocAcceptances.issuanceFields.dmgCases'),
                value: issuance.dmgCases?.length ?? 0,
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
