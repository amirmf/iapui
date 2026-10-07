import { ClaimRequestDoctorLookupSection } from '@features/assessment-items/components/claim-request-doctor-lookup-section'
import { useAssessmentItemDialog } from '@features/assessment-items/context/store/assessment-item-dialog-store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

export function AssessmentItemDoctorLookupDialog() {
  const { activeDialog, setActiveDialog } = useAssessmentItemDialog()

  const { t } = useTranslate()

  return (
    <Dialog
      open={activeDialog === 'doctor-lookup'}
      onOpenChange={(open) => setActiveDialog(open ? 'doctor-lookup' : null)}
    >
      <DialogContent presentation='reference' className='sm:max-w-150'>
        <DialogHeader>
          <DialogTitle>{t('claimRequests.doctorLookup.button')}</DialogTitle>
          <DialogDescription>
            {t('claimRequests.doctorLookup.inputPlaceholder')}
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <ClaimRequestDoctorLookupSection />
        </div>
      </DialogContent>
    </Dialog>
  )
}
