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

export function OutpatientClaimViewDialog() {
  const { t } = useTranslation()
  const { open, currentRow, closeDialog } = useOutpatientDocAcceptance()
  const isModalOpen = open === 'viewClaim'
  const claim = currentRow?.outpatientClaim ?? null
  const formatBoolean = (value?: boolean | null) => {
    if (value === undefined || value === null) {
      return '-'
    }
    return value ? t('common.yes') : t('common.no')
  }

  if (!claim) {
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
            {t('outpatientDocAcceptances.claimDialog.details')}
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardContent className='grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3'>
            {[
              {
                label: t('outpatientDocAcceptances.claimFields.id'),
                value: claim.id,
              },
              {
                label: t('outpatientDocAcceptances.claimFields.acceptanceId'),
                value: claim.acceptanceId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.claimFields.announcementDate'
                ),
                value: claim.announcementDate,
              },
              {
                label: t('outpatientDocAcceptances.claimFields.chargePlanId'),
                value: claim.chargePlanId,
              },
              {
                label: t('outpatientDocAcceptances.claimFields.claimExpertId'),
                value: claim.claimExpertId,
              },
              {
                label: t('outpatientDocAcceptances.claimFields.dataSenderId'),
                value: claim.dataSenderId,
              },
              {
                label: t('outpatientDocAcceptances.claimFields.description'),
                value: claim.description,
              },
              {
                label: t(
                  'outpatientDocAcceptances.claimFields.dmgRegisterarId'
                ),
                value: claim.dmgRegisterarId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.claimFields.docDelivererAgentId'
                ),
                value: claim.docDelivererAgentId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.claimFields.docDeliveryKindId'
                ),
                value: claim.docDeliveryKindId,
              },
              {
                label: t('outpatientDocAcceptances.claimFields.draftExpertId'),
                value: claim.draftExpertId,
              },
              {
                label: t('outpatientDocAcceptances.claimFields.estimateAmount'),
                value: claim.estimateAmount,
              },
              {
                label: t(
                  'outpatientDocAcceptances.claimFields.expertiseEndDate'
                ),
                value: claim.expertiseEndDate,
              },
              {
                label: t('outpatientDocAcceptances.claimFields.hasPreAuth'),
                value: formatBoolean(claim.hasPreAuth),
              },
              {
                label: t('outpatientDocAcceptances.claimFields.hasReturnDocs'),
                value: formatBoolean(claim.hasReturnDocs),
              },
              {
                label: t('outpatientDocAcceptances.claimFields.exId'),
                value: claim.exId,
              },
              {
                label: t('outpatientDocAcceptances.claimFields.claimNo'),
                value: claim.claimNo,
              },
              {
                label: t(
                  'outpatientDocAcceptances.claimFields.insuredPersonId'
                ),
                value: claim.insuredPersonId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.claimFields.isMatchedWithList'
                ),
                value: formatBoolean(claim.isMatchedWithList),
              },
              {
                label: t(
                  'outpatientDocAcceptances.claimFields.isPaymentFromCash'
                ),
                value: formatBoolean(claim.isPaymentFromCash),
              },
              {
                label: t('outpatientDocAcceptances.claimFields.letterNo'),
                value: claim.letterNo,
              },
              {
                label: t(
                  'outpatientDocAcceptances.claimFields.medicalCenterId'
                ),
                value: claim.medicalCenterId,
              },
              {
                label: t('outpatientDocAcceptances.claimFields.policyId'),
                value: claim.policyId,
              },
              {
                label: t(
                  'outpatientDocAcceptances.claimFields.statusChangeDate'
                ),
                value: claim.statusChangeDate,
              },
              {
                label: t('outpatientDocAcceptances.claimFields.exStatus'),
                value: claim.exStatus,
              },
              {
                label: t('outpatientDocAcceptances.claimFields.status'),
                value: claim.status,
              },
              {
                label: t('outpatientDocAcceptances.claimFields.claimRequestId'),
                value: claim.claimRequestId,
              },
              {
                label: t('outpatientDocAcceptances.claimFields.wsStatus'),
                value: claim.wsStatus,
              },
              {
                label: t('outpatientDocAcceptances.claimFields.wsResult'),
                value: claim.wsResult,
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
