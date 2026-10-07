import { useState } from 'react'

import { FanhubTaminPrescriptionDialog } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/fanhub-tamin-prescription-section/fanhub-tamin-prescription-dialog'
import useClaimRequestManagementData from '@features/claim-requests/pages/claim-request-management/queries/use-claim-request-management-data'
import fanhubTaminService from '@features/claim-requests/pages/claim-request-management/services/fanhub-tamin-service'
import { Button } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { useMutation } from '@tanstack/react-query'

type InquiryType = 'drug' | 'paraClinic' | 'officeService'

const inquiryServices = {
  drug: fanhubTaminService.inquireDrugPrescriptions,
  paraClinic: fanhubTaminService.inquireParaClinicPrescriptions,
  officeService: fanhubTaminService.inquireOfficeServices,
}

type FanhubTaminPrescriptionSectionProps = {
  type: InquiryType
}

function FanhubTaminPrescriptionSection(
  props: FanhubTaminPrescriptionSectionProps
) {
  const { type } = props
  const { t } = useTranslation()
  const { data: claimRequest } = useClaimRequestManagementData()
  const [open, setOpen] = useState(false)
  const prescriptionDate = claimRequest?.submitDate
  const canInquire = Boolean(prescriptionDate)

  const inquiryMutation = useMutation({
    mutationFn: inquiryServices[type],
  })

  const handleOpen = () => {
    if (!prescriptionDate || !claimRequest?.extNationalCode) return

    inquiryMutation.mutate({
      nationalCode: claimRequest.extNationalCode,
      prescriptionDate,
    })
    setOpen(true)
  }

  const handleInquiry = (nationalCode: string) => {
    if (!nationalCode || !prescriptionDate) return

    inquiryMutation.mutate({ nationalCode, prescriptionDate })
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!inquiryMutation.isPending) setOpen(nextOpen)
  }

  return (
    <>
      <Button
        type='button'
        variant='default'
        size='xs'
        onClick={handleOpen}
        disabled={!canInquire || inquiryMutation.isPending}
        title={
          canInquire
            ? undefined
            : t('claimRequests.taminPrescriptions.missingServiceDate')
        }
      >
        {inquiryMutation.isPending
          ? t('common.loading')
          : t(`claimRequests.taminPrescriptions.types.${type}` as never)}
      </Button>

      <FanhubTaminPrescriptionDialog
        type={type}
        open={open}
        onOpenChange={handleOpenChange}
        nationalCode={claimRequest?.extNationalCode ?? ''}
        onSubmit={handleInquiry}
        data={inquiryMutation.data}
        error={inquiryMutation.error}
        isPending={inquiryMutation.isPending}
        isError={inquiryMutation.isError}
      />
    </>
  )
}

export function ClaimRequestTaminDrugPrescriptionsSection() {
  return <FanhubTaminPrescriptionSection type='drug' />
}

export function ClaimRequestTaminParaClinicPrescriptionsSection() {
  return <FanhubTaminPrescriptionSection type='paraClinic' />
}

export function ClaimRequestTaminOfficeServicesSection() {
  return <FanhubTaminPrescriptionSection type='officeService' />
}
